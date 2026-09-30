import { DeliveryLocation, Road, DijkstraResult, DijkstraStep, TraversalStep } from '../types';

export interface GraphEdge {
  to: string;
  roadId: string;
  distanceKm: number;
  speedLimitKmH: number;
  trafficFactor: number;
  effectiveWeight: number; // distanceKm * trafficFactor
  travelTimeMin: number; // (distanceKm / speedLimitKmH) * 60 * trafficFactor
}

export class WeightedGraph {
  public nodes: Map<string, DeliveryLocation> = new Map();
  public adjacencyList: Map<string, GraphEdge[]> = new Map();
  public roads: Map<string, Road> = new Map();

  constructor(locations: DeliveryLocation[] = [], roads: Road[] = []) {
    for (const loc of locations) {
      this.addNode(loc);
    }
    for (const road of roads) {
      this.addEdge(road);
    }
  }

  addNode(location: DeliveryLocation): void {
    this.nodes.set(location.id, location);
    if (!this.adjacencyList.has(location.id)) {
      this.adjacencyList.set(location.id, []);
    }
  }

  removeNode(locationId: string): void {
    this.nodes.delete(locationId);
    this.adjacencyList.delete(locationId);

    // Remove edges connected to this node
    for (const [nodeId, edges] of this.adjacencyList.entries()) {
      this.adjacencyList.set(
        nodeId,
        edges.filter(e => e.to !== locationId)
      );
    }

    // Remove roads from road map
    for (const [roadId, road] of this.roads.entries()) {
      if (road.from === locationId || road.to === locationId) {
        this.roads.delete(roadId);
      }
    }
  }

  addEdge(road: Road): void {
    this.roads.set(road.id, road);
    const effectiveWeight = road.distanceKm * road.trafficFactor;
    const travelTimeMin = (road.distanceKm / Math.max(10, road.speedLimitKmH)) * 60 * road.trafficFactor;

    if (!this.adjacencyList.has(road.from)) {
      this.adjacencyList.set(road.from, []);
    }
    if (!this.adjacencyList.has(road.to)) {
      this.adjacencyList.set(road.to, []);
    }

    // Add forward edge
    this.adjacencyList.get(road.from)!.push({
      to: road.to,
      roadId: road.id,
      distanceKm: road.distanceKm,
      speedLimitKmH: road.speedLimitKmH,
      trafficFactor: road.trafficFactor,
      effectiveWeight,
      travelTimeMin,
    });

    // If bidirectional, add reverse edge
    if (road.isBidirectional) {
      this.adjacencyList.get(road.to)!.push({
        to: road.from,
        roadId: road.id,
        distanceKm: road.distanceKm,
        speedLimitKmH: road.speedLimitKmH,
        trafficFactor: road.trafficFactor,
        effectiveWeight,
        travelTimeMin,
      });
    }
  }

  removeEdge(roadId: string): void {
    const road = this.roads.get(roadId);
    if (!road) return;

    this.roads.delete(roadId);
    const edgesFrom = this.adjacencyList.get(road.from);
    if (edgesFrom) {
      this.adjacencyList.set(road.from, edgesFrom.filter(e => e.roadId !== roadId));
    }

    if (road.isBidirectional) {
      const edgesTo = this.adjacencyList.get(road.to);
      if (edgesTo) {
        this.adjacencyList.set(road.to, edgesTo.filter(e => e.roadId !== roadId));
      }
    }
  }

