/**
 * TinkerAI Circuit Simulator
 * Two-mode simulation engine:
 *   1. JavaScript Interpreter (ALL MCUs) — primary, instant
 *   2. AVR emulator via avr8js (Arduino Uno/Nano/Mega only) — optional high-fidelity
 */
import { CPU, AVRIOPort, portBConfig, portCConfig, portDConfig, AVRTimer, timer0Config, timer1Config, timer2Config, AVRUSART, usart0Config, PinState } from 'avr8js';
import { componentRegistry } from './componentRegistry.js';
import { evaluateLogic, evaluatePhysics } from './models.js';
import { arduinoInterpreter } from './arduinoInterpreter.js';

function loadHex(source, target) {
    for (const line of source.split('\n')) {
        if (line[0] === ':' && line.substr(7, 2) === '00') {
            const bytes = parseInt(line.substr(1, 2), 16);
            const addr  = parseInt(line.substr(3, 4), 16);
            for (let i = 0; i < bytes; i++) {
                target[addr + i] = parseInt(line.substr(9 + i * 2, 2), 16);
            }
        }
    }
}

export class CircuitSimulator {
    constructor() {
        this.poweredComponents = new Set();
        this.cpu               = null;
        this.ports             = {};
        this.isRunning         = false;
        this.animationFrame    = null;
        this.onSerialData      = null;
        this.mode              = 'js'; // 'js' | 'avr'
        this._pinStates        = {};   // pin -> 0 | 1
        this._pwmValues        = {};   // pin -> 0-255
        this._servoAngles      = {};   // pin -> 0-180
        this._lcdText          = null; // string
        this._oledBuffer       = null;
    }

    // ── Public API ────────────────────────────────────────────────────────────

    /**
     * Start simulation in JS mode (all MCUs).
     * @param {string} sourceCode - Arduino C++ source
     * @param {Array}  connections - wire connections from getConnections()
     */
    startJSSimulation(sourceCode, connections) {
        if (this.isRunning) this.stopSimulation();
        this.isRunning = true;
        this.mode = 'js';
        this._pinStates = {};
        this._pwmValues = {};
        this._servoAngles = {};
        this._lcdText = null;
        this.poweredComponents.clear();

        // Hook interpreter callbacks — update simulator state in real time
        arduinoInterpreter.onPinChange = (pin, value, mode) => {
            if (pin === '*') {
                // Full reset
                this._pinStates   = {};
                this._pwmValues   = {};
                this._servoAngles = {};
            } else if (mode === 'servo') {
                this._servoAngles[pin] = value;
                this._pinStates[pin]   = value > 0 ? 1 : 0;
            } else if (mode === true) {
                // PWM
                this._pwmValues[pin] = value;
                this._pinStates[pin] = value > 0 ? 1 : 0;
            } else {
                // Digital HIGH/LOW
                this._pinStates[pin] = value ? 1 : 0;
            }
        };

        arduinoInterpreter.onSerial = (text) => {
            this.onSerialData && this.onSerialData(text);
        };

        // Window hooks for LCD / OLED display updates
        window.simUpdateLCD = (text) => {
            this._lcdText = text;
            this._updateLCDDisplay(text);
        };
        window.simUpdateOLED = (pixels, text, x, y, size) => {
            this._updateOLEDDisplay(text, x, y, size);
        };

        // Start interpreter
        arduinoInterpreter.run(sourceCode);

        // Start visual update loop
        this._visualLoop(connections);
    }

    /**
     * Start simulation in AVR mode (Arduino Uno/Nano/Mega only).
     * @param {string} hexString - compiled Intel HEX
     * @param {Array}  connections
     */
    startSimulation(hexString, connections) {
        if (this.isRunning) this.stopSimulation();
        this.isRunning = true;
        this.mode = 'avr';
        this.hasWarnedShort = false;
        this._pinStates = {};
        this._pwmValues = {};
        this.poweredComponents.clear();

        const program      = new Uint16Array(16384);
        const programBytes = new Uint8Array(program.buffer);
        loadHex(hexString, programBytes);

        this.cpu = new CPU(program);

        // Timers (required for delay(), millis())
        new AVRTimer(this.cpu, timer0Config);
        new AVRTimer(this.cpu, timer1Config);
        new AVRTimer(this.cpu, timer2Config);

        // IO Ports
        this.ports = {
            B: new AVRIOPort(this.cpu, portBConfig),
            C: new AVRIOPort(this.cpu, portCConfig),
            D: new AVRIOPort(this.cpu, portDConfig)
        };

        // Serial Monitor
        this.usart = new AVRUSART(this.cpu, usart0Config, 16e6);
        this.usart.onByteTransmit = (data) => {
            this.onSerialData && this.onSerialData(String.fromCharCode(data));
        };

        this._avrLoop(connections);
    }

