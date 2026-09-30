import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  X, 
  Package, 
  MapPin, 
  Truck, 
  Navigation, 
  BarChart3, 
  Users, 
  Settings, 
  ArrowRight,
  Route
} from 'lucide-react';
import { NavTab, Shipment, DeliveryLocation, Vehicle, Driver } from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: NavTab) => void;
  shipments: Shipment[];
  locations: DeliveryLocation[];
  vehicles: Vehicle[];
  drivers: Driver[];
  onSelectShipment?: (shipment: Shipment) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  shipments,
  locations,
  vehicles,
  drivers,
  onSelectShipment,
}) => {
  const [query, setQuery] = useState('');

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter items based on query
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const navigationPages = [
      { tab: 'dashboard' as NavTab, label: 'Operations Dashboard', desc: 'Live fleet telemetry, KPIs, and maps' },
      { tab: 'shipments' as NavTab, label: 'Shipment Directory', desc: 'Manage courier orders and manifests' },
      { tab: 'tracking' as NavTab, label: 'Live GPS Tracking', desc: 'Real-time active vehicle monitoring' },
      { tab: 'route-optimizer' as NavTab, label: 'Route Optimizer', desc: 'Autonomous multi-stop sequence planning' },
      { tab: 'fleet' as NavTab, label: 'Fleet Management', desc: 'Vehicle loads, fuel reserves, and health' },
      { tab: 'drivers' as NavTab, label: 'Driver Personnel', desc: 'Couriers, on-time rates, and performance' },
      { tab: 'locations' as NavTab, label: 'Logistics Facilities', desc: 'Hubs, warehouses, and corridors' },
      { tab: 'customers' as NavTab, label: 'Customer Accounts', desc: 'Shipper profiles and order histories' },
      { tab: 'analytics' as NavTab, label: 'Analytics & Reports', desc: 'SLA metrics, throughput, and costs' },
      { tab: 'settings' as NavTab, label: 'Settings', desc: 'Dispatch rules and notification parameters' },
    ];

    if (!q) {
      return {
        shipments: shipments.slice(0, 4),
        locations: locations.slice(0, 3),
        vehicles: vehicles.slice(0, 3),
        pages: navigationPages.slice(0, 4),
      };
    }

    return {
      shipments: shipments.filter(
        s =>
          s.id.toLowerCase().includes(q) ||
          (s.trackingCode && s.trackingCode.toLowerCase().includes(q)) ||
          s.customerName.toLowerCase().includes(q) ||
          s.deliveryAddress.toLowerCase().includes(q)
      ).slice(0, 5),
      locations: locations.filter(
        l =>
          l.name.toLowerCase().includes(q) ||
          l.code.toLowerCase().includes(q) ||
          l.address.toLowerCase().includes(q)
      ).slice(0, 4),
      vehicles: vehicles.filter(
        v =>
          v.id.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.plateNumber.toLowerCase().includes(q)
      ).slice(0, 4),
      pages: navigationPages.filter(
        p => p.label.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
      ),
    };
  }, [query, shipments, locations, vehicles]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in-50 duration-150">
      <div 
        onClick={onClose}
        className="fixed inset-0" 
      />

      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-800/30">
          <Search className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tracking code, customer, driver, facility, or page..."
            className="w-full bg-transparent border-none text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5 text-xs">
          {/* Quick Pages */}
          {filtered.pages.length > 0 && (
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 px-2 block mb-1 tracking-wider">
                Quick Navigation
              </span>
              <div className="space-y-1">
                {filtered.pages.map(p => (
                  <button
                    key={p.tab}
                    onClick={() => {
                      onSelectTab(p.tab);
                      onClose();
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between text-left transition group"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {p.label}
                      </div>
                      <div className="text-[11px] text-slate-400">{p.desc}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Shipments */}
          {filtered.shipments.length > 0 && (
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 px-2 block mb-1 tracking-wider">
                Shipments & Parcels
              </span>
              <div className="space-y-1">
                {filtered.shipments.map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      if (onSelectShipment) onSelectShipment(s);
                      onClose();
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between text-left transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-mono font-bold text-slate-900 dark:text-white">
                          {s.trackingCode || s.id}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {s.customerName} • {s.deliveryAddress}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize">
                      {s.status.replace('_', ' ')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Locations */}
          {filtered.locations.length > 0 && (
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 px-2 block mb-1 tracking-wider">
                Facilities & Hubs
              </span>
              <div className="space-y-1">
                {filtered.locations.map(l => (
                  <button
                    key={l.id}
                    onClick={() => {
                      onSelectTab('locations');
                      onClose();
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between text-left transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{l.name}</div>
                        <div className="text-[11px] text-slate-400">{l.address}</div>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-slate-400">{l.code}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between text-[11px] text-slate-400">
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">ESC</kbd> to exit</span>
          <span>SwiftRoute Global Index</span>
        </div>
      </div>
    </div>
  );
};
