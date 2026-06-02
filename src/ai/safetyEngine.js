/**
 * AI SAFETY ENGINE
 * 
 * Real-time circuit hazard detection and analysis
 * Prevents damage, fires, and explosions
 * 
 * Detects:
 * - Short circuits
 * - Reverse polarity
 * - Overvoltage
 * - Overcurrent
 * - Missing ground
 * - Missing power
 * - Floating pins
 * - Incorrect voltage domains
 * - Component miswiring
 */

import { componentRegistry } from './componentRegistry.js';

export class SafetyEngine {
    constructor() {
        this.issues = [];
        this.warnings = [];
        this.suggestions = [];
    }

    /**
     * Analyze entire circuit for hazards
     * @param {Object} circuit - Circuit graph with components and connections
     * @returns {Array} Array of issues found
     */
    analyze(circuit) {
        this.issues = [];
        this.warnings = [];
        this.suggestions = [];

        // Run all safety checks
        this._checkShortCircuits(circuit);
        this._checkReversePolarity(circuit);
        this._checkVoltageRatings(circuit);
        this._checkCurrentRatings(circuit);
        this._checkGrounding(circuit);
        this._checkFloatingPins(circuit);
        this._checkVoltageDomains(circuit);
        this._checkComponentMiswiring(circuit);
        this._checkPowerRequirements(circuit);

        return {
            critical: this.issues,
            warnings: this.warnings,
            suggestions: this.suggestions,
            isSafe: this.issues.length === 0,
            severityScore: this._calculateSeverityScore()
        };
    }

    /**
     * Detect direct short circuits (power to ground)
     */
    _checkShortCircuits(circuit) {
        circuit.connections?.forEach(conn => {
            const isShort =
                (conn.from.includes('5V') && conn.to.includes('GND')) ||
                (conn.to.includes('5V') && conn.from.includes('GND')) ||
                (conn.from.includes('3V3') && conn.to.includes('GND')) ||
                (conn.to.includes('3V3') && conn.from.includes('GND'));

            if (isShort) {
                this.issues.push({
                    severity: 'CRITICAL',
                    type: 'shortCircuit',
                    message: `Direct short circuit: ${conn.from} → ${conn.to}`,
                    impact: 'Power supply damage, wiring burns, fire hazard',
                    connection: conn,
                    autoFixable: true,
                    suggestion: 'Remove this connection immediately'
                });
            }
        });
    }

    /**
     * Detect reverse polarity connections
     */
    _checkReversePolarity(circuit) {
        circuit.components?.forEach(comp => {
            if (comp.type === 'LED' || comp.type === 'Diode') {
                const connections = this._getComponentConnections(circuit, comp.id);

                connections.forEach(conn => {
                    // LED should have anode to positive, cathode to negative
                    if (conn.pin === 'cathode' && conn.connectedTo.includes('5V')) {
                        this.issues.push({
                            severity: 'CRITICAL',
                            type: 'reversePolarity',
                            component: comp.id,
                            message: `Reverse polarity on ${comp.type}: cathode connected to positive`,
                            impact: 'Component will not work, or may fail',
                            autoFixable: false,
                            suggestion: 'Swap the connections (anode ↔ cathode)'
                        });
                    }
                });
            }

            // Check electrolytic capacitors
            if (comp.type === 'Capacitor' && comp.spec?.electrolytic) {
                const connections = this._getComponentConnections(circuit, comp.id);
                connections.forEach(conn => {
                    if (conn.pin === 'negative' && conn.connectedTo.includes('5V')) {
                        this.warnings.push({
                            severity: 'WARNING',
                            type: 'reversePolarity',
                            component: comp.id,
                            message: `Reverse polarity on capacitor: negative terminal to positive`,
                            suggestion: 'Swap connections'
                        });
                    }
                });
            }
        });
    }

    /**
     * Check if pins exceed their voltage ratings
     */
    _checkVoltageRatings(circuit) {
        circuit.connections?.forEach(conn => {
            const fromVoltage = this._getVoltageLevel(conn.from);
            const toVoltage = this._getVoltageLevel(conn.to);

            circuit.components?.forEach(comp => {
                const pinVoltageRating = this._getPinVoltageRating(comp, conn.to);

                if (pinVoltageRating && fromVoltage > pinVoltageRating) {
                    this.issues.push({
                        severity: 'CRITICAL',
                        type: 'overvoltage',
                        component: comp.id,
                        pin: conn.to,
                        message: `Overvoltage: ${fromVoltage}V applied to ${pinVoltageRating}V pin`,
                        impact: 'Component damage, GPIO destruction',
                        autoFixable: true,
                        suggestion: `Add voltage divider or level shifter`
                    });
                }
            });
        });
    }

