import { componentRegistry } from './componentRegistry.js';

export class CircuitSimulator {
    constructor() {
        this.poweredComponents = new Set();
    }

    /**
     * Run the simulation to find powered components
     * @param {Array} connections - Array of connection objects
     * @returns {Set} Set of component IDs that are powered
     */
    simulate(connections) {
        this.poweredComponents.clear();
        
        // 1. Build an adjacency list for the physical pins
        // Wires are bidirectional
        const pinGraph = {};
        const addEdge = (u, v) => {
            if (!pinGraph[u]) pinGraph[u] = [];
            pinGraph[u].push(v);
        };

        connections.forEach(conn => {
            addEdge(conn.from, conn.to);
            addEdge(conn.to, conn.from);
        });

        // 2. Add internal component paths
        // e.g. Resistor_1.pin1 <-> Resistor_1.pin2
        // LED_1.anode -> LED_1.cathode (directional!)
        componentRegistry.forEach(comp => {
            const id = comp.id;
            const type = comp.type;

            if (type === 'Resistor') {
                addEdge(`${id}.pin1`, `${id}.pin2`);
                addEdge(`${id}.pin2`, `${id}.pin1`);
            } else if (type === 'LED') {
                // Diode only allows current from anode to cathode
                addEdge(`${id}.anode`, `${id}.cathode`);
            }
        });

        // 3. Find all power sources (5V) and grounds (GND)
        const sources = [];
        const grounds = new Set();

        componentRegistry.forEach(comp => {
            if (comp.type === 'Arduino') {
                sources.push(`${comp.id}.5V`);
                grounds.add(`${comp.id}.GND`);
            }
        });

        if (sources.length === 0 || grounds.size === 0) {
            return this.poweredComponents; // Nothing to power
        }

        // 4. Perform BFS/DFS from all sources to find paths to ground
        sources.forEach(source => {
            this._findPathsToGround(source, grounds, pinGraph);
        });

        return this.poweredComponents;
    }

    _findPathsToGround(startPin, groundPins, graph) {
        const queue = [[startPin]];
        const visited = new Set();
        
        while (queue.length > 0) {
            const path = queue.shift();
            const currentPin = path[path.length - 1];

            if (groundPins.has(currentPin)) {
                // We found a valid path to ground!
                // Mark all components in this path as powered
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