    stopSimulation() {
        this.isRunning = false;

        // Stop JS interpreter
        if (this.mode === 'js') {
            arduinoInterpreter.stop();
        }

        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }

        this.cpu  = null;
        this._pinStates = {};
        this._pwmValues = {};
        this._servoAngles = {};
        this._lcdText = null;
        this.poweredComponents.clear();

        // Reset all component visuals
        this._resetVisuals();
    }

    // ── Visual Update Loops ───────────────────────────────────────────────────

    _visualLoop(connections) {
        if (!this.isRunning || this.mode !== 'js') return;
        this.updateCircuitVisuals(connections);
        this.animationFrame = requestAnimationFrame(() => this._visualLoop(connections));
    }

    _avrLoop(connections) {
        if (!this.isRunning || this.mode !== 'avr' || !this.cpu) return;

        // Run 16ms worth of AVR cycles at 16MHz (approx 256,000 cycles)
        const targetCycles = this.cpu.cycles + 256000;
        
        const executeChunk = () => {
            if (!this.isRunning || this.mode !== 'avr' || !this.cpu) return;
            
            const startTime = performance.now();
            let steps = 0;
            
            try {
                while (this.cpu.cycles < targetCycles) {
                    const prevCycles = this.cpu.cycles;
                    this.cpu.tick();
                    
                    // Failsafe: If CPU doesn't advance cycles (e.g. infinite sleep), force advance
                    if (this.cpu.cycles === prevCycles) {
                        this.cpu.cycles++;
                    }
                    
                    steps++;
                    // Yield check every 5000 instructions
                    if (steps % 5000 === 0) {
                        if (performance.now() - startTime > 12) {
                            // Yield to the browser's event loop, continue chunk later
                            setTimeout(executeChunk, 0);
                            return;
                        }
                    }
                }
            } catch(e) {
                console.error('AVR Execution Error:', e);
                this.stopSimulation();
                return;
            }

            // Extract pin states from AVR IO ports
            for (let i = 0; i < 6; i++) this._pinStates[`D${i+8}`] = this.ports.B.pinState(i) === PinState.High ? 1 : 0;
            for (let i = 0; i < 6; i++) this._pinStates[`A${i}`]   = this.ports.C.pinState(i) === PinState.High ? 1 : 0;
            for (let i = 0; i < 8; i++) this._pinStates[`D${i}`]   = this.ports.D.pinState(i) === PinState.High ? 1 : 0;

            this.updateCircuitVisuals(connections);

            this.animationFrame = requestAnimationFrame(() => this._avrLoop(connections));
        };

        executeChunk();
    }

    // ── Circuit Visual Engine ─────────────────────────────────────────────────

    updateCircuitVisuals(connections) {
        const pinStates = this._pinStates;
        const pwmValues = this._pwmValues;

        const pinGraph = {};
        const addEdge  = (u, v) => { (pinGraph[u] = pinGraph[u] || []).push(v); };

        // Build connection graph from wire objects
        connections.forEach(conn => {
            addEdge(conn.from, conn.to);
            addEdge(conn.to,   conn.from);
        });

        // ── Passive component pass-throughs ───────────────────────────────────
        componentRegistry.forEach(comp => {
            const id   = comp.id;
            const type = comp.type || id.replace(/_\d+$/, '');

            // Resistors, inductors, fuses — bidirectional pass
            if (type.includes('resistor') || type.includes('inductor') || type.includes('fuse')) {
                addEdge(`${id}.pin1`, `${id}.pin2`);
                addEdge(`${id}.pin2`, `${id}.pin1`);
            }
            // LEDs — forward direction only (anode→cathode)
            if (type.startsWith('led-') || type === 'rgb-led') {
                addEdge(`${id}.anode`, `${id}.cathode`);
                addEdge(`${id}.+`,     `${id}.-`);
            }
            // Diode — forward direction A→K
            if (type === 'diode') {
                addEdge(`${id}.A`, `${id}.K`);
                addEdge(`${id}.anode`, `${id}.cathode`);
            }
            // Jumper wires — bidirectional
            if (type.startsWith('jumper')) {
                addEdge(`${id}.pin1`, `${id}.pin2`);
                addEdge(`${id}.pin2`, `${id}.pin1`);
            }
            // Capacitors — pass for DC simulation
            if (type.includes('cap-') || type.includes('capacitor')) {
                addEdge(`${id}.+`, `${id}.-`);
            }
            // Toggle switch / slide switch — NO→COM pass (always closed for sim)
            if (type === 'toggle-switch') {
                addEdge(`${id}.COM`, `${id}.NO`);
                addEdge(`${id}.NO`,  `${id}.COM`);
            }
            // Flex/force/tilt sensors — resistive, bidirectional pass
            if (type === 'flex-sensor' || type === 'force-sensor' || type === 'tilt-sensor') {
                addEdge(`${id}.pin1`, `${id}.pin2`);
                addEdge(`${id}.pin2`, `${id}.pin1`);
            }
            // Potentiometer — wiper (pin2) is middle between pin1 and pin3
            if (type === 'potentiometer') {
                addEdge(`${id}.pin1`, `${id}.pin2`);
                addEdge(`${id}.pin2`, `${id}.pin3`);
                addEdge(`${id}.pin3`, `${id}.pin2`);
            }
            // Terminal blocks — direct pass
            if (type === 'terminal-block-2') {
                addEdge(`${id}.pin1`, `${id}.pin2`);
                addEdge(`${id}.pin2`, `${id}.pin1`);
            }
        });

        const sources  = [];
        const grounds  = new Set();

        // ── Build initial sources/grounds from all placed components ──────────
        componentRegistry.forEach(comp => {
            const cid  = comp.id;
            const type = comp.type || cid.replace(/_\d+$/, '');

            // ── Power sources ────────────────────────────────────────────────
            const isPowerSource = type.includes('battery') || type.includes('power-supply') ||
                                  type.includes('solar') || type.includes('power-bank') ||
                                  type.includes('tp4056') || type === 'barrel-jack' ||
                                  type === 'xt60-connector';
            if (isPowerSource) {
                sources.push(`${cid}.+`, `${cid}.VCC`, `${cid}.5V`, `${cid}.3V3`,
                             `${cid}.OUT+`, `${cid}.VOUT+`, `${cid}.VSYS`, `${cid}.P+`);
                grounds.add(`${cid}.-`); grounds.add(`${cid}.GND`);
                grounds.add(`${cid}.OUT-`); grounds.add(`${cid}.VOUT-`); grounds.add(`${cid}.P-`);
            }

            // ── MCU Boards ────────────────────────────────────────────────────
            const isMCU = type.includes('arduino') || type.includes('esp32') ||
                          type.includes('esp8266') || type.includes('pico') ||
                          type.includes('stm32') || type.includes('mega') ||
                          type.includes('nano') || type.includes('leonardo') ||
                          type.includes('due') || type.includes('teensy') ||
                          type.includes('attiny') || type.includes('microbit') ||
                          type.includes('sipeed') || type.includes('jetson');

            if (isMCU) {
                // Static power rails
                sources.push(
                    `${cid}.5V`, `${cid}.3V3`, `${cid}.3.3V`, `${cid}.VBUS`, `${cid}.VCC`,
                    `${cid}.VSYS`, `${cid}.VIN`, `${cid}.VDD`, `${cid}.VREF`,
                    `${cid}.ADC_VREF`, `${cid}.3V`, `${cid}.PWR`
                );
                grounds.add(`${cid}.GND`); grounds.add(`${cid}.AGND`);
                grounds.add(`${cid}.VSS`); grounds.add(`${cid}.GND2`);

                // ── Map interpreter pin states to MCU pin names ───────────────
                Object.entries(pinStates).forEach(([pin, high]) => {
                    // pin is like: "D13", "A0", "D4"
                    const num = pin.replace(/^[DA]/, '');

                    // All alias forms for this pin across all board types
                    const aliases = [
                        `${cid}.${pin}`,          // D13, A0 (Arduino)
                    ];

                    // Arduino Uno/Nano/Mega digital pins: D4 → .D4 and .4
                    if (pin.startsWith('D')) {
                        aliases.push(`${cid}.${num}`);          // raw number
                    }
                    // Analog pins: A0 → .A0
                    if (pin.startsWith('A')) {
                        aliases.push(`${cid}.A${num}`);
                    }
                    // ESP32: D4 → GPIO4, GPIO4
                    if (!isNaN(num)) {
                        aliases.push(`${cid}.GPIO${num}`);       // ESP32
                        aliases.push(`${cid}.GP${num}`);         // Pico
                        aliases.push(`${cid}.IO${num}`);         // STM32
                        aliases.push(`${cid}.P${num}`);          // Generic
                    }
                    // Mega/Due have SCL/SDA on D20/D21
                    if (pin === 'D20') aliases.push(`${cid}.SDA`);
                    if (pin === 'D21') aliases.push(`${cid}.SCL`);

                    aliases.forEach(p => {
                        if (high) { sources.push(p); grounds.delete(p); }
                        else      { grounds.add(p); }
                    });

                    // PWM: pwm > 0 = source (partial power)
                    const pwm = pwmValues[pin];
                    if (pwm !== undefined && pwm > 0) {
                        aliases.forEach(p => sources.push(p));
                    }
                });

                // BBC micro:bit has pins 0,1,2
                if (type.includes('microbit')) {
                    [0,1,2].forEach(n => {
                        const pin = `D${n}`;
                        const v   = pinStates[pin];
                        if (v) sources.push(`${cid}.${n}`);
                        else   grounds.add(`${cid}.${n}`);
                    });
                }
            }
        });


        // Manual pin overrides from hardware tester panel
        if (window.manualPinStates) {
            Object.entries(window.manualPinStates).forEach(([pinId, state]) => {
                if (state === 'HIGH') { sources.push(pinId); grounds.delete(pinId); }
                else if (state === 'LOW') grounds.add(pinId);
            });
        }

        // BFS reachability
        const canReach = (startPin, targets) => {
            if (targets instanceof Set ? targets.has(startPin) : targets.includes(startPin)) return true;
            const queue   = [startPin];
            const visited = new Set([startPin]);
            while (queue.length > 0) {
                const curr = queue.shift();
                if (targets instanceof Set ? targets.has(curr) : targets.includes(curr)) return true;
                for (const n of (pinGraph[curr] || [])) {
                    if (!visited.has(n)) { visited.add(n); queue.push(n); }
                }
            }
            return false;
        };

        this.poweredComponents.clear();

        const placedEls = document.querySelectorAll('.placed-component');

        // Phase 1: Logic propagation (motor drivers, relays, etc.)
        placedEls.forEach(el => {
            const id = el.dataset.componentId;
            if (!id) return;
            const type = id.replace(/_\d+$/, '');
            evaluateLogic(id, type, sources, grounds, this.poweredComponents, el, canReach, pinStates);
        });

        // Path-to-ground power tracing
        sources.forEach(src => this._traceToGround(src, grounds, pinGraph));

        // Phase 2: Physics / visual updates
        placedEls.forEach(el => {
            const id = el.dataset.componentId;
            if (!id) return;
            const type = id.replace(/_\d+$/, '');
            evaluatePhysics(id, type, sources, grounds, this.poweredComponents, el, canReach, pinStates, pwmValues, this._servoAngles);
        });

        // Apply powered state CSS
        placedEls.forEach(el => {
            const id = el.dataset.componentId;
            if (this.poweredComponents.has(id)) {
                el.classList.add('sim-powered');
            } else {
                el.classList.remove('sim-powered');
                el.classList.remove('sim-glow');
            }
        });
    }

    _traceToGround(startPin, groundPins, graph) {
        const queue   = [[startPin]];
        const visited = new Set();
        while (queue.length > 0) {
            const path       = queue.shift();
            const currentPin = path[path.length - 1];
            if (groundPins.has(currentPin)) {
                path.forEach(pin => this.poweredComponents.add(pin.split('.')[0]));
                continue;
            }
            if (!visited.has(currentPin)) {
                visited.add(currentPin);
                for (const n of (graph[currentPin] || [])) {
                    if (!visited.has(n)) queue.push([...path, n]);
                }
            }
        }
    }

    _updateLCDDisplay(text) {
        // Find all LCD components on canvas and update their text overlay
        document.querySelectorAll('.placed-component').forEach(el => {
            const id = el.dataset.componentId || '';
            if (id.includes('lcd') || id.includes('display')) {
                let overlay = el.querySelector('.sim-lcd-overlay');
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.className = 'sim-lcd-overlay';
                    el.appendChild(overlay);
                }
                overlay.textContent = text || '';
            }
        });
    }

    _updateOLEDDisplay(text, x, y, size) {
        document.querySelectorAll('.placed-component').forEach(el => {
            const id = el.dataset.componentId || '';
            if (id.includes('oled') || id.includes('ssd1306')) {
                let overlay = el.querySelector('.sim-oled-overlay');
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.className = 'sim-oled-overlay';
                    el.appendChild(overlay);
                }
                if (text) {
                    overlay.textContent += text;
                }
            }
        });
    }

    _resetVisuals() {
        document.querySelectorAll('.placed-component').forEach(el => {
            el.classList.remove('sim-powered', 'sim-glow', 'led-lit', 'sim-motor-cw', 'sim-motor-ccw', 'sim-buzzing', 'sim-relay-on');
            const overlay = el.querySelector('.sim-lcd-overlay, .sim-oled-overlay');
            if (overlay) overlay.textContent = '';
        });
    }
}

export const simulator = new CircuitSimulator();