    /**
     * Check if components exceed current ratings
     */
    _checkCurrentRatings(circuit) {
        // Check LEDs without resistor
        circuit.components?.forEach(comp => {
            if (comp.type === 'LED') {
                const isDirectlyConnected = circuit.connections?.some(conn =>
                    (conn.from.includes(comp.id) && conn.to.includes('5V')) ||
                    (conn.to.includes(comp.id) && conn.from.includes('5V'))
                );

                if (isDirectlyConnected) {
                    this.issues.push({
                        severity: 'CRITICAL',
                        type: 'overcurrent',
                        component: comp.id,
                        message: `LED connected directly to power without current limiting resistor`,
                        impact: 'LED burns out, may damage power supply',
                        autoFixable: true,
                        suggestion: `Add 220Ω-330Ω resistor in series`,
                        autoFixCode: `insertResistor(${comp.id}, 220, 'ohm')`
                    });
                }
            }

            // Check motors without driver
            if (comp.type === 'Motor' && comp.spec?.type === 'DC') {
                const connectedDirectly = circuit.connections?.some(conn =>
                    (conn.from.includes(comp.id) && conn.to.includes('5V')) ||
                    (conn.to.includes(comp.id) && conn.from.includes('5V'))
                );

                if (connectedDirectly) {
                    this.warnings.push({
                        severity: 'WARNING',
                        type: 'overcurrent',
                        component: comp.id,
                        message: `Motor connected directly to power (high current draw)`,
                        suggestion: `Use motor driver module (L298N, TB6612FNG)`,
                        impact: 'Arduino damage from back-EMF, unpredictable behavior'
                    });
                }
            }
        });
    }

    /**
     * Check for missing or improper grounding
     */
    _checkGrounding(circuit) {
        const allComponents = circuit.components || [];
        const gndConnections = new Set();

        circuit.connections?.forEach(conn => {
            if (conn.to.includes('GND') || conn.from.includes('GND')) {
                const componentId = conn.from.includes('GND') ? conn.to : conn.from;
                gndConnections.add(componentId);
            }
        });

        // All components should have ground reference
        allComponents.forEach(comp => {
            if (comp.requiresGround && !gndConnections.has(comp.id)) {
                this.warnings.push({
                    severity: 'WARNING',
                    type: 'missingGround',
                    component: comp.id,
                    message: `${comp.type} may not have proper ground connection`,
                    suggestion: `Connect component GND pin to system GND`
                });
            }
        });
    }

    /**
     * Check for floating (unconnected) pins
     */
    _checkFloatingPins(circuit) {
        circuit.components?.forEach(comp => {
            const compSpec = componentRegistry.get(comp.type);
            if (!compSpec) return;

            const connectedPins = new Set();
            circuit.connections?.forEach(conn => {
                if (conn.from.includes(comp.id)) {
                    connectedPins.add(conn.from.split('.')[1]);
                }
                if (conn.to.includes(comp.id)) {
                    connectedPins.add(conn.to.split('.')[1]);
                }
            });

            // Check if required pins are unconnected
            compSpec.requiredPins?.forEach(pin => {
                if (!connectedPins.has(pin)) {
                    this.warnings.push({
                        severity: 'WARNING',
                        type: 'floatingPin',
                        component: comp.id,
                        pin: pin,
                        message: `Floating pin: ${comp.type}.${pin} is not connected`,
                        suggestion: `Connect ${pin} to appropriate signal or ground`
                    });
                }
            });
        });
    }