  /**
   * Dijkstra's Algorithm for Shortest Path Optimization
   * Computes shortest path based on effective weight (distance adjusted for traffic)
   * Records step-by-step relaxation for visualization
   */
  dijkstra(startNodeId: string, targetNodeId?: string): DijkstraResult {
    const distances: Record<string, number> = {};
    const previous: Record<string, string | null> = {};
    const visitedSet = new Set<string>();
    const unvisitedSet = new Set<string>();
    const steps: DijkstraStep[] = [];
    const visitedOrder: string[] = [];

    // Initialize all distances to Infinity
    for (const nodeId of this.nodes.keys()) {
      distances[nodeId] = Infinity;
      previous[nodeId] = null;
      unvisitedSet.add(nodeId);
    }

    distances[startNodeId] = 0;

    steps.push({
      step: 0,
      currentNode: startNodeId,
      currentNodeName: this.nodes.get(startNodeId)?.name || startNodeId,
      tentativeDistances: { ...distances },
      visitedNodes: [],
      unvisitedNodes: Array.from(unvisitedSet),
      relaxedEdges: [],
      description: `Initialized source node "${this.nodes.get(startNodeId)?.name}" distance to 0 km; all other nodes set to ∞.`,
    });

    let currentStepNum = 1;

    while (unvisitedSet.size > 0) {
      // Find unvisited node with smallest tentative distance
      let minNode: string | null = null;
      let minDistance = Infinity;

      for (const nodeId of unvisitedSet) {
        if (distances[nodeId] < minDistance) {
          minDistance = distances[nodeId];
          minNode = nodeId;
        }
      }

      // If smallest distance is infinity, remaining nodes are unreachable
      if (minNode === null || minDistance === Infinity) {
        break;
      }

      // Visit this node
      unvisitedSet.delete(minNode);
      visitedSet.add(minNode);
      visitedOrder.push(minNode);

      // If we reached the target node, we can choose to record and stop early
      const reachedTarget = targetNodeId && minNode === targetNodeId;

      const relaxedEdgesThisStep: { from: string; to: string; newDist: number }[] = [];
      const neighbors = this.adjacencyList.get(minNode) || [];

      for (const edge of neighbors) {
        if (!visitedSet.has(edge.to)) {
          const alternateDist = distances[minNode] + edge.effectiveWeight;
          if (alternateDist < distances[edge.to]) {
            distances[edge.to] = Number(alternateDist.toFixed(2));
            previous[edge.to] = minNode;
            relaxedEdgesThisStep.push({ from: minNode, to: edge.to, newDist: distances[edge.to] });
          }
        }
      }

      const minLocName = this.nodes.get(minNode)?.name || minNode;
      steps.push({
        step: currentStepNum++,
        currentNode: minNode,
        currentNodeName: minLocName,
        tentativeDistances: { ...distances },
        visitedNodes: Array.from(visitedSet),
        unvisitedNodes: Array.from(unvisitedSet),
        relaxedEdges: relaxedEdgesThisStep,
        description: `Selected node "${minLocName}" (distance: ${minDistance.toFixed(1)} km). ${
          relaxedEdgesThisStep.length > 0
            ? `Relaxed ${relaxedEdgesThisStep.length} outgoing road(s).`
            : 'No road relaxations found.'
        }`,
      });

      if (reachedTarget) {
        break;
      }
    }

    // Reconstruct path to target if specified
    const path: string[] = [];
    let totalDistKm = 0;
    let estimatedTimeMin = 0;

    if (targetNodeId && distances[targetNodeId] !== Infinity) {
      let curr: string | null = targetNodeId;
      while (curr) {
        path.unshift(curr);
        curr = previous[curr];
      }

      // Calculate exact sum of distances and travel times along path
      for (let i = 0; i < path.length - 1; i++) {
        const u = path[i];
        const v = path[i + 1];
        const edge = (this.adjacencyList.get(u) || []).find(e => e.to === v);
        if (edge) {
          totalDistKm += edge.distanceKm;
          estimatedTimeMin += edge.travelTimeMin;
        }
      }
    }

    return {
      distances,
      previous,
      path,
      totalDistanceKm: Number(totalDistKm.toFixed(1)),
      estimatedTimeMin: Math.round(estimatedTimeMin),
      steps,
      visitedOrder,
    };
  }

  /**
   * Breadth-First Search (BFS) for layer-by-layer network exploration
   * Uses a Queue (FIFO)
   */
  bfs(startNodeId: string): { visitedOrder: string[]; steps: TraversalStep[] } {
    const visited = new Set<string>();
    const queue: string[] = [];
    const steps: TraversalStep[] = [];
    const visitedOrder: string[] = [];

    if (!this.nodes.has(startNodeId)) {
      return { visitedOrder: [], steps: [] };
    }

    visited.add(startNodeId);
    queue.push(startNodeId);

    steps.push({
      step: 0,
      currentNode: startNodeId,
      currentNodeName: this.nodes.get(startNodeId)?.name || startNodeId,
      frontier: [...queue],
      visited: Array.from(visited),
      description: `Starting BFS at root node "${this.nodes.get(startNodeId)?.name}". Enqueued into FIFO Queue.`,
    });

    let stepNum = 1;
    while (queue.length > 0) {
      const current = queue.shift()!;
      visitedOrder.push(current);
      const currName = this.nodes.get(current)?.name || current;

      const neighbors = this.adjacencyList.get(current) || [];
      const newlyEnqueued: string[] = [];

      for (const edge of neighbors) {
        if (!visited.has(edge.to)) {
          visited.add(edge.to);
          queue.push(edge.to);
          newlyEnqueued.push(this.nodes.get(edge.to)?.name || edge.to);
        }
      }

      steps.push({
        step: stepNum++,
        currentNode: current,
        currentNodeName: currName,
        frontier: [...queue],
        visited: Array.from(visited),
        description: `Dequeued "${currName}". Discovered ${newlyEnqueued.length} unvisited neighbor(s): [${newlyEnqueued.join(', ')}]. Queue frontier size: ${queue.length}.`,
      });
    }

    return { visitedOrder, steps };
  }

