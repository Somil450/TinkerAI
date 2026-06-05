import { expandBreadboardConnections } from './graph.js';
import { componentRegistry } from './componentRegistry.js';

let selectedPin = null;
let connections = [];

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
    return expandBreadboardConnections(connections, componentRegistry);
}

export function removeConnection(index) {
    connections.splice(index, 1);
}