export function buildGraph(connections) {
    const graph = {};

    connections.forEach(connection => {
        if (!graph[connection.from]) {
            graph[connection.from] = [];
        }
        graph[connection.from].push(connection.to);
    });

    return graph;
}

export function expandBreadboardConnections(baseConnections, componentRegistry) {
    const allConns = [...baseConnections];

    componentRegistry.forEach(comp => {
        if (comp.type === 'breadboard-400' || comp.type === 'breadboard-830') {
            const rows = comp.type === 'breadboard-400' ? 30 : 63;
            const blocks = comp.type === 'breadboard-400' ? 5 : 10;
            const bbId = comp.id;

            // Connect row halves (a-e) and (f-j)
            const leftLetters = ['a','b','c','d','e'];
            const rightLetters = ['f','g','h','i','j'];

            for (let r = 1; r <= rows; r++) {
                for (let i = 0; i < 4; i++) {
                    allConns.push({ from: `${bbId}.${r}${leftLetters[i]}`, to: `${bbId}.${r}${leftLetters[i+1]}` });
                    allConns.push({ from: `${bbId}.${r}${rightLetters[i]}`, to: `${bbId}.${r}${rightLetters[i+1]}` });
                }
            }

            // Connect power rails (each rail is 1 continuous strip)
            for (let i = 0; i < (blocks * 5) - 1; i++) {
                allConns.push({ from: `${bbId}.pL_pos_${i}`, to: `${bbId}.pL_pos_${i+1}` });
                allConns.push({ from: `${bbId}.pL_neg_${i}`, to: `${bbId}.pL_neg_${i+1}` });
                allConns.push({ from: `${bbId}.pR_pos_${i}`, to: `${bbId}.pR_pos_${i+1}` });
                allConns.push({ from: `${bbId}.pR_neg_${i}`, to: `${bbId}.pR_neg_${i+1}` });
            }
        }
    });

    return allConns;
}