  /**
   * Depth-First Search (DFS) for branch-first network exploration
   * Uses an explicit Stack (LIFO)
   */
  dfs(startNodeId: string): { visitedOrder: string[]; steps: TraversalStep[] } {
    const visited = new Set<string>();
    const stack: string[] = [];
    const steps: TraversalStep[] = [];
    const visitedOrder: string[] = [];

    if (!this.nodes.has(startNodeId)) {
      return { visitedOrder: [], steps: [] };
    }

    stack.push(startNodeId);

    steps.push({
      step: 0,
      currentNode: startNodeId,
      currentNodeName: this.nodes.get(startNodeId)?.name || startNodeId,
      frontier: [...stack],
      visited: [],
      description: `Pushed root "${this.nodes.get(startNodeId)?.name}" onto DFS LIFO Stack.`,
    });

    let stepNum = 1;
    while (stack.length > 0) {
      const current = stack.pop()!;
      if (!visited.has(current)) {
        visited.add(current);
        visitedOrder.push(current);
        const currName = this.nodes.get(current)?.name || current;

        const neighbors = this.adjacencyList.get(current) || [];
        const newlyPushed: string[] = [];

        // Push neighbors onto stack (reverse order so first neighbor is popped first)
        for (let i = neighbors.length - 1; i >= 0; i--) {
          const neighbor = neighbors[i].to;
          if (!visited.has(neighbor)) {
            stack.push(neighbor);
            newlyPushed.push(this.nodes.get(neighbor)?.name || neighbor);
          }
        }

        steps.push({
          step: stepNum++,
          currentNode: current,
          currentNodeName: currName,
          frontier: [...stack],
          visited: Array.from(visited),
          description: `Popped and visited "${currName}". Pushed unvisited neighbors [${newlyPushed.join(', ')}] onto Stack. Stack depth: ${stack.length}.`,
        });
      }
    }

    return { visitedOrder, steps };
  }

  /**
   * Generates Adjacency Matrix representation for visual tabular display
   */
  getAdjacencyMatrix(): { headers: string[]; matrix: (number | null)[][] } {
    const nodeIds = Array.from(this.nodes.keys());
    const headers = nodeIds.map(id => this.nodes.get(id)?.code || id);
    const matrix: (number | null)[][] = [];

    for (let i = 0; i < nodeIds.length; i++) {
      const row: (number | null)[] = [];
      const edges = this.adjacencyList.get(nodeIds[i]) || [];

      for (let j = 0; j < nodeIds.length; j++) {
        if (i === j) {
          row.push(0);
        } else {
          const match = edges.find(e => e.to === nodeIds[j]);
          row.push(match ? match.distanceKm : null);
        }
      }
      matrix.push(row);
    }

    return { headers, matrix };
  }

  getMetrics(): {
    nodeCount: number;
    edgeCount: number;
    density: number;
    avgDegree: number;
    isFullyConnected: boolean;
  } {
    const V = this.nodes.size;
    let totalEdges = 0;
    for (const edges of this.adjacencyList.values()) {
      totalEdges += edges.length;
    }

    const density = V > 1 ? totalEdges / (V * (V - 1)) : 0;
    const avgDegree = V > 0 ? totalEdges / V : 0;

    let isFullyConnected = false;
    if (V > 0) {
      const firstNode = Array.from(this.nodes.keys())[0];
      const { visitedOrder } = this.bfs(firstNode);
      isFullyConnected = visitedOrder.length === V;
    }

    return {
      nodeCount: V,
      edgeCount: this.roads.size,
      density: Number(density.toFixed(3)),
      avgDegree: Number(avgDegree.toFixed(2)),
      isFullyConnected,
    };
  }
}
