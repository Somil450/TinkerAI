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