    /**
     * Check for incorrect voltage domain connections (mixing 3.3V and 5V logic)
     */
    _checkVoltageDomains(circuit) {
        const voltageDomains = new Map();

        circuit.components?.forEach(comp => {
            const spec = componentRegistry.get(comp.type);
            if (spec?.operatingVoltage) {
                voltageDomains.set(comp.id, spec.operatingVoltage);
            }
        });

        circuit.connections?.forEach(conn => {
            const fromDomain = voltageDomains.get(conn.from.split('.')[0]);
            const toDomain = voltageDomains.get(conn.to.split('.')[0]);

            if (fromDomain && toDomain && fromDomain !== toDomain) {
                if (Math.abs(fromDomain - toDomain) > 1.5) {
                    this.warnings.push({
                        severity: 'WARNING',
                        type: 'voltageDomainMismatch',
                        message: `Voltage domain mismatch: ${fromDomain}V ↔ ${toDomain}V`,
                        impact: 'Logic signal corruption, unpredictable behavior',
                        suggestion: `Use level shifter for ${fromDomain}V → ${toDomain}V conversion`
                    });
                }
            }
        });
    }

    /**
     * Check for common component miswiring
     */
    _checkComponentMiswiring(circuit) {
        // Check I2C pull-up resistors
        circuit.components?.forEach(comp => {
            if (comp.protocol?.includes('I2C')) {
                const hasPullUps = circuit.components?.some(c =>
                    c.type === 'Resistor' && c.spec?.value === '4.7k'
                );

                if (!hasPullUps) {
                    this.warnings.push({
                        severity: 'INFO',
                        type: 'missingPullUp',
                        component: comp.id,
                        message: `I2C component may need pull-up resistors (4.7kΩ)`,
                        suggestion: `Add 4.7kΩ pull-ups on SDA and SCL lines`
                    });
                }
            }
        });
    }

    /**
     * Check power supply can handle total current draw
     */
    _checkPowerRequirements(circuit) {
        let totalCurrent = 0;
        let totalPower = 0;

        circuit.components?.forEach(comp => {
            const spec = componentRegistry.get(comp.type);
            if (spec?.maxCurrent) {
                totalCurrent += spec.maxCurrent;
            }
            if (spec?.powerConsumption) {
                totalPower += spec.powerConsumption;
            }
        });

        // USB power limit is ~500mA
        if (totalCurrent > 400) {
            this.warnings.push({
                severity: 'WARNING',
                type: 'highPowerDraw',
                message: `Total current draw: ${totalCurrent}mA (exceeds USB limit of 500mA)`,
                suggestion: `Use external power supply for high-current components`
            });
        }
    }

    /**
     * Apply automatic fix to an issue
     */
    autoFix(issue) {
        if (!issue.autoFixable) {
            return { success: false, message: 'This issue cannot be auto-fixed' };
        }

        switch (issue.type) {
            case 'shortCircuit':
                return this._fixShortCircuit(issue);
            case 'overcurrent':
                return this._fixOvercurrent(issue);
            default:
                return { success: false, message: 'Fix not implemented' };
        }
    }

    /**
     * Fix short circuit by removing connection
     */
    _fixShortCircuit(issue) {
        return {
            success: true,
            action: 'removeConnection',
            connection: issue.connection,
            message: 'Short circuit connection removed'
        };
    }

    /**
     * Fix overcurrent by adding resistor
     */
    _fixOvercurrent(issue) {
        if (issue.autoFixCode) {
            return {
                success: true,
                action: 'insertComponent',
                component: 'Resistor',
                value: '220Ω',
                message: 'Current-limiting resistor added'
            };
        }
    }

    /**
     * Helper: Get voltage level from pin name
     */
    _getVoltageLevel(pinName) {
        if (pinName.includes('5V')) return 5;
        if (pinName.includes('3V3')) return 3.3;
        if (pinName.includes('GND')) return 0;
        return 0;
    }

    /**
     * Helper: Get pin voltage rating from component spec
     */
    _getPinVoltageRating(component, pinName) {
        const spec = componentRegistry.get(component.type);
        if (spec?.pins?.[pinName]?.maxVoltage) {
            return spec.pins[pinName].maxVoltage;
        }
        return null;
    }

    /**
     * Helper: Get all connections for a component
     */
    _getComponentConnections(circuit, componentId) {
        return circuit.connections?.filter(conn =>
            conn.from.includes(componentId) || conn.to.includes(componentId)
        ) || [];
    }

    /**
     * Calculate overall severity score (0-100)
     */
    _calculateSeverityScore() {
        let score = 0;
        score += this.issues.length * 30; // Critical issues worth 30 each
        score += this.warnings.length * 10; // Warnings worth 10 each
        return Math.min(score, 100);
    }
}

export const safetyEngine = new SafetyEngine();
