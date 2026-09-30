import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Phone, 
  Star, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  X, 
  ShieldCheck, 
  Award,
  Send,
  MoreVertical,
  Activity
} from 'lucide-react';
import { Driver, Vehicle, Shipment } from '../../types';
import { DriverStatusBadge } from '../common/Badges';
import { useToast } from '../common/Toast';

interface DriversViewProps {
  drivers: Driver[];
  vehicles: Vehicle[];
  shipments: Shipment[];
  onNavigateToShipments?: () => void;
}

export const DriversView: React.FC<DriversViewProps> = ({
  drivers,
  vehicles,
  shipments,
  onNavigateToShipments,
}) => {
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const filteredDrivers = useMemo(() => {
    return drivers.filter(d => {
      if (statusFilter !== 'all' && d.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          d.name.toLowerCase().includes(q) ||
          d.phone.includes(q) ||
          (d.licenseNumber && d.licenseNumber.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [drivers, statusFilter, searchQuery]);

  const handleCallDriver = (driver: Driver, e: React.MouseEvent) => {
    e.stopPropagation();
    showToast('info', `Calling ${driver.name}`, `Dialing ${driver.phone}...`);
  };

  return (
    <div className="space-y-5 animate-in fade-in-50 duration-200">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Driver Personnel</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              {drivers.length} Certified Couriers
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage dispatch drivers, shifts, on-time performance metrics, and active routes
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-semibold">
            Avg Rating: 4.85 ★
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
            placeholder="Search driver by name, phone, or license..."
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
            <option value="break">On Break</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      {/* 3. Driver Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredDrivers.map(driver => {
          const vehicle = vehicles.find(v => v.id === driver.vehicleId);

          return (
            <div
              key={driver.id}
              onClick={() => setSelectedDriver(driver)}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-500/50 cursor-pointer transition"
            >
              <div>
                {/* Driver Top Info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-sm text-white shadow-sm ring-2 ring-blue-500/20">
                      {driver.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white">{driver.name}</div>
                      <div className="text-[11px] text-slate-400">{driver.phone}</div>
                    </div>
                  </div>
                  <DriverStatusBadge status={driver.status} />
                </div>

                {/* Assigned Vehicle */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Truck className="w-3.5 h-3.5 text-blue-500" />
                    <span>{vehicle ? `${vehicle.id} (${vehicle.model})` : 'No Assigned Vehicle'}</span>
                  </div>
                </div>

                {/* Today's Deliveries stats */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Deliveries</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {driver.completedDeliveriesCount} done • {driver.activeDeliveriesCount} left
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">On-Time Rate</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {driver.onTimeRatePercent}%
                    </span>
                  </div>
                </div>

                {/* Rating */}
                <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{driver.rating.toFixed(1)} / 5.0</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">License: {driver.licenseNumber}</span>
                </div>
              </div>

              {/* Card Actions */}
              <div className="pt-2 flex items-center gap-2" onClick={e => e.stopPropagation()}>
                <button
                  onClick={e => handleCallDriver(driver, e)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span>Call Driver</span>
                </button>
                <button
                  onClick={() => setSelectedDriver(driver)}
                  className="py-1.5 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-xs font-semibold transition"
                >
                  View Profile
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Driver Profile Drawer */}
      {selectedDriver && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-2xs animate-in fade-in-50 duration-150 flex justify-end">
          <div onClick={() => setSelectedDriver(null)} className="flex-1" />

          <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right-8 duration-200">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-lg text-white shadow-md">
                  {selectedDriver.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{selectedDriver.name}</h3>
                  <div className="text-xs text-slate-400">{selectedDriver.phone}</div>
                  <div className="mt-1">
                    <DriverStatusBadge status={selectedDriver.status} />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedDriver(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs text-slate-600 dark:text-slate-300">
              {/* Performance Stats Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Rating</span>
                  <div className="flex items-center gap-1 font-bold text-base text-amber-500 mt-0.5">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span>{selectedDriver.rating.toFixed(1)} / 5.0</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">On-Time Accuracy</span>
                  <div className="font-bold text-base text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {selectedDriver.onTimeRatePercent}%
                  </div>
                </div>
              </div>

              {/* Assigned Vehicle Details */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white">Assigned Fleet Vehicle</div>
                <div className="flex items-center justify-between">
                  <span>Model:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {vehicles.find(v => v.id === selectedDriver.vehicleId)?.model || 'Ford Transit Connect'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Unit ID:</span>
                  <span className="font-mono text-blue-600 dark:text-blue-400">{selectedDriver.vehicleId || 'V-102'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>License:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{selectedDriver.licenseNumber}</span>
                </div>
              </div>

              {/* Today's Active Route */}
              <div className="space-y-3">
                <div className="font-bold text-slate-900 dark:text-white">Today&apos;s Active Deliveries</div>
                <div className="space-y-2">
                  {shipments.filter(s => s.driverId === selectedDriver.id).slice(0, 4).map(s => (
                    <div
                      key={s.id}
                      className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-mono font-bold text-blue-600 dark:text-blue-400">{s.trackingNumber || s.id}</div>
                        <div className="text-[11px] text-slate-500">{s.customerName} • {s.deliveryAddress}</div>
                      </div>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {s.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-slate-50 dark:bg-slate-950/40">
              <button
                onClick={e => handleCallDriver(selectedDriver, e)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition"
              >
                <Phone className="w-4 h-4" />
                <span>Call Driver ({selectedDriver.phone})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
