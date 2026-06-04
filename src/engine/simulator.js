import { CPU, AVRIOPort, portBConfig, portCConfig, portDConfig, AVRTimer, timer0Config, timer1Config, timer2Config } from 'avr8js';
import { componentRegistry } from './componentRegistry.js';

function loadHex(source, target) {
  for (const line of source.split('\n')) {
    if (line[0] === ':' && line.substr(7, 2) === '00') {
      const bytes = parseInt(line.substr(1, 2), 16);
      const addr = parseInt(line.substr(3, 4), 16);
      for (let i = 0; i < bytes; i++) {
        target[addr + i] = parseInt(line.substr(9 + i * 2, 2), 16);
      }
    }
  }
}

export class CircuitSimulator {
    constructor() {
        this.poweredComponents = new Set();
        this.cpu = null;
        this.ports = {};
        this.isRunning = false;
        this.animationFrame = null;
    }

    startSimulation(hexString, connections) {
        if (this.isRunning) this.stopSimulation();
        this.isRunning = true;
        this.hasWarnedShort = false;
        
        // 1. Initialize AVR CPU
        // ATmega328p has 32KB flash
        const program = new Uint16Array(16384);
        const programBytes = new Uint8Array(program.buffer);
        loadHex(hexString, programBytes);
        
        this.cpu = new CPU(program);
        
        // 2. Initialize Timers (required for delay(), millis(), etc.)
        const timer0 = new AVRTimer(this.cpu, timer0Config);
        const timer1 = new AVRTimer(this.cpu, timer1Config);
        const timer2 = new AVRTimer(this.cpu, timer2Config);
        
        // 3. Initialize IO Ports
        this.ports = {
            B: new AVRIOPort(this.cpu, portBConfig),
            C: new AVRIOPort(this.cpu, portCConfig),
            D: new AVRIOPort(this.cpu, portDConfig)
        };
        
        // 4. Start execution loop
        this.runLoop(connections);
    }
    
    stopSimulation() {
        this.isRunning = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        this.cpu = null;
        this.poweredComponents.clear();
    }
    
    runLoop(connections) {
        if (!this.isRunning || !this.cpu) return;
        
        // Run CPU for 16ms of simulated time at 16MHz (16,000,000 cycles / second -> 16,000 cycles / ms)
        // -> 256,000 cycles per 16ms frame (approx 60fps)
        // Note: execute() runs up to the given cycle count
        const targetCycles = this.cpu.cycles + 256000;
        
        try {
            while (this.cpu.cycles < targetCycles) {
                const instruction = this.cpu.read16(this.cpu.pc);
                this.cpu.tick();
            }
        } catch (e) {
            console.error("AVR Execution Error:", e);
            this.stopSimulation();
            return;
        }
        
        this.updateCircuitVisuals(connections);
        
        this.animationFrame = requestAnimationFrame(() => this.runLoop(connections));
    }
    
