export function validateCircuit(connections) {
    if (connections.length === 0) {
        return {
            valid: false,
            message: "No connections"
        };
    }

    return {
        valid: true,
        message: "Circuit valid"
    };
}