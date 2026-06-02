/**
 * AI WHAT-IF ANALYZER
 * 
 * Predicts circuit behavior changes
 * Answers questions like:
 * - "What if I use 12V instead of 5V?"
 * - "What if I add a second motor?"
 * - "What if I replace Arduino with ESP32?"
 */

import { componentRegistry } from './componentRegistry.js';
import { safetyEngine } from './safetyEngine.js';

export class WhatIfAnalyzer {
    /**
     * Analyze what-if scenario
     */
    analyze(circuit, scenario) {
        console.log('Analyzing scenario:', scenario);

        let analysis = {
            scenario: scenario,
            originalCircuit: circuit,
            predictions: {},
            risks: [],
            benefits: [],
            recommendations: []
        };

        // Parse scenario
        if (scenario.type === 'voltageChange') {
            analysis = this._analyzeVoltageChange(circuit, scenario, analysis);
        } else if (scenario.type === 'componentReplacement') {
            analysis = this._analyzeComponentReplacement(circuit, scenario, analysis);
        } else if (scenario.type === 'componentAddition') {
            analysis = this._analyzeComponentAddition(circuit, scenario, analysis);
        } else if (scenario.type === 'featureAddition') {
            analysis = this._analyzeFeatureAddition(circuit, scenario, analysis);
        }

        return analysis;
    }

    /**
     * Analyze voltage change impact
     */
    _analyzeVoltageChange(circuit, scenario, analysis) {
        const oldVoltage = scenario.oldVoltage;
        const newVoltage = scenario.newVoltage;
        const ratio = newVoltage / oldVoltage;

        analysis.predictions = {
            voltageImpact: {
                old: oldVoltage,
                new: newVoltage,
                change: newVoltage - oldVoltage,
                percentChange: ((newVoltage - oldVoltage) / oldVoltage * 100).toFixed(1)
            }
        };

        // Analyze current impact
        const currentAnalysis = this._analyzeCurrentImpact(circuit, ratio);
        analysis.predictions.currentImpact = currentAnalysis;

        // Analyze power impact
        const powerAnalysis = this._analyzePowerImpact(circuit, ratio);
        analysis.predictions.powerImpact = powerAnalysis;

        // Check component ratings
        circuit.components?.forEach(comp => {
            const spec = componentRegistry.get(comp.model || comp.type);
            if (spec?.specs?.operatingVoltage) {
                if (newVoltage > spec.specs.operatingVoltage) {
                    analysis.risks.push({
                        severity: 'CRITICAL',
                        component: comp.id,
                        risk: `${comp.type} rated for ${spec.specs.operatingVoltage}V, but will get ${newVoltage}V`,
                        consequence: 'Component damage, potential fire hazard',
                        mitigation: `Use voltage regulator (LDO) to step down to ${spec.specs.operatingVoltage}V`
                    });
                }
            }
        });

        // Runtime analysis
        const runtimeAnalysis = this._analyzeRuntimeImpact(circuit, ratio);
        analysis.predictions.runtimeImpact = runtimeAnalysis;

        // LED brightness impact
        circuit.components?.forEach(comp => {
            if (comp.type === 'LED') {
                analysis.benefits.push({
                    component: comp.id,
                    change: 'LED brightness',
                    impact: `LED brightness increases ~${((ratio - 1) * 100).toFixed(0)}% (more current)`,
                    note: 'Resistor value should be recalculated'
                });
            }
        });

        // Motor speed impact
        circuit.components?.forEach(comp => {
            if (comp.type === 'Motor') {
                analysis.benefits.push({
                    component: comp.id,
                    change: 'Motor speed',
                    impact: `Motor speed increases ~${((ratio - 1) * 100).toFixed(0)}%`,
                    warning: 'Motor may overheat if continuously at high speed'
                });
            }
        });

        analysis.recommendations.push({
            priority: 'HIGH',
            suggestion: `Use voltage regulator to maintain safe voltage levels for all components`,
            components: this._recommendVoltageLevelersForChange(circuit, oldVoltage, newVoltage)
        });

        return analysis;
    }

