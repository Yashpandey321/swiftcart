import React, { useState, useEffect, useRef } from 'react';
import { 
  Map, 
  AdvancedMarker, 
  Pin, 
  useMap 
} from '@vis.gl/react-google-maps';
import { 
  Route as RouteIcon, 
  TrendingDown, 
  Clock, 
  Fuel, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Layers,
  MapPin,
  Building2
} from 'lucide-react';
import { useGoogleMaps } from './GoogleMapsContext';
import { DeliveryLocation, Shipment } from '../../types';

export interface RouteStopPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  stopNumber?: number;
  isOrigin?: boolean;
  packageCode?: string;
  eta?: string;
  address?: string;
}

interface GoogleSmartRouteOptimizerMapProps {
  startLocation: { name: string; lat: number; lng: number };
  stops: RouteStopPoint[];
  originalDistanceKm?: number;
  optimizedDistanceKm?: number;
  originalTimeMin?: number;
  optimizedTimeMin?: number;
  fuelEstimatedL?: number;
}

// Child component that safely calls useMap() only when rendered inside <Map>
const GoogleSmartRoutePolylines: React.FC<{
  optimizedCoords: google.maps.LatLngLiteral[];
  originalCoords: google.maps.LatLngLiteral[];
  viewMode: 'optimized' | 'original' | 'both';
}> = ({ optimizedCoords, originalCoords, viewMode }) => {
  const map = useMap();
  const polylineOptimizedRef = useRef<google.maps.Polyline | null>(null);
  const polylineOriginalRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map || !window.google?.maps) return;

    // Remove existing
    if (polylineOptimizedRef.current) polylineOptimizedRef.current.setMap(null);
    if (polylineOriginalRef.current) polylineOriginalRef.current.setMap(null);

    if (viewMode === 'optimized' || viewMode === 'both') {
      polylineOptimizedRef.current = new google.maps.Polyline({
        path: optimizedCoords,
        geodesic: true,
        strokeColor: '#2563eb',
        strokeOpacity: 0.9,
        strokeWeight: 5,
      });
      polylineOptimizedRef.current.setMap(map);
    }

    if (viewMode === 'original' || viewMode === 'both') {
      const lineSymbol = {
        path: 'M 0,-1 0,1',
        strokeOpacity: 0.8,
        scale: 3,
        strokeColor: '#ef4444',
      };
      polylineOriginalRef.current = new google.maps.Polyline({
        path: originalCoords,
        geodesic: true,
        strokeColor: '#ef4444',
        strokeOpacity: 0,
        strokeWeight: 3,
        icons: [{
          icon: lineSymbol,
          offset: '0',
          repeat: '16px',
        }],
      });
      polylineOriginalRef.current.setMap(map);
    }

    return () => {
      if (polylineOptimizedRef.current) {
        polylineOptimizedRef.current.setMap(null);
        polylineOptimizedRef.current = null;
      }
      if (polylineOriginalRef.current) {
        polylineOriginalRef.current.setMap(null);
        polylineOriginalRef.current = null;
      }
    };
  }, [map, viewMode, optimizedCoords, originalCoords]);

  return null;
};

