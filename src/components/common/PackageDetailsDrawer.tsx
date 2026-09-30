import React, { useMemo } from 'react';
import { 
  X, 
  Package as PackageIcon, 
  MapPin, 
  Clock, 
  Scale, 
  User, 
  Phone, 
  Truck, 
  Navigation, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Package, DeliveryLocation, Vehicle, NavTab } from '../../types';
import { WeightedGraph } from '../../dsa/Graph';

interface PackageDetailsDrawerProps {
  pkg: Package | null;
  onClose: () => void;
  locations: DeliveryLocation[];
  vehicles: Vehicle[];
  graph: WeightedGraph;
  onOptimizeRoute: (sourceId: string, destId: string) => void;
  onUpdateStatus?: (pkgId: string, status: Package['status']) => void;
}

export const PackageDetailsDrawer: React.FC<PackageDetailsDrawerProps> = ({
  pkg,
  onClose,
  locations,
  vehicles,
  graph,
  onOptimizeRoute,
  onUpdateStatus,
}) => {
  if (!pkg) return null;

  const sourceLoc = locations.find(l => l.id === pkg.sourceLocationId);
  const destLoc = locations.find(l => l.id === pkg.destinationLocationId);
  const vehicle = vehicles.find(v => v.id === pkg.assignedVehicleId);

  // Compute Dijkstra path for this package
  const dijkstraRoute = useMemo(() => {
    if (!pkg.sourceLocationId || !pkg.destinationLocationId) return null;
    return graph.dijkstra(pkg.sourceLocationId, pkg.destinationLocationId);
  }, [graph, pkg.sourceLocationId, pkg.destinationLocationId]);

  // Determine timeline progress
  const timelineSteps = [
    { key: 'created', label: 'Registered', done: true, time: new Date(pkg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    { key: 'assigned', label: 'Assigned', done: Boolean(pkg.assignedVehicleId) || pkg.status !== 'pending', time: vehicle ? vehicle.name : 'Awaiting' },
    { key: 'dispatched', label: 'Dispatched', done: pkg.status === 'in-transit' || pkg.status === 'delivered', time: pkg.status === 'in-transit' ? 'In Progress' : '' },
    { key: 'delivered', label: 'Delivered', done: pkg.status === 'delivered', time: pkg.deliveredAt ? new Date(pkg.deliveredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in" 
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 z-50">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-cyan-500/20">
                <PackageIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono">
                    {pkg.trackingCode}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    pkg.priority === 'critical' ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800' :
                    pkg.priority === 'urgent' ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 border border-amber-200 dark:border-amber-800' :
                    'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                  }`}>
                    {pkg.priority}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Package Details & Route Telemetry</p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close drawer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Status Banner */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                  Current Status
                </span>
                <span className={`text-sm font-bold uppercase ${
                  pkg.status === 'delivered' ? 'text-emerald-600 dark:text-emerald-400' :
                  pkg.status === 'in-transit' ? 'text-cyan-600 dark:text-cyan-400' :
                  'text-amber-600 dark:text-amber-400'
                }`}>
                  {pkg.status}
                </span>
              </div>

              {onUpdateStatus && pkg.status !== 'delivered' && (
                <button
                  onClick={() => onUpdateStatus(pkg.id, pkg.status === 'in-transit' ? 'delivered' : 'in-transit')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
                >
                  {pkg.status === 'in-transit' ? 'Mark Delivered' : 'Dispatch Now'}
                </button>
              )}
            </div>

            {/* Delivery Timeline */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                Shipment Progression Timeline
              </h4>
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {timelineSteps.map((step, idx) => (
                  <div key={step.key} className="relative flex items-center justify-between">
                    <div className={`absolute -left-6 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      step.done
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700'
                    }`}>
                      {step.done && <CheckCircle2 className="w-2.5 h-2.5" />}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${step.done ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                        {step.label}
                      </p>
                      {step.time && <p className="text-[10px] text-slate-400">{step.time}</p>}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">Step 0{idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recipient & Location Info */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Recipient Information
              </h4>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                <div className="flex items-center space-x-2 text-xs text-slate-800 dark:text-slate-200">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="font-bold">{pkg.recipient}</span>
                </div>
                {pkg.customerContact && (
                  <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-400">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{pkg.customerContact}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Weight</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{pkg.weightKg} kg</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Deadline Target</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{pkg.deadlineMinutes} mins</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Route Topology */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Graph Routing (Dijkstra)
                </h4>
                <button
                  onClick={() => {
                    onOptimizeRoute(pkg.sourceLocationId, pkg.destinationLocationId);
                    onClose();
                  }}
                  className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center space-x-1"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>View in Optimizer</span>
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {sourceLoc?.name || pkg.sourceLocationId}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {destLoc?.name || pkg.destinationLocationId}
                    </span>
                  </div>
                </div>

                {dijkstraRoute && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Shortest Distance</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {dijkstraRoute.totalDistanceKm} km
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Estimated Travel Time</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {dijkstraRoute.estimatedTimeMin} mins
                      </span>
                    </div>
                  </div>
                )}

                {/* Path Nodes sequence */}
                {dijkstraRoute && dijkstraRoute.path.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] text-slate-400 block mb-1">Optimal Node Sequence</span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {dijkstraRoute.path.map((nodeId, i) => {
                        const loc = locations.find(l => l.id === nodeId);
                        return (
                          <React.Fragment key={nodeId}>
                            <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-mono font-semibold text-slate-800 dark:text-slate-200">
                              {loc?.code || nodeId}
                            </span>
                            {i < dijkstraRoute.path.length - 1 && (
                              <ChevronRight className="w-3 h-3 text-slate-400" />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Assigned Vehicle */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Assigned Carrier
              </h4>
              {vehicle ? (
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{vehicle.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        Driver: {vehicle.driverName || 'Autonomous Pilot'} • Cap: {vehicle.maxCapacityKg} kg
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300">
                    {vehicle.status}
                  </span>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-500">
                  No vehicle assigned yet. Automatic assignment on dispatch.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
