import React, { useState } from 'react';
import { 
  Truck, 
  Bike, 
  Plane, 
  Car, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Scale, 
  Clock, 
  Send,
  Navigation,
  ChevronRight
} from 'lucide-react';
import { Vehicle, Package, DeliveryLocation, GreedyStep } from '../types';
import { WeightedGraph } from '../dsa/Graph';
import { GreedyDispatcher, GreedyPlanResult } from '../dsa/Greedy';

interface FleetManagerProps {
  vehicles: Vehicle[];
  packages: Package[];
  locations: DeliveryLocation[];
  graph: WeightedGraph;
  onDispatchGreedyPlan: (vehicleId: string, selectedPackageIds: string[]) => void;
  onResetVehicle: (vehicleId: string) => void;
}

export const FleetManager: React.FC<FleetManagerProps> = ({
  vehicles,
  packages,
  locations,
  graph,
  onDispatchGreedyPlan,
  onResetVehicle,
}) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0]?.id || '');
  const [greedyPlan, setGreedyPlan] = useState<GreedyPlanResult | null>(null);

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

  const handleRunGreedy = () => {
    if (!selectedVehicle) return;
    const plan = GreedyDispatcher.planGreedyRoute(graph, selectedVehicle, packages);
    setGreedyPlan(plan);
  };

  const getVehicleIcon = (type: Vehicle['type']) => {
    switch (type) {
      case 'drone':
        return Plane;
      case 'bike':
        return Bike;
      case 'van':
        return Car;
      case 'truck':
        return Truck;
      default:
        return Truck;
    }
  };

  const getLocationName = (id: string) => {
    return locations.find(l => l.id === id)?.name || id;
  };

  return (
    <div className="space-y-6">
      {/* Fleet Overview Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <Truck className="w-4 h-4 text-indigo-600" />
            <span>Vehicle Fleet & Capacity Management</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Assign delivery vehicles based on payload capacity limits, operational speed, and current hub availability.
          </p>
        </div>
      </div>

      {/* Vehicle Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {vehicles.map((veh) => {
          const Icon = getVehicleIcon(veh.type);
          const isSelected = selectedVehicle?.id === veh.id;
          const capacityPercent = Math.min(100, Math.round((veh.currentPayloadKg / veh.maxCapacityKg) * 100));

          return (
            <div
              key={veh.id}
              onClick={() => { setSelectedVehicleId(veh.id); setGreedyPlan(null); }}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                isSelected
                  ? 'bg-indigo-50/70 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    veh.status === 'idle'
                      ? 'bg-emerald-100 text-emerald-800'
                      : veh.status === 'in-transit'
                      ? 'bg-blue-100 text-blue-800 animate-pulse'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {veh.status}
                </span>
              </div>

              <h4 className="font-bold text-sm text-slate-900">{veh.name}</h4>
              <div className="text-[11px] text-slate-500 font-mono mb-3">
                Speed: {veh.averageSpeedKmH} km/h • Hub: {getLocationName(veh.currentLocationId)}
              </div>

              {/* Payload Capacity Bar */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>Payload: {veh.currentPayloadKg} / {veh.maxCapacityKg} kg</span>
                  <span className="font-bold">{capacityPercent}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      capacityPercent > 80 ? 'bg-rose-500' : capacityPercent > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${capacityPercent}%` }}
                  />
                </div>
              </div>

              {veh.assignedPackageIds.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-slate-500 flex justify-between items-center">
                  <span>{veh.assignedPackageIds.length} Assigned Package(s)</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); onResetVehicle(veh.id); }}
                    className="text-rose-600 hover:text-rose-800 font-semibold"
                  >
                    Unload
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Greedy Route Dispatcher Section */}
      {selectedVehicle && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h4 className="font-bold text-sm text-slate-900">
                  Greedy Route Optimizer for {selectedVehicle.name}
                </h4>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Uses a Greedy Nearest-Neighbor heuristic with deadline urgency weighting to plan an optimal multi-stop itinerary that fits within remaining capacity ({selectedVehicle.maxCapacityKg - selectedVehicle.currentPayloadKg} kg).
              </p>
            </div>

            <button
              onClick={handleRunGreedy}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition flex items-center space-x-1.5 shadow-xs"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Generate Greedy Route</span>
            </button>
          </div>

          {/* Greedy Plan Result */}
          {greedyPlan ? (
            <div className="space-y-4">
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-lg p-3 text-xs text-indigo-900 flex items-center justify-between">
                <span>{greedyPlan.explanation}</span>
                {greedyPlan.selectedPackages.length > 0 && (
                  <button
                    onClick={() =>
                      onDispatchGreedyPlan(
                        selectedVehicle.id,
                        greedyPlan.selectedPackages.map(p => p.id)
                      )
                    }
                    className="px-3 py-1 bg-indigo-600 text-white rounded font-semibold text-xs hover:bg-indigo-500 transition ml-3 shrink-0"
                  >
                    Dispatch Itinerary
                  </button>
                )}
              </div>

              {/* Itinerary Stops Sequence */}
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Optimized Delivery Route Stops:
                </span>
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  {greedyPlan.routeStops.map((stop, i) => (
                    <React.Fragment key={stop.id + i}>
                      <span className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-semibold shadow-xs">
                        {i + 1}. {stop.name} ({stop.code})
                      </span>
                      {i < greedyPlan.routeStops.length - 1 && (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Greedy Choice Evaluation Log */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Greedy Decision Breakdown at Each Node:
                </span>
                <div className="space-y-2">
                  {greedyPlan.steps.map((step) => (
                    <div
                      key={step.step}
                      className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between font-semibold text-slate-800">
                        <span>Decision #{step.step} at {step.currentHub}</span>
                        <span className="text-emerald-700 font-mono">
                          Cumulative Distance: {step.cumulativeDistance} km
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">{step.reason}</p>

                      {/* Candidate Comparison Table */}
                      <div className="bg-white border border-slate-200 rounded p-2 text-[10px]">
                        <span className="font-semibold text-slate-500 uppercase block mb-1">
                          Candidate Packages Evaluated:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {step.candidatePackages.map((cand) => {
                            const isWinner = cand.id === step.selectedPackageId;
                            return (
                              <div
                                key={cand.id}
                                className={`p-1.5 rounded border ${
                                  isWinner
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                                    : 'bg-slate-50 border-slate-200 text-slate-600'
                                }`}
                              >
                                <div className="truncate">{cand.recipient}</div>
                                <div className="font-mono text-[9px]">
                                  Dist: {cand.distance}km • Score: {cand.score}
                                  {isWinner && ' (Selected)'}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs">
              Click &quot;Generate Greedy Route&quot; to calculate the locally optimal multi-stop itinerary for this vehicle.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
