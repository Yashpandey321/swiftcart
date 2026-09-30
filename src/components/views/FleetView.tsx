import React, { useState, useMemo } from 'react';
import { 
  Truck, 
  LayoutGrid, 
  List, 
  Search, 
  Battery, 
  Fuel, 
  User, 
  MapPin, 
  Wrench, 
  Route, 
  Plus, 
  MoreVertical,
  ShieldCheck,
  AlertTriangle,
  Zap,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Vehicle, Driver, DeliveryLocation, VehicleStatus } from '../../types';
import { VehicleStatusBadge } from '../common/Badges';
import { useToast } from '../common/Toast';

interface FleetViewProps {
  vehicles: Vehicle[];
  drivers: Driver[];
  locations: DeliveryLocation[];
  onSelectVehicle?: (vehicle: Vehicle) => void;
  onAssignDriverToVehicle?: (vehicleId: string, driverId: string) => void;
  onNavigateToRoutes?: () => void;
}

export const FleetView: React.FC<FleetViewProps> = ({
  vehicles,
  drivers,
  locations,
  onSelectVehicle,
  onAssignDriverToVehicle,
  onNavigateToRoutes,
}) => {
  const { showToast } = useToast();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedVehicleForAssign, setSelectedVehicleForAssign] = useState<Vehicle | null>(null);
  const [maintenanceModalVehicle, setMaintenanceModalVehicle] = useState<Vehicle | null>(null);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      if (statusFilter !== 'all' && v.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const driver = drivers.find(d => d.id === v.assignedDriverId);
        return (
          v.id.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.plateNumber.toLowerCase().includes(q) ||
          (driver && driver.name.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [vehicles, statusFilter, searchQuery, drivers]);

  const handleAssignDriver = (vehicle: Vehicle, driverId: string) => {
    if (onAssignDriverToVehicle) {
      onAssignDriverToVehicle(vehicle.id, driverId);
    }
    const drv = drivers.find(d => d.id === driverId);
    showToast('success', 'Driver Assigned', `${drv?.name || 'Driver'} assigned to vehicle ${vehicle.id}.`);
    setSelectedVehicleForAssign(null);
  };

  return (
    <div className="space-y-5 animate-in fade-in-50 duration-200">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Fleet Management</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor vehicle telemetry, payload loads, fuel reserves, and scheduled maintenance
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700/60">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-2xs'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-2xs'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Search and Status Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search vehicle ID, model, plate, or driver..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="w-full sm:w-48">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="on_route">On Route</option>
            <option value="idle">Idle</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* 3. Grid Mode */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredVehicles.map(vehicle => {
            const driver = drivers.find(d => d.id === vehicle.assignedDriverId);
            const location = locations.find(l => l.id === vehicle.currentLocationId);
            const loadPercent = Math.round((vehicle.currentLoadKg / vehicle.maxCapacityKg) * 100);

            return (
              <div
                key={vehicle.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-500/50 transition"
              >
                <div>
                  {/* Top Bar: Vehicle ID & Status */}
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
                        {vehicle.id}
                      </span>
                      <div className="text-[11px] text-slate-400 font-mono">{vehicle.plateNumber}</div>
                    </div>
                    <VehicleStatusBadge status={vehicle.status} />
                  </div>

                  {/* Model & Type */}
                  <div className="mt-2 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>{vehicle.model}</span>
                  </div>

                  {/* Assigned Driver */}
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {driver ? driver.name.charAt(0) : '?'}
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white truncate">
                        {driver ? driver.name : 'No Driver Assigned'}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedVehicleForAssign(vehicle)}
                      className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-semibold shrink-0"
                    >
                      {driver ? 'Change' : 'Assign'}
                    </button>
                  </div>

                  {/* Capacity Progress Bar */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Payload Load:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {vehicle.currentLoadKg} / {vehicle.maxCapacityKg} kg ({loadPercent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          loadPercent > 85
                            ? 'bg-rose-500'
                            : loadPercent > 60
                            ? 'bg-amber-500'
                            : 'bg-blue-600'
                        }`}
                        style={{ width: `${Math.min(loadPercent, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Battery / Fuel & Location */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <Fuel className="w-3.5 h-3.5 text-amber-500" />
                      <span>{vehicle.fuelLevelPercent}% Fuel</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 truncate">
                      <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="truncate">{location?.name || 'Central Hub'}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions: Assign Route, View Maintenance */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={onNavigateToRoutes}
                    className="flex-1 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition text-center"
                  >
                    Assign Route
                  </button>
                  <button
                    onClick={() => setMaintenanceModalVehicle(vehicle)}
                    className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
                    title="View Maintenance"
                  >
                    <Wrench className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* 4. Table Mode */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-4">Vehicle ID</th>
                  <th className="py-3.5 px-4">Model</th>
                  <th className="py-3.5 px-4">Plate</th>
                  <th className="py-3.5 px-4">Assigned Driver</th>
                  <th className="py-3.5 px-4">Capacity Load</th>
                  <th className="py-3.5 px-4">Fuel / Battery</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {filteredVehicles.map(vehicle => {
                  const driver = drivers.find(d => d.id === vehicle.assignedDriverId);
                  const location = locations.find(l => l.id === vehicle.currentLocationId);
                  const loadPercent = Math.round((vehicle.currentLoadKg / vehicle.maxCapacityKg) * 100);

                  return (
                    <tr key={vehicle.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {vehicle.id}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                        {vehicle.model}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">
                        {vehicle.plateNumber}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                        {driver ? driver.name : <span className="text-slate-400 italic">Unassigned</span>}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white">
                        {vehicle.currentLoadKg}/{vehicle.maxCapacityKg} kg ({loadPercent}%)
                      </td>
                      <td className="py-3.5 px-4 font-medium text-amber-600 dark:text-amber-400">
                        {vehicle.fuelLevelPercent}%
                      </td>
                      <td className="py-3.5 px-4">
                        <VehicleStatusBadge status={vehicle.status} />
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        {location?.name || 'Central Hub'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedVehicleForAssign(vehicle)}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                          >
                            Assign
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Driver Assignment Modal */}
      {selectedVehicleForAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in-50 duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl max-w-sm w-full space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Assign Driver to {selectedVehicleForAssign.id}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select an available driver from your certified courier personnel:
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {drivers.map(d => (
                <button
                  key={d.id}
                  onClick={() => handleAssignDriver(selectedVehicleForAssign, d.id)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between text-xs text-left transition"
                >
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">{d.name}</div>
                    <div className="text-[10px] text-slate-400">{d.phone}</div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    d.status === 'available' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {d.status}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setSelectedVehicleForAssign(null)}
              className="w-full py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Maintenance Info Modal */}
      {maintenanceModalVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in-50 duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-600" />
                <span>Vehicle Health: {maintenanceModalVehicle.id}</span>
              </h3>
              <button onClick={() => setMaintenanceModalVehicle(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span>Last Oil Service:</span>
                <span className="font-semibold text-slate-900 dark:text-white">12 days ago</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span>Brake Pad Inspection:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Passed (88% life)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span>Next Scheduled Checkup:</span>
                <span className="font-semibold text-slate-900 dark:text-white">In 4,200 km</span>
              </div>
            </div>

            <button
              onClick={() => {
                showToast('success', 'Logged', `Service log updated for ${maintenanceModalVehicle.id}.`);
                setMaintenanceModalVehicle(null);
              }}
              className="w-full py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition"
            >
              Log Regular Inspection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
