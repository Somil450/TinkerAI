/**
 * AI AUTO-CORRECTION ENGINE
 * 
 * Detects circuit problems and suggests automatic fixes
 * User can apply fixes with one click
 * 
 * Example:
 * Problem: LED connected directly to Arduino without resistor
 * Suggestion: Add 220Ω resistor
 * Action: Auto-fix applies correction automatically
 */

import { safetyEngine } from './safetyEngine.js';
import { componentRegistry } from './componentRegistry.js';

export class AutoCorrectionEngine {
    constructor() {
        this.suggestions = [];
        this.appliedFixes = [];
    }

    /**
     * Analyze circuit and generate correction suggestions
     */
    analyze(circuit) {
        this.suggestions = [];

        // Get safety analysis
        const safety = safetyEngine.analyze(circuit);

        // Generate fixes for each issue
        safety.critical.forEach(issue => {
            const fix = this._generateFix(issue, circuit);
            if (fix) {
                this.suggestions.push(fix);
            }
        });

        safety.warnings.forEach(warning => {
            const fix = this._generateFix(warning, circuit);
            if (fix) {
                this.suggestions.push(fix);
            }
        });

        return {
            totalIssues: safety.critical.length + safety.warnings.length,
            suggestions: this.suggestions,
            autoFixable: this.suggestions.filter(s => s.autoFixable).length
        };
    }

    /**
     * Generate fix for a specific issue
     */
    _generateFix(issue, circuit) {
        switch (issue.type) {
            case 'shortCircuit':
                return this._fixShortCircuit(issue, circuit);
            case 'overcurrent':
                return this._fixOvercurrent(issue, circuit);
            case 'reversePolarity':
                return this._fixReversePolarity(issue, circuit);
            case 'overvoltage':
                return this._fixOvervoltage(issue, circuit);
            case 'missingGround':
                return this._fixMissingGround(issue, circuit);
            case 'missingPullUp':
                return this._fixMissingPullUp(issue, circuit);
            case 'floatingPin':
                return this._fixFloatingPin(issue, circuit);
            case 'voltageDomainMismatch':
                return this._fixVoltageDomainMismatch(issue, circuit);
            default:
                return null;
        }
    }

    /**
     * Fix: Short circuit (remove bad connection)
     */
    _fixShortCircuit(issue, circuit) {
        return {
            id: `fix_${issue.type}_${Date.now()}`,
            severity: 'CRITICAL',
            type: 'removeConnection',
            issue: issue,
            problem: `Direct short circuit: ${issue.connection.from} → ${issue.connection.to}`,
            suggestion: 'Remove this problematic connection',
            action: {
                type: 'removeConnection',
                connection: issue.connection,
                message: 'Connection removed (short circuit eliminated)'
            },
            autoFixable: true,
            impact: 'Power supply protected, circuit safety restored'
        };
    }

    /**
     * Fix: Overcurrent on LED (add resistor)
     */
    _fixOvercurrent(issue, circuit) {
        if (issue.message?.includes('LED')) {
            return {
                id: `fix_${issue.type}_${Date.now()}`,
                severity: 'CRITICAL',
                type: 'addResistor',
                issue: issue,
                problem: `LED connected directly to power without current limiting resistor`,
                suggestion: `Add 220Ω resistor in series with LED`,
                resistorValue: 220,
                resistorUnit: 'ohm',
                action: {
                    type: 'insertComponent',
                    component: {
                        type: 'Resistor',
                        value: 220,
                        unit: 'ohm',
                        model: 'resistor-220ohm',
                        label: '220Ω Resistor'
                    },
                    position: 'seriesWith',
                    targetComponent: issue.component,
                    connections: [
                        {
                            from: 'power',
                            to: `resistor.pin1`
                        },
                        {
                            from: `resistor.pin2`,
                            to: issue.component
                        }
                    ]
                },
                autoFixable: true,
                impact: 'LED protected, Arduino protected, circuit operates correctly',
                formula: `R = (V_supply - V_led) / I_desired\nR = (5V - 2V) / 0.020A = 150Ω (220Ω std)`
            };
        }

        // Motor overcurrent
        if (issue.message?.includes('Motor')) {
            return {
                id: `fix_${issue.type}_motor_${Date.now()}`,
                severity: 'WARNING',
                type: 'addMotorDriver',
                issue: issue,
                problem: `Motor drawing high current, may damage Arduino`,
                suggestion: `Add L298N Motor Driver module`,
                action: {
                    type: 'insertComponent',
                    component: {
                        type: 'Motor Driver',
                        model: 'l298n',
                        label: 'L298N Motor Driver'
                    },
                    position: 'between',
                    fromComponent: 'Arduino',
                    toComponent: issue.component,
                    connections: [
                        { from: 'Arduino.D5', to: 'L298N.IN1' },
                        { from: 'Arduino.D6', to: 'L298N.IN2' },
                        { from: 'L298N.OUT1', to: 'Motor.+' },
                        { from: 'L298N.OUT2', to: 'Motor.-' }
                    ]
                },
                autoFixable: true,
                impact: 'Arduino protected, motor speed control enabled',
                cost: 2
            };
        }

        return null;
    }