    /**
     * Analyze component replacement impact
     */
    _analyzeComponentReplacement(circuit, scenario, analysis) {
        const oldComponent = scenario.oldComponent;
        const newComponent = scenario.newComponent;

        const oldSpec = componentRegistry.get(oldComponent);
        const newSpec = componentRegistry.get(newComponent);

        analysis.predictions = {
            componentChange: {
                from: oldSpec?.name || oldComponent,
                to: newSpec?.name || newComponent
            }
        };

        // Voltage compatibility
        if (oldSpec?.specs?.operatingVoltage !== newSpec?.specs?.operatingVoltage) {
            analysis.risks.push({
                severity: 'HIGH',
                risk: `Voltage mismatch: ${oldSpec?.specs?.operatingVoltage}V → ${newSpec?.specs?.operatingVoltage}V`,
                consequence: 'May need level shifters or voltage regulators',
                mitigation: `Add appropriate voltage conversion circuit`
            });
        }

        // Pin compatibility
        if (oldSpec?.pins && newSpec?.pins) {
            const oldPinCount = Object.keys(oldSpec.pins).length;
            const newPinCount = Object.keys(newSpec.pins).length;

            if (oldPinCount !== newPinCount) {
                analysis.risks.push({
                    severity: 'WARNING',
                    risk: `Pin count mismatch: ${oldPinCount} pins → ${newPinCount} pins`,
                    consequence: 'Rewiring required',
                    mitigation: `Refer to datasheet for pin mapping`
                });
            }
        }

        // Performance comparison
        if (oldSpec && newSpec) {
            analysis.benefits.push({
                metric: 'Speed',
                old: oldSpec.specs?.clockSpeed || 'Unknown',
                new: newSpec.specs?.clockSpeed || 'Unknown'
            });

            analysis.benefits.push({
                metric: 'Power consumption',
                old: `${oldSpec.specs?.powerConsumption || '?'} mW`,
                new: `${newSpec.specs?.powerConsumption || '?'} mW`,
                improvement: newSpec.specs?.powerConsumption < oldSpec.specs?.powerConsumption ? 'More efficient' : 'Higher consumption'
            });

            analysis.benefits.push({
                metric: 'Memory',
                old: oldSpec.specs?.memory || 'Unknown',
                new: newSpec.specs?.memory || 'Unknown'
            });
        }

        // Protocol support
        if (oldSpec?.protocols || newSpec?.protocols) {
            const newProtocols = newSpec?.protocols || [];
            const oldProtocols = oldSpec?.protocols || [];

            const addedProtocols = newProtocols.filter(p => !oldProtocols.includes(p));
            const removedProtocols = oldProtocols.filter(p => !newProtocols.includes(p));

            if (addedProtocols.length > 0) {
                analysis.benefits.push({
                    type: 'New capabilities',
                    protocols: addedProtocols,
                    description: `New ${addedProtocols.join(', ')} support`
                });
            }

            if (removedProtocols.length > 0) {
                analysis.risks.push({
                    severity: 'WARNING',
                    risk: `Protocols lost: ${removedProtocols.join(', ')}`,
                    consequence: 'Existing peripherals may not work',
                    mitigation: `Check compatibility before replacement`
                });
            }
        }

        analysis.recommendations.push({
            priority: 'HIGH',
            suggestion: 'Read new component datasheet carefully',
            actions: [
                'Map pin connections',
                'Verify voltage compatibility',
                'Check initialization code requirements',
                'Test with sample circuit first'
            ]
        });

        return analysis;
    }

