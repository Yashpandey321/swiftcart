import { Package, DeliveryLocation, Vehicle, GreedyStep } from '../types';
import { WeightedGraph } from './Graph';

export interface GreedyPlanResult {
  selectedPackages: Package[];
  routeStops: DeliveryLocation[];
  totalDistanceKm: number;
  steps: GreedyStep[];
  explanation: string;
}

/**
 * Greedy Delivery Strategy:
 * Implements a Nearest-Neighbor / Urgency-Weighted heuristic for package delivery.
 * At each step, evaluates all eligible candidate packages that fit into vehicle capacity,
 * computes a greedy cost function (effective distance / urgency bonus),
 * and greedily commits to the highest scoring candidate.
 */
export class GreedyDispatcher {
  static planGreedyRoute(
    graph: WeightedGraph,
    vehicle: Vehicle,
    candidatePackages: Package[]
  ): GreedyPlanResult {
    const selectedPackages: Package[] = [];
    const routeStops: DeliveryLocation[] = [];
    const steps: GreedyStep[] = [];
    let currentPayload = vehicle.currentPayloadKg;
    const remainingCapacity = vehicle.maxCapacityKg - currentPayload;

    let currentHubId = vehicle.currentLocationId;
    const startLoc = graph.nodes.get(currentHubId);
    if (startLoc) {
      routeStops.push(startLoc);
    }

    let remainingPackages = candidatePackages.filter(
      p => p.status === 'pending' || p.status === 'in-queue'
    );
    let totalDistanceKm = 0;
    let stepCount = 0;

    while (remainingPackages.length > 0 && currentPayload < vehicle.maxCapacityKg) {
      stepCount++;
      // Run Dijkstra from currentHubId to compute shortest distance to all other hubs
      const dijkstraResult = graph.dijkstra(currentHubId);

      // Evaluate candidates that fit within vehicle capacity
      const eligibleCandidates = remainingPackages.filter(
        p => currentPayload + p.weightKg <= vehicle.maxCapacityKg
      );

      if (eligibleCandidates.length === 0) {
        break; // No more packages fit
      }

      // Compute greedy score for each eligible package:
      // Lower distance is better, higher urgency (lower deadlineMinutes) gives higher bonus
      const scoredCandidates = eligibleCandidates.map(pkg => {
        const dist = dijkstraResult.distances[pkg.destinationLocationId] ?? Infinity;
        // Priority bonus: urgent gives 2x multiplier
        const priorityMultiplier = pkg.priority === 'urgent' ? 1.8 : 1.0;
        // Urgency factor inversely proportional to deadline
        const urgencyFactor = Math.max(1, 60 / Math.max(10, pkg.deadlineMinutes));
        // Greedy score (higher = better to pick next):
        // (100 / (distance + 1)) * priorityMultiplier * urgencyFactor
        const rawScore = dist !== Infinity 
          ? (100 / (dist + 5)) * priorityMultiplier * urgencyFactor 
          : 0;

        return {
          package: pkg,
          id: pkg.id,
          recipient: pkg.recipient,
          distance: dist !== Infinity ? dist : 999,
          score: Number(rawScore.toFixed(2)),
          weight: pkg.weightKg,
        };
      });

      // Sort by score descending (greedy choice)
      scoredCandidates.sort((a, b) => b.score - a.score);
      const chosen = scoredCandidates[0];

      if (!chosen || chosen.distance === 999) {
        break;
      }

      const winnerPackage = chosen.package;
      selectedPackages.push(winnerPackage);
      currentPayload += winnerPackage.weightKg;
      totalDistanceKm += chosen.distance;

      const destLoc = graph.nodes.get(winnerPackage.destinationLocationId);
      if (destLoc) {
        routeStops.push(destLoc);
      }

      steps.push({
        step: stepCount,
        currentHub: graph.nodes.get(currentHubId)?.name || currentHubId,
        selectedPackageId: winnerPackage.id,
        selectedPackageRecipient: winnerPackage.recipient,
        candidatePackages: scoredCandidates.map(c => ({
          id: c.id,
          recipient: c.recipient,
          distance: c.distance,
          score: c.score,
        })),
        cumulativeDistance: Number(totalDistanceKm.toFixed(1)),
        reason: `Greedily selected package for "${winnerPackage.recipient}" (Dest: ${destLoc?.name}, Weight: ${winnerPackage.weightKg}kg, Priority: ${winnerPackage.priority}). Highest evaluated heuristic score: ${chosen.score} (Shortest effective path: ${chosen.distance} km).`,
      });

      // Move vehicle current hub to the delivery destination
      currentHubId = winnerPackage.destinationLocationId;
      // Remove from remaining
      remainingPackages = remainingPackages.filter(p => p.id !== winnerPackage.id);
    }

    return {
      selectedPackages,
      routeStops,
      totalDistanceKm: Number(totalDistanceKm.toFixed(1)),
      steps,
      explanation: `Greedy Dispatcher selected ${selectedPackages.length} package(s) over ${steps.length} sequential decisions. Total accumulated distance: ${totalDistanceKm.toFixed(1)} km. Vehicle payload: ${currentPayload} / ${vehicle.maxCapacityKg} kg.`,
    };
  }
}