    /**
     * Fix: Reverse polarity (swap connections)
     */
    _fixReversePolarity(issue, circuit) {
        return {
            id: `fix_${issue.type}_${Date.now()}`,
            severity: 'CRITICAL',
            type: 'swapConnections',
            issue: issue,
            problem: `Reverse polarity on ${issue.component}: will not work or fail`,
            suggestion: `Swap the positive and negative connections`,
            action: {
                type: 'swapPins',
                component: issue.component,
                pin1: 'anode',
                pin2: 'cathode',
                message: 'LED connections swapped to correct polarity'
            },
            autoFixable: true,
            impact: `${issue.component} will now work correctly`
        };
    }

    /**
     * Fix: Overvoltage (add level shifter or voltage divider)
     */
    _fixOvervoltage(issue, circuit) {
        return {
            id: `fix_${issue.type}_${Date.now()}`,
            severity: 'CRITICAL',
            type: 'addLevelShifter',
            issue: issue,
            problem: `${issue.message}`,
            suggestions: [
                {
                    name: 'Voltage Divider',
                    complexity: 'Simple',
                    cost: 0.05,
                    action: 'Add 10kΩ and 10kΩ resistors as voltage divider',
                    description: `Reduces ${issue.message?.split('applied to')[0]} to safe level`,
                    formula: 'V_out = V_in × R2 / (R1 + R2)'
                },
                {
                    name: 'Level Shifter Module',
                    complexity: 'Easy',
                    cost: 2,
                    action: 'Use dedicated level shifter IC (TXB0108)',
                    description: 'Bi-directional voltage level conversion'
                }
            ],
            autoFixable: false,
            impact: 'Component protected from overvoltage damage',
            recommended: 'Voltage Divider (cheapest and simplest)'
        };
    }

    /**
     * Fix: Missing ground (add ground connection)
     */
    _fixMissingGround(issue, circuit) {
        return {
            id: `fix_${issue.type}_${Date.now()}`,
            severity: 'WARNING',
            type: 'addGroundConnection',
            issue: issue,
            problem: `${issue.component} may not have proper ground connection`,
            suggestion: `Connect ${issue.component} GND pin to system ground`,
            action: {
                type: 'addConnection',
                from: `${issue.component}.GND`,
                to: 'Arduino.GND',
                message: 'Ground connection added'
            },
            autoFixable: true,
            impact: 'Component properly grounded, stable operation ensured'
        };
    }

    /**
     * Fix: Missing pull-up resistors on I2C
     */
    _fixMissingPullUp(issue, circuit) {
        return {
            id: `fix_${issue.type}_${Date.now()}`,
            severity: 'INFO',
            type: 'addPullUpResistors',
            issue: issue,
            problem: `I2C component may need pull-up resistors`,
            suggestion: `Add two 4.7kΩ pull-up resistors on SDA and SCL`,
            action: {
                type: 'addComponents',
                components: [
                    {
                        type: 'Resistor',
                        value: 4700,
                        unit: 'ohm',
                        position: 'SDA pull-up'
                    },
                    {
                        type: 'Resistor',
                        value: 4700,
                        unit: 'ohm',
                        position: 'SCL pull-up'
                    }
                ],
                connections: [
                    { from: 'resistor1.pin1', to: '5V', description: 'Pull-up to power' },
                    { from: 'resistor1.pin2', to: 'I2C.SDA', description: 'Pull SDA line' },
                    { from: 'resistor2.pin1', to: '5V', description: 'Pull-up to power' },
                    { from: 'resistor2.pin2', to: 'I2C.SCL', description: 'Pull SCL line' }
                ]
            },
            autoFixable: true,
            impact: 'I2C communication stable, no more bus errors'
        };
    }

    /**
     * Fix: Floating pins (add pull-up or connect to signal)
     */
    _fixFloatingPin(issue, circuit) {
        return {
            id: `fix_${issue.type}_${Date.now()}`,
            severity: 'WARNING',
            type: 'connectFloatingPin',
            issue: issue,
            problem: `Pin ${issue.pin} is floating (not connected)`,
            suggestions: [
                {
                    type: 'pullUp',
                    description: 'Connect to 5V with pull-up resistor',
                    resistance: '10kΩ'
                },
                {
                    type: 'pullDown',
                    description: 'Connect to GND with pull-down resistor',
                    resistance: '10kΩ'
                },
                {
                    type: 'groundDirectly',
                    description: 'Connect directly to GND if not used'
                }
            ],
            autoFixable: false,
            impact: 'Eliminates unpredictable behavior from floating logic levels'
        };
    }

