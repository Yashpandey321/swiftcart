import React, { useState } from 'react';
import { 
  Map, 
  AdvancedMarker, 
  Pin, 
  InfoWindow 
} from '@vis.gl/react-google-maps';
import { 
  Truck, 
  Building2, 
  MapPin, 
  Battery, 
  Gauge, 
  User, 
  Package, 
  Navigation, 
  Compass,
  Zap,
  Filter,
  Layers
} from 'lucide-react';
import { useGoogleMaps } from './GoogleMapsContext';
import { DeliveryLocation, Vehicle, Shipment } from '../../types';

interface GoogleLiveNetworkMapProps {
  locations: DeliveryLocation[];
  vehicles: Vehicle[];
  shipments?: Shipment[];
  height?: string;
}

export const GoogleLiveNetworkMap: React.FC<GoogleLiveNetworkMapProps> = ({
  locations,
  vehicles,
  shipments = [],
  height = '520px'
}) => {
  const { hasValidKey } = useGoogleMaps();

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<DeliveryLocation | null>(null);
  const [vehicleFilter, setVehicleFilter] = useState<'all' | 'on_route' | 'available' | 'electric'>('all');

  const filteredVehicles = vehicles.filter(v => {
    if (vehicleFilter === 'on_route') return v.status === 'on_route';
    if (vehicleFilter === 'available') return v.status === 'available';
    if (vehicleFilter === 'electric') return v.fuelType === 'electric';
    return true;
  });

  return (
    <div className="space-y-3">
      {/* Map Filter & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-white text-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-bold">Jaipur Fleet & Hub Network</span>
          <span className="text-slate-400 text-[11px] hidden sm:inline">
            ({filteredVehicles.length} active vehicles • {locations.length} fulfillment hubs)
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {[
            { id: 'all', label: 'All Fleet' },
            { id: 'on_route', label: 'On Route' },
            { id: 'available', label: 'Available' },
            { id: 'electric', label: 'EVs Only' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setVehicleFilter(f.id as any)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                vehicleFilter === f.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div 
        className="w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative bg-slate-950 shadow-md"
        style={{ height }}
      >
        {hasValidKey ? (
          <Map
            defaultCenter={{ lat: 26.885, lng: 75.795 }}
            defaultZoom={12}
            mapId="DEMO_MAP_ID"
            className="w-full h-full"
            gestureHandling="greedy"
            disableDefaultUI={false}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          >
            {/* 1. Fulfillment Hubs & Warehouses */}
            {locations.map((loc) => {
              const isWarehouse = loc.type === 'warehouse';
              const lat = loc.lat || 26.8524;
              const lng = loc.lng || 75.7685;

              return (
                <AdvancedMarker
                  key={loc.id}
                  position={{ lat, lng }}
                  onClick={() => setSelectedLocation(loc)}
                  title={loc.name}
                >
                  <div className="flex flex-col items-center cursor-pointer group">
                    <div className="px-2 py-0.5 rounded bg-slate-900/90 text-[10px] font-bold text-white shadow border border-slate-700 whitespace-nowrap mb-1 opacity-85 group-hover:opacity-100">
                      {loc.name}
                    </div>
                    <Pin
                      background={isWarehouse ? '#0f172a' : '#312e81'}
                      borderColor={isWarehouse ? '#38bdf8' : '#818cf8'}
                      glyphColor="#ffffff"
                      scale={isWarehouse ? 1.2 : 1.0}
                    />
                  </div>
                </AdvancedMarker>
              );
            })}

            {/* 2. Vehicles on Route */}
            {filteredVehicles.map((veh) => {
              const lat = veh.lat || veh.currentLatitude || 26.87;
              const lng = veh.lng || veh.currentLongitude || 75.79;
              const isOnRoute = veh.status === 'on_route';

              return (
                <AdvancedMarker
                  key={veh.id}
                  position={{ lat, lng }}
                  onClick={() => setSelectedVehicle(veh)}
                  title={`${veh.code} - ${veh.driverName}`}
                >
                  <div className="relative flex items-center justify-center cursor-pointer group">
                    {isOnRoute && (
                      <div className="absolute w-10 h-10 rounded-full bg-blue-500/30 animate-ping" />
                    )}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white ${
                      isOnRoute ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-200'
                    }`}>
                      <Truck className="w-4 h-4" />
                    </div>
                    <div className="absolute -bottom-4 px-1.5 py-0.5 rounded bg-slate-900/90 text-[9px] font-bold text-white shadow border border-slate-700 whitespace-nowrap">
                      {veh.code}
                    </div>
                  </div>
                </AdvancedMarker>
              );
            })}

            {/* Vehicle Info Window */}
            {selectedVehicle && (
              <InfoWindow
                position={{
                  lat: selectedVehicle.lat || selectedVehicle.currentLatitude || 26.87,
                  lng: selectedVehicle.lng || selectedVehicle.currentLongitude || 75.79
                }}
                onCloseClick={() => setSelectedVehicle(null)}
              >
                <div className="p-2 text-slate-900 text-xs min-w-[220px] space-y-2">
                  <div className="flex items-center justify-between border-b pb-1.5">
                    <div>
                      <div className="font-extrabold text-sm text-blue-700">
                        {selectedVehicle.code} • {selectedVehicle.name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {selectedVehicle.plateNumber || 'RJ-14-EA-2041'}
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      selectedVehicle.status === 'on_route'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      {selectedVehicle.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">Driver</span>
                      <span className="font-bold">{selectedVehicle.driverName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Current Location</span>
                      <span className="font-semibold truncate">{selectedVehicle.currentLocationName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Battery / Fuel</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {selectedVehicle.fuelLevelPercent}%
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Avg Speed</span>
                      <span className="font-bold">{selectedVehicle.averageSpeedKmH} km/h</span>
                    </div>
                  </div>

                  <div className="pt-1.5 border-t text-[11px] text-slate-600">
                    Active Shipments: <strong>{selectedVehicle.assignedShipmentIds.length} packages</strong>
                  </div>
                </div>
              </InfoWindow>
            )}

            {/* Location Info Window */}
            {selectedLocation && (
              <InfoWindow
                position={{
                  lat: selectedLocation.lat || 26.8524,
                  lng: selectedLocation.lng || 75.7685
                }}
                onCloseClick={() => setSelectedLocation(null)}
              >
                <div className="p-2 text-slate-900 text-xs min-w-[200px] space-y-1.5">
                  <div className="font-bold text-sm text-slate-900">
                    {selectedLocation.name}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {selectedLocation.address}
                  </div>
                  <div className="pt-1 border-t flex justify-between text-[11px]">
                    <span className="text-slate-500">Manager:</span>
                    <span className="font-medium">{selectedLocation.managerName}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Active Shipments:</span>
                    <span className="font-bold text-blue-600">{selectedLocation.activeShipmentsCount} pkgs</span>
                  </div>
                </div>
              </InfoWindow>
            )}
          </Map>
        ) : (
          /* Interactive Fallback Map with Vector Grid & Clickable Fleet */
          <div className="w-full h-full bg-slate-950 relative flex flex-col justify-between p-4 overflow-hidden select-none">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 900 520" preserveAspectRatio="none">
              <defs>
                <pattern id="fleet-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#fleet-grid)" />

              {/* Connected Hub Network Roads */}
              <path
                d="M 280,380 L 450,180 L 520,390 L 260,340 L 200,200 L 450,180 M 280,380 L 260,340 M 520,390 L 650,480 M 450,180 L 560,240"
                fill="none"
                stroke="#1e293b"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Hub Nodes */}
              {locations.slice(0, 8).map((loc) => (
                <g key={loc.id} className="cursor-pointer" onClick={() => setSelectedLocation(loc)}>
                  <circle cx={loc.x || 300} cy={loc.y || 200} r="9" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
                  <text x={loc.x || 300} y={(loc.y || 200) + 20} fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">
                    {loc.name.split(' ')[0]}
                  </text>
                </g>
              ))}

              {/* Active Vehicles */}
              {filteredVehicles.slice(0, 6).map((veh, idx) => {
                const cx = 200 + idx * 110 + (idx % 2 === 0 ? 30 : -20);
                const cy = 180 + (idx % 3) * 90;
                const isOnRoute = veh.status === 'on_route';

                return (
                  <g key={veh.id} className="cursor-pointer" onClick={() => setSelectedVehicle(veh)}>
                    {isOnRoute && (
                      <circle cx={cx} cy={cy} r="18" fill="#3b82f6" opacity="0.2" className="animate-ping" />
                    )}
                    <circle cx={cx} cy={cy} r="13" fill={isOnRoute ? "#2563eb" : "#475569"} stroke="#ffffff" strokeWidth="2" />
                    <text x={cx} y={cy + 4} fill="#ffffff" fontSize="9" textAnchor="middle" fontWeight="bold">
                      {veh.code.replace('V-', '')}
                    </text>
                    <text x={cx} y={cy + 25} fill="#60a5fa" fontSize="10" textAnchor="middle" fontWeight="bold">
                      {veh.code}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Interactive Selected Vehicle Card Modal */}
            {selectedVehicle && (
              <div className="absolute top-16 right-4 z-20 w-72 bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700 p-4 shadow-2xl text-white text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="font-bold text-sm text-blue-400 flex items-center gap-1.5">
                    <Truck className="w-4 h-4" />
                    <span>{selectedVehicle.code}</span>
                  </div>
                  <button onClick={() => setSelectedVehicle(null)} className="text-slate-400 hover:text-white">✕</button>
                </div>
                <div className="space-y-1 text-slate-300">
                  <div className="text-xs font-semibold">{selectedVehicle.name} ({selectedVehicle.plateNumber || 'RJ-14'})</div>
                  <div className="text-[11px] text-slate-400">Driver: <strong>{selectedVehicle.driverName}</strong></div>
                  <div className="text-[11px] text-slate-400">Station: {selectedVehicle.currentLocationName}</div>
                  <div className="text-[11px] text-emerald-400">Battery: {selectedVehicle.fuelLevelPercent}% • Avg {selectedVehicle.averageSpeedKmH} km/h</div>
                </div>
              </div>
            )}

            <div className="absolute bottom-3 left-3 z-10 bg-slate-900/90 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300 text-xs flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Jaipur Logistics Metro Fleet • Live GPS Active</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
