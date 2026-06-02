let selectedPin = null;
const connections = [];

export function selectPin(componentId, pinId, pinElement) {
    const fullPin = `${componentId}.${pinId}`;

    if (!selectedPin) {
        selectedPin = {
            id: fullPin,
            element: pinElement
        };
        return null;
    }

    const connection = {
        from: selectedPin.id,
        to: fullPin,
        fromElement: selectedPin.element,
        toElement: pinElement
    };

    connections.push(connection);
    selectedPin = null;
    return connection;
}

export function getConnections() {
    return connections;
}