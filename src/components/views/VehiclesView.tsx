import React, { useState } from 'react';
import { 
  Truck, 
  User, 
  MapPin, 
  Package as PackageIcon, 
  Sparkles, 
  Activity, 
  Battery, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  RotateCcw,
  Navigation,
  ChevronRight,
  Zap
} from 'lucide-react';
import { Vehicle, Package, DeliveryLocation } from '../../types';
import { WeightedGraph } from '../../dsa/Graph';
import { GreedyRouter } from '../../dsa/GreedyRouter';

interface VehiclesViewProps {
  vehicles: Vehicle[];
  packages: Package[];
  locations: DeliveryLocation[];
  graph: WeightedGraph;
  onAssignPackageToVehicle: (vehicleId: string, packageId: string) => void;
  onOptimizeRoute: (sourceId: string, destId: string) => void;
  onSelectPackage: (pkg: Package) => void;
  onResetVehicle: (vehicleId: string) => void;
}

export const VehiclesView: React.FC<VehiclesViewProps> = ({
  vehicles,
  packages,
  locations,
  graph,
  onAssignPackageToVehicle,
  onOptimizeRoute,
  onSelectPackage,
  onResetVehicle,
}) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0]?.id || '');
  const [greedyReport, setGreedyReport] = useState<any | null>(null);

  const activeVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

  // Run Greedy Route Optimization for the selected vehicle
  const handleRunGreedyDispatch = (vehicle: Vehicle) => {
    const unassigned = packages.filter(p => p.status !== 'delivered');
    const router = new GreedyRouter(graph);
    const result = router.planGreedyRoute(vehicle.currentLocationId, unassigned, vehicle.maxCapacityKg);
    setGreedyReport(result);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Truck className="w-4 h-4" />
            <span>CARRIER FLEET TELEMETRY & CAPACITY OPTIMIZATION</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Vehicle Fleet Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Monitor real-time payload capacities, assigned routes, and execute Greedy dispatching
          </p>
        </div>

        {activeVehicle && (
          <button
            onClick={() => handleRunGreedyDispatch(activeVehicle)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Greedy Route Dispatcher</span>
          </button>
        )}
      </div>

      {/* Vehicle Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map(vehicle => {
          const isSelected = vehicle.id === selectedVehicleId;
          const assigned = packages.filter(p => vehicle.assignedPackageIds.includes(p.id));
          const currentLoc = locations.find(l => l.id === vehicle.currentLocationId);
          const capacityPercent = Math.min(100, Math.round((vehicle.currentPayloadKg / vehicle.maxCapacityKg) * 100));

          return (
            <div
              key={vehicle.id}
              onClick={() => setSelectedVehicleId(vehicle.id)}
              className={`p-6 rounded-3xl border transition-all cursor-pointer shadow-xs hover:shadow-md ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 border-blue-500 ring-2 ring-blue-500/20 shadow-blue-500/10'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Top Meta */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-xs ${
                    vehicle.type === 'drone' ? 'bg-cyan-500 shadow-cyan-500/30' :
                    vehicle.type === 'bike' ? 'bg-emerald-500 shadow-emerald-500/30' :
                    vehicle.type === 'van' ? 'bg-blue-600 shadow-blue-500/30' :
                    'bg-slate-700 shadow-slate-700/30'
                  }`}>
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {vehicle.name}
                    </h3>
                    <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <User className="w-3.5 h-3.5" />
                      <span>{vehicle.driverName || 'Autonomous Guidance'}</span>
                    </div>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                  vehicle.status === 'in-transit' ? 'bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800' :
                  vehicle.status === 'idle' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' :
                  'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                }`}>
                  {vehicle.status}
                </span>
              </div>

              {/* Payload Capacity Bar */}
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Payload Capacity</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {vehicle.currentPayloadKg} / {vehicle.maxCapacityKg} kg ({capacityPercent}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      capacityPercent > 85 ? 'bg-rose-500' :
                      capacityPercent > 50 ? 'bg-amber-500' :
                      'bg-blue-600'
                    }`}
                    style={{ width: `${capacityPercent}%` }}
                  />
                </div>
              </div>

              {/* Station & Specs */}
              <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Station</span>
                  <div className="flex items-center space-x-1 font-semibold text-slate-900 dark:text-white mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="truncate">{currentLoc?.name || vehicle.currentLocationId}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Cruising Speed</span>
                  <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                    {vehicle.averageSpeedKmH} km/h
                  </div>
                </div>
              </div>

              {/* Assigned Parcels Summary */}
              <div className="pt-3 flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-slate-400">Shipments: </span>
                  <span className="font-bold text-slate-900 dark:text-white">{assigned.length} assigned</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onResetVehicle(vehicle.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Reset Payload"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleRunGreedyDispatch(vehicle);
                    }}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
                  >
                    Greedy Route
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Greedy Route Dispatcher Results Modal/Card */}
      {greedyReport && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-cyan-900/60 text-white shadow-2xl space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
            <div>
              <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono font-bold">
                <Sparkles className="w-4 h-4" />
                <span>GREEDY APPROXIMATION ALGORITHM DISPATCH PLAN</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                Multi-Stop Delivery Route for {activeVehicle?.name}
              </h3>
            </div>
            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className="text-slate-400">Total Distance: <strong className="text-cyan-400">{greedyReport.totalDistanceKm} km</strong></span>
              <span className="text-slate-400">Capacity Used: <strong className="text-white">{greedyReport.totalWeightKg} kg</strong></span>
              <button
                onClick={() => setGreedyReport(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕ Close
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Step-by-Step Greedy Selection Trajectory
            </h4>
            <div className="space-y-2">
              {greedyReport.steps.map((step: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-mono font-bold flex items-center justify-center text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="font-bold text-white">
                        From {locations.find(l => l.id === step.fromNodeId)?.name || step.fromNodeId} → {locations.find(l => l.id === step.toNodeId)?.name || step.toNodeId}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Delivered Package: <strong className="text-cyan-300">{step.packageCode}</strong> ({step.recipient})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 font-mono text-[11px] text-slate-300">
                    <span>Leg: {step.stepDistanceKm} km</span>
                    <span className="text-emerald-400">Cumul: {step.cumulativeDistanceKm} km</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
