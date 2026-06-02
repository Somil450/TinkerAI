import { safetyEngine } from '../ai/safetyEngine.js';
import { componentRegistry } from './componentRegistry.js';

export function validateCircuit(connections) {
    if (!connections || connections.length === 0) {
        return {
            valid: true, // A circuit with no connections is trivially valid
            message: "No connections",
            issues: []
        };
    }

    const circuitGraph = {
        components: componentRegistry.map(c => ({ id: c.id, type: c.type })),
        connections: connections.map(c => ({ from: c.from, to: c.to })),
    };

    const safetyStatus = safetyEngine.analyze(circuitGraph);
    
    // We consider the circuit "invalid" if there are any critical issues
    if (safetyStatus.critical.length > 0) {
        return {
            valid: false,
            message: safetyStatus.critical[0].message,
            issues: safetyStatus.critical,
            warnings: safetyStatus.warnings
        };
    }

    return {
        valid: true,
        message: safetyStatus.warnings.length > 0 ? "Circuit valid with warnings" : "Circuit valid",
        issues: safetyStatus.high,
        warnings: safetyStatus.warnings
    };
}