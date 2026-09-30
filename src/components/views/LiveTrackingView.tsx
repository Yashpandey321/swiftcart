import React, { useState, useMemo } from 'react';
import { 
  Navigation, 
  Search, 
  Phone, 
  Clock, 
  Truck, 
  MapPin, 
  Filter, 
  ChevronRight, 
  Crosshair, 
  ShieldCheck, 
  AlertTriangle,
  Zap,
  Flame,
  CheckCircle2,
  Maximize2
} from 'lucide-react';
import { 
  Shipment, 
  Vehicle, 
  Driver, 
  DeliveryLocation, 
  Road, 
  PriorityLevel 
} from '../../types';
import { StatusBadge, PriorityBadge } from '../common/Badges';
import { LiveDeliveryMap } from '../common/LiveDeliveryMap';
import { useToast } from '../common/Toast';

interface LiveTrackingViewProps {
  shipments: Shipment[];
  vehicles: Vehicle[];
  drivers: Driver[];
  locations: DeliveryLocation[];
  roads: Road[];
  onSelectShipment: (shipment: Shipment) => void;
}

export const LiveTrackingView: React.FC<LiveTrackingViewProps> = ({
  shipments,
  vehicles,
  drivers,
  locations,
  roads,
  onSelectShipment,
}) => {
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'urgent' | 'express'>('all');
  const [selectedShipmentId, setSelectedShipmentId] = useState<string>(
    shipments.find(s => s.status === 'in_transit' || s.status === 'out_for_delivery')?.id || shipments[0]?.id || ''
  );

  // Active in-transit or dispatched shipments
  const activeDeliveries = useMemo(() => {
    return shipments.filter(s => {
      const isActiveStatus = s.status === 'in_transit' || s.status === 'out_for_delivery' || s.status === 'assigned' || s.status === 'picked_up';
      if (!isActiveStatus) return false;

      if (priorityFilter !== 'all' && s.priority !== priorityFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          s.id.toLowerCase().includes(q) ||
          (s.trackingNumber && s.trackingNumber.toLowerCase().includes(q)) ||
          s.customerName.toLowerCase().includes(q) ||
          s.deliveryAddress.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [shipments, priorityFilter, searchQuery]);

  const selectedShipment = shipments.find(s => s.id === selectedShipmentId) || activeDeliveries[0] || shipments[0];
  const driver = drivers.find(d => d.id === selectedShipment?.driverId);
  const vehicle = vehicles.find(v => v.id === selectedShipment?.vehicleId);
  const destLoc = locations.find(l => l.id === selectedShipment?.destinationLocationId);

  const handleCallDriver = () => {
    if (driver?.phone) {
      showToast('info', `Calling ${driver.name}`, `Initiating dispatch call to ${driver.phone}...`);
    } else {
      showToast('error', 'No Phone Record', 'Driver contact phone not found.');
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-200">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Live Delivery Tracking</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time GPS telemetry, active corridor navigation, and in-transit fleet status
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold flex items-center gap-2">
            <Truck className="w-4 h-4" />
            <span>{activeDeliveries.length} Active In Transit</span>
          </div>
        </div>
      </div>

      {/* 2. Main Tracking Split Screen (Left: Active List, Right: Map & Telemetry) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[580px]">
        {/* Left Panel: Active Deliveries List (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-white">Active Deliveries</span>
              <span className="text-xs text-slate-400 font-semibold">{activeDeliveries.length} units</span>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search active shipment..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPriorityFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  priorityFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setPriorityFilter('urgent')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                  priorityFilter === 'urgent'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Flame className="w-3 h-3" />
                Urgent
              </button>
              <button
                onClick={() => setPriorityFilter('express')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                  priorityFilter === 'express'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Zap className="w-3 h-3" />
                Express
              </button>
            </div>
          </div>

          {/* List scroll */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 overflow-y-auto flex-1 max-h-[500px]">
            {activeDeliveries.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No active deliveries currently in transit.
              </div>
            ) : (
              activeDeliveries.map(s => {
                const isSelected = selectedShipment?.id === s.id;
                const sDriver = drivers.find(d => d.id === s.driverId);
                const sDest = locations.find(l => l.id === s.destinationLocationId);

                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedShipmentId(s.id)}
                    className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition ${
                      isSelected ? 'bg-blue-50/70 dark:bg-blue-950/30 border-l-4 border-blue-600' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400">
                        {s.trackingNumber || s.id}
                      </span>
                      <PriorityBadge priority={s.priority} />
                    </div>

                    <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {s.customerName}
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{sDest?.name || s.deliveryAddress}</span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/50 text-[11px]">
                      <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                        <Truck className="w-3 h-3 text-slate-400" />
                        <span>{sDriver?.name || 'Assigned'}</span>
                      </div>
                      <div className="font-medium text-emerald-600 dark:text-emerald-400">
                        {s.estimatedDeliveryTime || '35 min'}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Panel: Interactive Map + Live Telemetry (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Active Shipment Telemetry Bar */}
          {selectedShipment && (
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20">
                  <Navigation className="w-5 h-5 -rotate-45" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                      {selectedShipment.trackingNumber || selectedShipment.id}
                    </span>
                    <StatusBadge status={selectedShipment.status} />
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Destination: <span className="font-medium text-slate-700 dark:text-slate-300">{destLoc?.name || selectedShipment.deliveryAddress}</span>
                  </div>
                </div>
              </div>

              {/* Telemetry Stats: Remaining Dist, Time, Speed */}
              <div className="flex items-center gap-5 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Remaining</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">12.4 km</span>
                </div>
                <div className="h-6 w-px bg-slate-200 dark:border-slate-800" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">ETA</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedShipment.estimatedDeliveryTime || '28 mins'}
                  </span>
                </div>
                <div className="h-6 w-px bg-slate-200 dark:border-slate-800" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Live Speed</span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">48 km/h</span>
                </div>

                <button
                  onClick={handleCallDriver}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold transition"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span>Call Driver</span>
                </button>
              </div>
            </div>
          )}

          {/* Map canvas */}
          <div className="flex-1 min-h-[460px] rounded-2xl overflow-hidden shadow-xs border border-slate-200 dark:border-slate-800">
            <LiveDeliveryMap
              locations={locations}
              roads={roads}
              vehicles={vehicles}
              drivers={drivers}
              selectedVehicleId={vehicle?.id}
              height="500px"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