export const GoogleSmartRouteOptimizerMap: React.FC<GoogleSmartRouteOptimizerMapProps> = ({
  startLocation = { name: 'Jaipur Central Warehouse', lat: 26.8524, lng: 75.7685 },
  stops = [
    { id: '1', name: 'Mansarovar Stop', lat: 26.8627, lng: 75.7610, stopNumber: 1, packageCode: 'PKG-JPR-01', eta: '10:15 AM', address: 'VT Road, Mansarovar' },
    { id: '2', name: 'Vaishali Nagar Stop', lat: 26.9066, lng: 75.7438, stopNumber: 2, packageCode: 'PKG-JPR-02', eta: '10:40 AM', address: 'Amrapali Circle, Vaishali Nagar' },
    { id: '3', name: 'C-Scheme Stop', lat: 26.9124, lng: 75.8015, stopNumber: 3, packageCode: 'PKG-JPR-03', eta: '11:05 AM', address: 'Statue Circle, C-Scheme' },
    { id: '4', name: 'Malviya Nagar Stop', lat: 26.8530, lng: 75.8052, stopNumber: 4, packageCode: 'PKG-JPR-04', eta: '11:35 AM', address: 'Gaurav Tower, Malviya Nagar' },
  ],
  originalDistanceKm = 33.1,
  optimizedDistanceKm = 24.7,
  originalTimeMin = 65,
  optimizedTimeMin = 48,
  fuelEstimatedL = 2.6
}) => {
  const { hasValidKey } = useGoogleMaps();
  const [viewMode, setViewMode] = useState<'optimized' | 'original' | 'both'>('optimized');

  // Build coordinate lists
  const optimizedCoords = [
    { lat: startLocation.lat, lng: startLocation.lng },
    ...stops.map(s => ({ lat: s.lat, lng: s.lng })),
    { lat: startLocation.lat, lng: startLocation.lng }
  ];

  // Unoptimized original route order (zig-zag)
  const originalCoords = [
    { lat: startLocation.lat, lng: startLocation.lng },
    stops[3] ? { lat: stops[3].lat, lng: stops[3].lng } : { lat: startLocation.lat, lng: startLocation.lng }, // Malviya Nagar first
    stops[1] ? { lat: stops[1].lat, lng: stops[1].lng } : { lat: startLocation.lat, lng: startLocation.lng }, // Vaishali Nagar second
    stops[0] ? { lat: stops[0].lat, lng: stops[0].lng } : { lat: startLocation.lat, lng: startLocation.lng }, // Mansarovar third
    stops[2] ? { lat: stops[2].lat, lng: stops[2].lng } : { lat: startLocation.lat, lng: startLocation.lng }, // C-Scheme fourth
    { lat: startLocation.lat, lng: startLocation.lng }
  ];

  const distanceSaved = Number((originalDistanceKm - optimizedDistanceKm).toFixed(1));
  const timeSaved = originalTimeMin - optimizedTimeMin;

  return (
    <div className="space-y-4">
      {/* Route Optimizer Performance Comparison Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-bold">
            <RouteIcon className="w-3.5 h-3.5 text-blue-500" />
            <span>Total Distance</span>
          </div>
          <div className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
            {optimizedDistanceKm} km
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
            ↓ {distanceSaved} km saved
          </div>
        </div>

        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-bold">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>Est. Time</span>
          </div>
          <div className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
            {optimizedTimeMin} min
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
            ↓ {timeSaved} min saved
          </div>
        </div>

        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-bold">
            <Fuel className="w-3.5 h-3.5 text-amber-500" />
            <span>Est. Fuel</span>
          </div>
          <div className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
            {fuelEstimatedL} L
          </div>
          <div className="text-[10px] text-slate-400 font-medium mt-0.5">
            ~0.10 L/km electric/hybrid
          </div>
        </div>

        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-bold">
            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
            <span>Delivery Stops</span>
          </div>
          <div className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
            {stops.length} Stops
          </div>
          <div className="text-[10px] text-slate-400 font-medium mt-0.5">
            {stops.length} Customer packages
          </div>
        </div>

        <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900 shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-[10px] uppercase font-bold">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Dijkstra TSP</span>
          </div>
          <div className="text-base font-extrabold text-blue-700 dark:text-blue-300 mt-1">
            96% Optimal
          </div>
          <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
            Path sequenced
          </div>
        </div>
      </div>

      {/* Map Display Card */}
      <div className="w-full h-[420px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative bg-slate-950 shadow-md">
        {/* Route Toggle Controls Overlay */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <div className="bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-white text-xs font-semibold flex items-center gap-2 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span>Google Maps Route</span>
          </div>

          <div className="flex bg-slate-900/90 backdrop-blur-md p-0.5 rounded-xl border border-slate-800 shadow-lg text-xs">
            <button
              onClick={() => setViewMode('optimized')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                viewMode === 'optimized'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Optimized ({optimizedDistanceKm} km)
            </button>
            <button
              onClick={() => setViewMode('original')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                viewMode === 'original'
                  ? 'bg-red-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Original ({originalDistanceKm} km)
            </button>
            <button
              onClick={() => setViewMode('both')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                viewMode === 'both'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Compare Both
            </button>
          </div>
        </div>

        {hasValidKey ? (
          <Map
            defaultCenter={{ lat: 26.885, lng: 75.78 }}
            defaultZoom={12}
            mapId="DEMO_MAP_ID"
            className="w-full h-full"
            gestureHandling="greedy"
            disableDefaultUI={false}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          >
            {/* Dynamic Road Polylines */}
            <GoogleSmartRoutePolylines
              optimizedCoords={optimizedCoords}
              originalCoords={originalCoords}
              viewMode={viewMode}
            />

            {/* Origin & Final Warehouse Marker */}
            <AdvancedMarker position={{ lat: startLocation.lat, lng: startLocation.lng }} title={startLocation.name}>
              <div className="flex flex-col items-center">
                <div className="px-2 py-0.5 rounded bg-slate-900 text-[10px] font-bold text-white shadow border border-slate-700 whitespace-nowrap mb-1">
                  Start/End: {startLocation.name}
                </div>
                <Pin background="#0f172a" borderColor="#334155" glyphColor="#38bdf8" scale={1.3} />
              </div>
            </AdvancedMarker>

            {/* Numbered Delivery Stop Markers (1, 2, 3, 4) */}
            {stops.map((stop, index) => (
              <AdvancedMarker
                key={stop.id}
                position={{ lat: stop.lat, lng: stop.lng }}
                title={`Stop ${index + 1}: ${stop.name}`}
              >
                <div className="flex flex-col items-center">
                  <div className="px-2 py-0.5 rounded bg-blue-900/90 text-[10px] font-bold text-white shadow border border-blue-700 whitespace-nowrap mb-1">
                    Stop {index + 1}: {stop.name}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-blue-500/40">
                    {index + 1}
                  </div>
                </div>
              </AdvancedMarker>
            ))}
          </Map>
        ) : (
          /* Interactive Fallback Map with Numbered Stops */
          <div className="w-full h-full bg-slate-950 relative flex flex-col justify-between p-4 overflow-hidden select-none">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 420" preserveAspectRatio="none">
              <defs>
                <pattern id="optimizer-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#optimizer-grid)" />

              {/* Unoptimized Path (Red / Dashed) */}
              {(viewMode === 'original' || viewMode === 'both') && (
                <polyline
                  points="140,280 620,180 280,120 220,320 440,160 140,280"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="3"
                  strokeDasharray="6,6"
                  strokeLinecap="round"
                  opacity="0.85"
                />
              )}

              {/* Optimized Path (Blue / Solid) */}
              {(viewMode === 'optimized' || viewMode === 'both') && (
                <polyline
                  points="140,280 220,320 280,120 440,160 620,180 140,280"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              )}

              {/* Origin Marker */}
              <circle cx="140" cy="280" r="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />
              <text x="140" y="284" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">WH</text>
              <text x="140" y="310" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle">Jaipur WH</text>

              {/* Stop 1: Mansarovar */}
              <circle cx="220" cy="320" r="13" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
              <text x="220" y="324" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">1</text>
              <text x="220" y="350" fill="#60a5fa" fontSize="11" fontWeight="bold" textAnchor="middle">1. Mansarovar</text>

              {/* Stop 2: Vaishali Nagar */}
              <circle cx="280" cy="120" r="13" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
              <text x="280" y="124" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">2</text>
              <text x="280" y="100" fill="#60a5fa" fontSize="11" fontWeight="bold" textAnchor="middle">2. Vaishali Nagar</text>

              {/* Stop 3: C-Scheme */}
              <circle cx="440" cy="160" r="13" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
              <text x="440" y="164" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">3</text>
              <text x="440" y="140" fill="#60a5fa" fontSize="11" fontWeight="bold" textAnchor="middle">3. C-Scheme</text>

              {/* Stop 4: Malviya Nagar */}
              <circle cx="620" cy="180" r="13" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
              <text x="620" y="184" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">4</text>
              <text x="620" y="210" fill="#60a5fa" fontSize="11" fontWeight="bold" textAnchor="middle">4. Malviya Nagar</text>
            </svg>

            <div className="absolute bottom-3 left-3 z-10 bg-slate-900/90 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300 text-xs flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Dijkstra Shortest Path Network • Sequence 1 → 2 → 3 → 4</span>
            </div>
          </div>
        )}

        {/* Legend Overlay in Bottom Right */}
        <div className="absolute bottom-3 right-3 z-10 bg-slate-950/85 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 text-slate-200 text-xs shadow-lg space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 bg-blue-500 rounded" />
            <span className="text-[11px]">Optimized Delivery Route (24.7 km)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 bg-red-500 rounded border-b border-dashed" />
            <span className="text-[11px] text-slate-400">Unoptimized Route (33.1 km)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