    /**
     * Analyze adding new component
     */
    _analyzeComponentAddition(circuit, scenario, analysis) {
        const newComponentModel = scenario.componentModel;
        const newSpec = componentRegistry.get(newComponentModel);

        analysis.predictions = {
            newComponent: {
                name: newSpec?.name || newComponentModel,
                category: newSpec?.category || 'Unknown'
            }
        };

        // Power draw analysis
        const totalCurrent = this._calculateTotalCurrent(circuit) + (newSpec?.specs?.maxCurrent || 0);
        analysis.predictions.powerImpact = {
            additionalCurrent: `+${newSpec?.specs?.maxCurrent || 0} mA`,
            totalCurrent: `${totalCurrent} mA`,
            warning: totalCurrent > 400 ? 'Exceeds USB current limit!' : 'OK'
        };

        // Voltage domain check
        const circuitVoltage = this._getCircuitVoltage(circuit);
        if (newSpec?.specs?.operatingVoltage !== circuitVoltage) {
            analysis.risks.push({
                severity: 'WARNING',
                risk: `Voltage domain mismatch: circuit is ${circuitVoltage}V, component needs ${newSpec?.specs?.operatingVoltage}V`,
                mitigation: `Use level shifter or voltage regulator`
            });
        }

        // Pin availability
        const availablePins = this._getAvailablePins(circuit);
        const requiredPins = Object.keys(newSpec?.pins || {});

        if (requiredPins.length > availablePins.length) {
            analysis.risks.push({
                severity: 'HIGH',
                risk: `Not enough pins: ${requiredPins.length} required, only ${availablePins.length} available`,
                mitigation: `Use I2C/SPI multiplexer or different microcontroller`
            });
        }

        // Protocol requirements
        if (newSpec?.protocols?.includes('I2C')) {
            analysis.recommendations.push({
                priority: 'MEDIUM',
                suggestion: 'I2C component requires pull-up resistors',
                action: 'Add 4.7kΩ pull-up resistors on SDA and SCL'
            });
        }

        // Cost analysis
        analysis.benefits.push({
            type: 'Cost',
            price: `$${newSpec?.price || 'Unknown'}`,
            description: `Adding this component`
        });

        analysis.recommendations.push({
            priority: 'HIGH',
            suggestion: `Test compatibility with existing circuit`,
            actions: [
                'Build test circuit first',
                'Verify power supply can handle additional load',
                'Test communication protocols',
                'Verify voltage levels'
            ]
        });

        return analysis;
    }

    /**
     * Analyze adding new feature
     */
    _analyzeFeatureAddition(circuit, scenario, analysis) {
        const feature = scenario.feature;

        analysis.predictions = {
            newFeature: feature,
            requiredComponents: this._getComponentsForFeature(feature)
        };

        // Cost analysis
        const cost = analysis.predictions.requiredComponents.reduce((sum, c) => {
            const comp = componentRegistry.get(c);
            return sum + (comp?.price || 0);
        }, 0);

        analysis.benefits.push({
            feature: feature,
            cost: `$${cost.toFixed(2)}`,
            complexity: this._getFeatureComplexity(feature)
        });

        // Component additions
        const additionalComponents = analysis.predictions.requiredComponents
            .map(c => {
                const comp = componentRegistry.get(c);
                return { name: comp?.name || c, model: c };
            });

        analysis.recommendations.push({
            priority: 'HIGH',
            suggestion: `To add ${feature}, you need:`,
            components: additionalComponents,
            estimatedCost: `$${cost.toFixed(2)}`,
            estimatedTime: `${this._getImplementationTime(feature)} hours`
        });

        return analysis;
    }

    /**
     * Helper: Analyze current impact
     */
    _analyzeCurrentImpact(circuit, ratio) {
        const baselineCurrent = this._calculateTotalCurrent(circuit);
        const newCurrent = baselineCurrent * ratio;

        return {
            baseline: `${baselineCurrent} mA`,
            predicted: `${newCurrent.toFixed(0)} mA`,
            increase: `+${((ratio - 1) * 100).toFixed(0)}%`,
            warning: newCurrent > 500 ? 'Exceeds USB current limit!' : 'OK'
        };
    }