    updateCircuitVisuals(connections) {
        // Map AVR Port states to Arduino Uno Pin Names
        // PORTB: PB0-PB5 (D8-D13)
        // PORTC: PC0-PC5 (A0-A5)
        // PORTD: PD0-PD7 (D0-D7)
        
        const pinStates = {};
        
        // Helper to check if a pin is HIGH (1)
        // avr8js pinState: 0=Low, 1=High, 2=Input, 3=InputPullup
        for (let i=0; i<6; i++) pinStates[`D${i+8}`] = this.ports.B.pinState(i) === 1;
        for (let i=0; i<6; i++) pinStates[`A${i}`]   = this.ports.C.pinState(i) === 1;
        for (let i=0; i<8; i++) pinStates[`D${i}`]   = this.ports.D.pinState(i) === 1;
        
        // Now, figure out which external components are powered based on the Arduino's output pins.
        this.poweredComponents.clear();
        
        const pinGraph = {};
        const addEdge = (u, v) => {
            if (!pinGraph[u]) pinGraph[u] = [];
            pinGraph[u].push(v);
        };

        connections.forEach(conn => {
            addEdge(conn.from, conn.to);
            addEdge(conn.to, conn.from);
        });

        componentRegistry.forEach(comp => {
            const id = comp.id;
            if (comp.type === 'Resistor' || comp.id.includes('resistor')) {
                addEdge(`${id}.pin1`, `${id}.pin2`);
                addEdge(`${id}.pin2`, `${id}.pin1`);
            } else if (comp.type === 'LED' || comp.id.includes('led')) {
                addEdge(`${id}.anode`, `${id}.cathode`);
            }
        });

        const placedIds = [];
        document.querySelectorAll('.placed-component').forEach(el => {
            placedIds.push(el.dataset.componentId);
        });

        const sources = [];
        const grounds = new Set();

        componentRegistry.forEach(comp => {
            const cid = comp.id;
            
            // Power Sources
            if (cid.includes('battery') || cid.includes('solar') || cid.includes('power')) {
                sources.push(`${cid}.+`, `${cid}.VCC`, `${cid}.5V`, `${cid}.9V`);
                grounds.add(`${cid}.-`);
                grounds.add(`${cid}.GND`);
            }

            // Microcontrollers
            if (cid.includes('arduino') || cid.includes('esp') || cid.includes('pico')) {
                // Hardcoded Power Pins
                sources.push(`${cid}.5V`, `${cid}.3V3`, `${cid}.VCC`, `${cid}.VBUS`, `${cid}.VSYS`);
                grounds.add(`${cid}.GND`);
                grounds.add(`${cid}.AGND`);
                
                // Map active HIGH pins to sources
                Object.keys(pinStates).forEach(pin => {
                    const isHigh = pinStates[pin];
                    
                    // Standard Arduino mapping (D0-D13, A0-A5)
                    const mappedPins = [`${cid}.${pin}`];
                    
                    // ESP/Pico number mapping: D4 -> GPIO4, GP4
                    const numMatch = pin.match(/\d+/);
                    if (numMatch) {
                        const n = numMatch[0];
                        mappedPins.push(`${cid}.GPIO${n}`, `${cid}.GP${n}`);
                    }
                    
                    mappedPins.forEach(p => {
                        if (isHigh) {
                            sources.push(p);
                        } else {
                            grounds.add(p);
                        }
                    });
                });
            }
        });

        // Helper to check reachability in undirected graph
        const canReach = (startPin, targets) => {
            if (targets instanceof Set ? targets.has(startPin) : targets.includes(startPin)) return true;
            const queue = [startPin];
            const visited = new Set([startPin]);
            while(queue.length > 0) {
                const curr = queue.shift();
                if (targets instanceof Set ? targets.has(curr) : targets.includes(curr)) return true;
                const neighbors = pinGraph[curr] || [];
                for (const n of neighbors) {
                    if (!visited.has(n)) {
                        visited.add(n);
                        queue.push(n);
                    }
                }
            }
            return false;
        };

        // Evaluate L298N logic dynamically
        placedIds.forEach(id => {
            if (id.startsWith('l298n')) {
                // Allow either 12V or 5V to power the motor driver for easier simulation
                const isPowered = (canReach(`${id}.12V`, sources) || canReach(`${id}.5V`, sources)) && canReach(`${id}.GND`, grounds);
                if (!isPowered) {
                    return; // Driver needs power to function!
                }
                
                const in1 = canReach(`${id}.IN1`, sources);
                const in2 = canReach(`${id}.IN2`, sources);
                const in3 = canReach(`${id}.IN3`, sources);
                const in4 = canReach(`${id}.IN4`, sources);
                const ena = canReach(`${id}.ENA`, sources) || true; // Assuming jumper is on by default if not connected
                const enb = canReach(`${id}.ENB`, sources) || true;

                if (ena) {
                    if (in1 && !in2) {
                        sources.push(`${id}.OUT1`);
                        grounds.add(`${id}.OUT2`);
                    } else if (!in1 && in2) {
                        sources.push(`${id}.OUT2`);
                        grounds.add(`${id}.OUT1`);
                    }
                }
                
                if (enb) {
                    if (in3 && !in4) {
                        sources.push(`${id}.OUT3`);
                        grounds.add(`${id}.OUT4`);
                    } else if (!in3 && in4) {
                        sources.push(`${id}.OUT4`);
                        grounds.add(`${id}.OUT3`);
                    }
                }
            }
        });

        sources.forEach(source => {
            this._findPathsToGround(source, grounds, pinGraph, sources);
        });

        // Evaluate kinematics for 4wd-car-chassis
        placedIds.forEach(id => {
            if (id.startsWith('4wd-car-chassis')) {
                const m1f = canReach(`${id}.M1+`, sources) && canReach(`${id}.M1-`, grounds);
                const m1r = canReach(`${id}.M1-`, sources) && canReach(`${id}.M1+`, grounds);
                
                const m2f = canReach(`${id}.M2+`, sources) && canReach(`${id}.M2-`, grounds);
                const m2r = canReach(`${id}.M2-`, sources) && canReach(`${id}.M2+`, grounds);
                
                const m3f = canReach(`${id}.M3+`, sources) && canReach(`${id}.M3-`, grounds);
                const m3r = canReach(`${id}.M3-`, sources) && canReach(`${id}.M3+`, grounds);
                
                const m4f = canReach(`${id}.M4+`, sources) && canReach(`${id}.M4-`, grounds);
                const m4r = canReach(`${id}.M4-`, sources) && canReach(`${id}.M4+`, grounds);
                
                // M1 (FL), M3 (RL) -> Left side
                // M2 (FR), M4 (RR) -> Right side
                let leftSpeed = 0;
                if (m1f || m3f) leftSpeed = 1;
                else if (m1r || m3r) leftSpeed = -1;
                
                let rightSpeed = 0;
                if (m2f || m4f) rightSpeed = 1;
                else if (m2r || m4r) rightSpeed = -1;
                
                const el = document.querySelector(`.placed-component[data-component-id="${id}"]`);
                if (!el) return;
                
                el.dataset.m1 = m1f ? '1' : (m1r ? '-1' : '0');
                el.dataset.m2 = m2f ? '1' : (m2r ? '-1' : '0');
                el.dataset.m3 = m3f ? '1' : (m3r ? '-1' : '0');
                el.dataset.m4 = m4f ? '1' : (m4r ? '-1' : '0');
                
                if (leftSpeed !== 0 || rightSpeed !== 0) {
                    this.poweredComponents.add(id);
                }

                if (!el.physics) {
                    el.physics = { 
                        x: parseFloat(el.style.left) || 0, 
                        y: parseFloat(el.style.top) || 0, 
                        rotation: 0 
                    };
                    el.style.transformOrigin = "center center";
                }
                
                const speedMult = 2.0;
                const rotMult = 0.05;
                
                const v = (leftSpeed + rightSpeed) * speedMult;
                const omega = (rightSpeed - leftSpeed) * rotMult;
                
                if (v !== 0 || omega !== 0) {
                    el.physics.rotation += omega;
                    el.physics.x += v * Math.sin(el.physics.rotation);
                    el.physics.y -= v * Math.cos(el.physics.rotation);
                    
                    el.style.left = `${el.physics.x}px`;
                    el.style.top = `${el.physics.y}px`;
                    const scale = el.dataset.scale || 1;
                    el.style.transform = `scale(${scale}) rotate(${el.physics.rotation}rad)`;
                    
                    if (window.renderWires) window.renderWires();
                }
            }
        });
        
        // Update DOM classes
        document.querySelectorAll('.placed-component').forEach(el => {
            const id = el.dataset.componentId;
            if (this.poweredComponents.has(id)) {
                el.classList.add('led-lit');
            } else {
                el.classList.remove('led-lit');
            }
        });
    }

    _findPathsToGround(startPin, groundPins, graph, sources) {
        // Basic short circuit detection
        const shorted = sources.filter(s => groundPins.has(s));
        if (shorted.length > 0) {
            console.warn('Short circuit detected between:', shorted);
            if (window.showToast && !this.hasWarnedShort) {
                window.showToast('Short circuit detected! Please check wiring.', 'error');
                this.hasWarnedShort = true;
            }
        }

        const queue = [[startPin]];
        const visited = new Set();
        
        while (queue.length > 0) {
            const path = queue.shift();
            const currentPin = path[path.length - 1];

            if (groundPins.has(currentPin)) {
                path.forEach(pin => {
                    const compId = pin.split('.')[0];
                    this.poweredComponents.add(compId);
                });
                continue;
            }

            if (!visited.has(currentPin)) {
                visited.add(currentPin);
                const neighbors = graph[currentPin] || [];
                neighbors.forEach(neighbor => {
                    if (!visited.has(neighbor)) {
                        queue.push([...path, neighbor]);
                    }
                });
            }
        }
    }
}

export const simulator = new CircuitSimulator();
