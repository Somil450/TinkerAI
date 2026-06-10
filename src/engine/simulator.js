import { CPU, AVRIOPort, portBConfig, portCConfig, portDConfig, AVRTimer, timer0Config, timer1Config, timer2Config, AVRUSART, usart0Config } from 'avr8js';
import { componentRegistry } from './componentRegistry.js';
import { evaluateLogic, evaluatePhysics } from './models.js';

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
        
        // 4. Initialize Serial Monitor (USART0)
        this.usart = new AVRUSART(this.cpu, usart0Config, 16e6);
        this.usart.onByteTransmit = (data) => {
            if (this.onSerialData) {
                this.onSerialData(String.fromCharCode(data));
            }
        };
        
        // 5. Start execution loop
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

        // Add manually toggled pins from Hardware Tester
        if (window.manualPinStates) {
            Object.keys(window.manualPinStates).forEach(pinId => {
                const state = window.manualPinStates[pinId];
                if (state === 'HIGH') {
                    sources.push(pinId);
                    // Ensure it's not in grounds if it was previously
                    grounds.delete(pinId);
                } else if (state === 'LOW') {
                    grounds.add(pinId);
                }
            });
        }

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

        // Phase 1: Update Logic (Propagate signals)
        placedIds.forEach(id => {
            const el = document.querySelector(`.placed-component[data-component-id="${id}"]`);
            if (!el) return;
            
            let type = id.substring(0, id.lastIndexOf('_'));
            if (!type) type = id;

            evaluateLogic(id, type, sources, grounds, this.poweredComponents, el, canReach, pinStates);
        });

        // Let the ground tracing finish for all sources, which now may include newly added outputs from models
        sources.forEach(source => {
            this._findPathsToGround(source, grounds, pinGraph, sources);
        });

        // Phase 2: Update Physics (Actuators, Animations)
        placedIds.forEach(id => {
            const el = document.querySelector(`.placed-component[data-component-id="${id}"]`);
            if (!el) return;
            
            let type = id.substring(0, id.lastIndexOf('_'));
            if (!type) type = id;

            evaluatePhysics(id, type, sources, grounds, this.poweredComponents, el, canReach, pinStates);
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