    /**
     * Helper: Analyze power impact
     */
    _analyzePowerImpact(circuit, ratio) {
        const voltage = this._getCircuitVoltage(circuit);
        const current = this._calculateTotalCurrent(circuit);
        const basePower = (voltage * current) / 1000; // Convert to Watts
        const newPower = basePower * ratio;

        return {
            baseline: `${basePower.toFixed(1)}W`,
            predicted: `${newPower.toFixed(1)}W`,
            increase: `+${((ratio - 1) * 100).toFixed(0)}%`,
            thermalNote: newPower > 1 ? 'May generate heat - add heat dissipation' : 'Acceptable'
        };
    }

    /**
     * Helper: Analyze runtime impact
     */
    _analyzeRuntimeImpact(circuit, ratio) {
        // If voltage increases, battery runtime decreases (more power draw)
        // If using battery, lower power consumption means longer runtime

        return {
            powerConsumption: `Increases by ~${((ratio - 1) * 100).toFixed(0)}%`,
            batteryRuntime: `Decreases by ~${((ratio - 1) * 100).toFixed(0)}%`,
            recommendation: 'Consider using larger battery capacity'
        };
    }

    /**
     * Helper: Calculate total circuit current
     */
    _calculateTotalCurrent(circuit) {
        let total = 0;
        circuit.components?.forEach(comp => {
            const spec = componentRegistry.get(comp.model || comp.type);
            if (spec?.specs?.maxCurrent) {
                total += spec.specs.maxCurrent;
            }
        });
        return total;
    }

    /**
     * Helper: Get circuit operating voltage
     */
    _getCircuitVoltage(circuit) {
        let voltage = 5; // Default
        circuit.components?.forEach(comp => {
            const spec = componentRegistry.get(comp.model || comp.type);
            if (spec?.specs?.operatingVoltage) {
                voltage = spec.specs.operatingVoltage;
            }
        });
        return voltage;
    }

    /**
     * Helper: Get available pins
     */
    _getAvailablePins(circuit) {
        // Simplified - just return estimate
        const microcontroller = circuit.components?.find(c => c.type === 'Microcontroller');
        if (!microcontroller) return 0;

        const spec = componentRegistry.get(microcontroller.model || 'arduino-uno');
        const pinCount = spec?.pins ? Object.keys(spec.pins).length : 14;
        const usedPins = circuit.connections?.length || 0;

        return Math.max(0, pinCount - usedPins);
    }

    /**
     * Helper: Get components needed for feature
     */
    _getComponentsForFeature(feature) {
        const featureMap = {
            'wireless': ['wifi-esp8266', 'bluetooth-hc05'],
            'temperature_monitoring': ['dht22'],
            'distance_sensing': ['hc-sr04'],
            'motion_detection': ['mpu6050'],
            'rgb_lighting': ['rgb-led'],
            'motor_control': ['dc-motor-3v', 'l298n'],
            'servo_control': ['servo-sg90']
        };

        return featureMap[feature] || [];
    }

    /**
     * Helper: Get feature complexity
     */
    _getFeatureComplexity(feature) {
        const complexity = {
            'wireless': 'Complex',
            'temperature_monitoring': 'Simple',
            'distance_sensing': 'Medium',
            'motion_detection': 'Complex',
            'rgb_lighting': 'Simple',
            'motor_control': 'Medium',
            'servo_control': 'Medium'
        };

        return complexity[feature] || 'Unknown';
    }

    /**
     * Helper: Get implementation time
     */
    _getImplementationTime(feature) {
        const times = {
            'wireless': 4,
            'temperature_monitoring': 1,
            'distance_sensing': 2,
            'motion_detection': 3,
            'rgb_lighting': 1,
            'motor_control': 2,
            'servo_control': 1.5
        };

        return times[feature] || 2;
    }

    /**
     * Helper: Recommend voltage levelers
     */
    _recommendVoltageLevelersForChange(circuit, oldVoltage, newVoltage) {
        if (newVoltage > oldVoltage) {
            return ['Linear Regulator (LDO)', 'Voltage Divider'];
        } else {
            return ['Boost Converter', 'Charge Pump'];
        }
    }
}

export const whatIfAnalyzer = new WhatIfAnalyzer();