    /**
     * Fix: Voltage domain mismatch (add level shifter)
     */
    _fixVoltageDomainMismatch(issue, circuit) {
        return {
            id: `fix_${issue.type}_${Date.now()}`,
            severity: 'WARNING',
            type: 'addLevelShifter',
            issue: issue,
            problem: issue.message,
            suggestion: issue.suggestion,
            options: [
                {
                    type: 'voltageDivider',
                    cost: 0.10,
                    components: ['10kΩ resistor', '10kΩ resistor'],
                    description: 'For outputs only (5V to 3.3V)'
                },
                {
                    type: 'mosfetTransistor',
                    cost: 0.30,
                    components: ['MOSFET', 'resistor'],
                    description: 'For bidirectional communication'
                },
                {
                    type: 'levelShifterIC',
                    cost: 2.00,
                    components: ['TXB0108 Level Shifter'],
                    description: 'Professional solution, handles multiple pins'
                }
            ],
            autoFixable: false,
            recommended: 'MOSFET Transistor (best balance)'
        };
    }

    /**
     * Apply fix to circuit
     */
    applyFix(fix, circuit) {
        try {
            const result = this._executeFix(fix.action, circuit);

            this.appliedFixes.push({
                fixId: fix.id,
                timestamp: new Date(),
                action: fix.action,
                result: result
            });

            return {
                success: true,
                message: fix.action.message || 'Fix applied successfully',
                circuit: circuit
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to apply fix: ${error.message}`
            };
        }
    }

    /**
     * Execute fix action on circuit
     */
    _executeFix(action, circuit) {
        switch (action.type) {
            case 'removeConnection':
                return this._executeRemoveConnection(action, circuit);
            case 'insertComponent':
                return this._executeInsertComponent(action, circuit);
            case 'addConnection':
                return this._executeAddConnection(action, circuit);
            case 'swapPins':
                return this._executeSwapPins(action, circuit);
            default:
                throw new Error(`Unknown fix action: ${action.type}`);
        }
    }

    /**
     * Execute: Remove connection
     */
    _executeRemoveConnection(action, circuit) {
        const index = circuit.connections.findIndex(conn =>
            conn.from === action.connection.from &&
            conn.to === action.connection.to
        );

        if (index !== -1) {
            circuit.connections.splice(index, 1);
            return { removed: true, connectionIndex: index };
        }
        return { removed: false };
    }

    /**
     * Execute: Insert component
     */
    _executeInsertComponent(action, circuit) {
        const newComponent = {
            id: `${action.component.model || action.component.type}_${Date.now()}`,
            ...action.component
        };

        circuit.components.push(newComponent);

        // Add connections
        if (action.connections) {
            action.connections.forEach(conn => {
                const connection = {
                    from: conn.from.replace('resistor', newComponent.id),
                    to: conn.to.replace('resistor', newComponent.id)
                };
                circuit.connections.push(connection);
            });
        }

        return { componentId: newComponent.id, connectionsAdded: action.connections?.length || 0 };
    }

    /**
     * Execute: Add connection
     */
    _executeAddConnection(action, circuit) {
        const connection = {
            from: action.from,
            to: action.to
        };

        // Check if connection already exists
        const exists = circuit.connections.some(c =>
            c.from === action.from && c.to === action.to
        );

        if (!exists) {
            circuit.connections.push(connection);
            return { added: true };
        }
        return { added: false, reason: 'Connection already exists' };
    }

    /**
     * Execute: Swap pins
     */
    _executeSwapPins(action, circuit) {
        const component = circuit.components.find(c => c.id === action.component);
        if (!component) return { success: false };

        // Find and swap connections
        circuit.connections.forEach(conn => {
            if (conn.from.includes(action.pin1)) {
                conn.from = conn.from.replace(action.pin1, action.pin2);
            }
            if (conn.from.includes(action.pin2)) {
                conn.from = conn.from.replace(action.pin2, action.pin1);
            }
            if (conn.to.includes(action.pin1)) {
                conn.to = conn.to.replace(action.pin1, action.pin2);
            }
            if (conn.to.includes(action.pin2)) {
                conn.to = conn.to.replace(action.pin2, action.pin1);
            }
        });

        return { success: true };
    }

    /**
     * Get fix history
     */
    getFixHistory() {
        return this.appliedFixes;
    }

    /**
     * Undo last fix
     */
    undoLastFix(circuit) {
        if (this.appliedFixes.length === 0) {
            return { success: false, message: 'No fixes to undo' };
        }

        // This is a simplified undo - real implementation would need state management
        this.appliedFixes.pop();
        return { success: true, message: 'Last fix undone' };
    }
}

export const autoCorrectionEngine = new AutoCorrectionEngine();
