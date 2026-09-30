import { GreedyDispatcher, GreedyPlanResult } from './Greedy';
import { WeightedGraph } from './Graph';
import { Package, Vehicle } from '../types';

export class GreedyRouter {
  private graph: WeightedGraph;

  constructor(graph: WeightedGraph) {
    this.graph = graph;
  }

  planGreedyRoute(startHubId: string, candidatePackages: Package[], maxCapacityKg: number): {
    totalDistanceKm: number;
    totalWeightKg: number;
    steps: {
      fromNodeId: string;
      toNodeId: string;
      packageCode: string;
      recipient: string;
      stepDistanceKm: number;
      cumulativeDistanceKm: number;
    }[];
  } {
    const dummyVehicle: Vehicle = {
      id: 'dispatch-v',
      name: 'Active Carrier',
      type: 'van',
      maxCapacityKg,
      currentPayloadKg: 0,
      currentLocationId: startHubId,
      averageSpeedKmH: 45,
      status: 'idle',
      assignedPackageIds: [],
    };

    const plan = GreedyDispatcher.planGreedyRoute(this.graph, dummyVehicle, candidatePackages);

    let cumulative = 0;
    let prevHub = startHubId;
    const steps = plan.selectedPackages.map((pkg, idx) => {
      const stepDist = this.graph.dijkstra(prevHub, pkg.destinationLocationId).totalDistanceKm;
      cumulative += stepDist;
      const res = {
        fromNodeId: prevHub,
        toNodeId: pkg.destinationLocationId,
        packageCode: pkg.trackingCode,
        recipient: pkg.recipient,
        stepDistanceKm: Number(stepDist.toFixed(1)),
        cumulativeDistanceKm: Number(cumulative.toFixed(1)),
      };
      prevHub = pkg.destinationLocationId;
      return res;
    });

    const totalWeight = plan.selectedPackages.reduce((acc, p) => acc + p.weightKg, 0);

    return {
      totalDistanceKm: plan.totalDistanceKm,
      totalWeightKg: Number(totalWeight.toFixed(1)),
      steps,
    };
  }
}
