import React, { useState, useEffect, useRef } from 'react';
import { 
  Map, 
  AdvancedMarker, 
  Pin, 
  useMap 
} from '@vis.gl/react-google-maps';
import { 
  Truck, 
  MapPin, 
  Building2, 
  Home, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Navigation, 
  Star, 
  Play, 
  Pause, 
  RotateCcw,
  Zap,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useGoogleMaps } from './GoogleMapsContext';
import { useToast } from '../common/Toast';

export interface TrackingStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'warehouse' | 'hub' | 'customer';
  address: string;
  eta?: string;
  status: 'completed' | 'current' | 'upcoming';
}

// Child component that safely calls useMap() only inside <Map>
const GoogleMapTrackingPolyline: React.FC<{ path: { lat: number; lng: number }[] }> = ({ path }) => {
  const map = useMap();
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map || !window.google?.maps) return;

    if (!polylineRef.current) {
      polylineRef.current = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: '#2563eb',
        strokeOpacity: 0.9,
        strokeWeight: 5,
      });
      polylineRef.current.setMap(map);
    } else {
      polylineRef.current.setPath(path);
    }

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
    };
  }, [map, path]);

  return null;
};

interface GoogleOrderTrackingMapProps {
  trackingNumber: string;
  customerName?: string;
  customerAddress?: string;
  destinationCoords?: { lat: number; lng: number };
  courierName?: string;
  courierPhone?: string;
  vehicleModel?: string;
  vehiclePlate?: string;
  otp?: string;
  priority?: 'critical' | 'high' | 'standard' | 'low';
}

export const GoogleOrderTrackingMap: React.FC<GoogleOrderTrackingMapProps> = ({
  trackingNumber,
  customerName = 'Yash Pandey',
  customerAddress = 'Tonk Road, Sector 4, Jaipur',
  destinationCoords = { lat: 26.8732, lng: 75.7972 },
  courierName = 'Rahul Kumar',
  courierPhone = '+91 98290 14820',
  vehicleModel = 'Tata Ace EV (RJ-14-AB-1024)',
  vehiclePlate = 'RJ-14-AB-1024',
  otp = '4821',
  priority = 'high'
}) => {
  const { hasValidKey } = useGoogleMaps();
  const { showToast } = useToast();

  // Route Waypoints across Jaipur
  const stops: TrackingStop[] = [
    {
      id: 'stop-wh',
      name: 'Jaipur Central Fulfillment Hub',
      lat: 26.8524,
      lng: 75.7685,
      type: 'warehouse',
      address: 'Plot 42, RIICO Industrial Area, Mansarovar',
      status: 'completed'
    },
    {
      id: 'stop-hub',
      name: 'C-Scheme Intermediate Hub',
      lat: 26.9124,
      lng: 75.8015,
      type: 'hub',
      address: 'Statue Circle, Ashok Marg, C-Scheme',
      status: 'completed'
    },
    {
      id: 'stop-dest',
      name: `${customerName}'s Doorstep`,
      lat: destinationCoords.lat,
      lng: destinationCoords.lng,
      type: 'customer',
      address: customerAddress,
      eta: '18 min',
      status: 'upcoming'
    }
  ];

  // Discrete route path interpolation
  const fullPath = [
    { lat: 26.8524, lng: 75.7685 }, // Warehouse
    { lat: 26.8627, lng: 75.7610 }, // Mansarovar
    { lat: 26.8850, lng: 75.7720 }, // Elevated road
    { lat: 26.9012, lng: 75.7766 }, // Sodala
    { lat: 26.9124, lng: 75.8015 }, // C-Scheme Hub
    { lat: 26.9010, lng: 75.8090 }, // Tonk Road Jn
    { lat: 26.8851, lng: 75.8118 }, // Current driver position
    { lat: 26.8790, lng: 75.8040 },
    { lat: destinationCoords.lat, lng: destinationCoords.lng } // Destination
  ];

  // Live Driver Movement State
  const [currentPathIndex, setCurrentPathIndex] = useState(6); // starts near driver
  const [isPlaying, setIsPlaying] = useState(true);
  const [distanceRemainingKm, setDistanceRemainingKm] = useState(2.4);
  const [etaMinutes, setEtaMinutes] = useState(12);
  const [callingDriver, setCallingDriver] = useState(false);

  const driverPosition = fullPath[currentPathIndex] || fullPath[6];

  // Simulation loop for driver vehicle movement
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentPathIndex((prev) => {
        const next = prev + 1;
        if (next < fullPath.length) {
          const remainingSegments = fullPath.length - 1 - next;
          setDistanceRemainingKm(Math.max(0.4, Number((remainingSegments * 1.2).toFixed(1))));
          setEtaMinutes(Math.max(2, remainingSegments * 4));
          return next;
        } else {
          return prev;
        }
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isPlaying, fullPath.length]);

  // Handle completion when arriving at final stop
  useEffect(() => {
    if (isPlaying && currentPathIndex >= fullPath.length - 1) {
      setIsPlaying(false);
      setDistanceRemainingKm(0.0);
      setEtaMinutes(0);
      showToast('success', 'Driver Arrived!', `Rahul Kumar is at ${customerAddress}. Present OTP ${otp} to accept.`);
    }
  }, [currentPathIndex, fullPath.length, isPlaying, customerAddress, otp, showToast]);

  const handleResetSimulation = () => {
    setCurrentPathIndex(0);
    setDistanceRemainingKm(8.6);
    setEtaMinutes(26);
    setIsPlaying(true);
  };

  const handleCallDriver = () => {
    setCallingDriver(true);
    setTimeout(() => {
      setCallingDriver(false);
      showToast('info', 'Calling Courier', `Connecting secure masked call to ${courierName} (${courierPhone})...`);
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top Tracking Status Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Status
            </div>
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              <span>{distanceRemainingKm === 0 ? 'Driver at Doorstep' : 'Out for Delivery'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Distance Away
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              {distanceRemainingKm.toFixed(1)} km remaining
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Estimated Arrival
            </div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {etaMinutes === 0 ? 'Arrived Now' : `In ~${etaMinutes} mins`}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-amber-50/70 dark:bg-amber-950/30 px-3 py-2 rounded-xl border border-amber-200 dark:border-amber-800/60">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 font-mono font-bold text-xs">
            OTP
          </div>
          <div>
            <div className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 uppercase">
              Delivery Security PIN
            </div>
            <div className="text-sm font-extrabold tracking-widest text-slate-900 dark:text-white font-mono">
              {otp}
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Map Canvas */}
      <div className="w-full h-[420px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative bg-slate-950 shadow-md">
        {/* Map Header Overlay Controls */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-white text-xs font-semibold flex items-center gap-2 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Radar • {trackingNumber}</span>
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-800 backdrop-blur shadow-md transition"
            title={isPlaying ? 'Pause Simulation' : 'Resume Simulation'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={handleResetSimulation}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-800 backdrop-blur shadow-md transition"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {hasValidKey ? (
          <Map
            defaultCenter={{ lat: 26.885, lng: 75.79 }}
            defaultZoom={13}
            mapId="DEMO_MAP_ID"
            className="w-full h-full"
            gestureHandling="greedy"
            disableDefaultUI={false}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          >
            {/* Real-time Dynamic Polyline */}
            <GoogleMapTrackingPolyline path={fullPath} />

            {/* 1. Origin Warehouse Marker */}
            <AdvancedMarker position={{ lat: 26.8524, lng: 75.7685 }} title="Jaipur Fulfillment Hub">
              <div className="flex flex-col items-center">
                <div className="px-2 py-0.5 rounded bg-slate-900 text-[10px] font-bold text-white shadow border border-slate-700 whitespace-nowrap mb-1">
                  Warehouse
                </div>
                <Pin background="#1e293b" borderColor="#0f172a" glyphColor="#38bdf8" />
              </div>
            </AdvancedMarker>

            {/* 2. Intermediate Hub Marker */}
            <AdvancedMarker position={{ lat: 26.9124, lng: 75.8015 }} title="C-Scheme Intermediate Hub">
              <div className="flex flex-col items-center">
                <div className="px-2 py-0.5 rounded bg-slate-900 text-[10px] font-bold text-white shadow border border-slate-700 whitespace-nowrap mb-1">
                  C-Scheme Hub
                </div>
                <Pin background="#4f46e5" borderColor="#3730a3" glyphColor="#ffffff" />
              </div>
            </AdvancedMarker>

            {/* 3. Real-time Driver Vehicle Marker */}
            <AdvancedMarker position={driverPosition} title={`${courierName} (${vehiclePlate})`}>
              <div className="relative flex items-center justify-center">
                <div className="absolute w-12 h-12 rounded-full bg-blue-500/30 animate-ping" />
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-blue-500/40">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="absolute -bottom-5 px-2 py-0.5 rounded bg-blue-900/90 backdrop-blur text-[10px] font-bold text-white shadow border border-blue-700 whitespace-nowrap">
                  {courierName} ({distanceRemainingKm.toFixed(1)} km)
                </div>
              </div>
            </AdvancedMarker>

            {/* 4. Customer Doorstep Marker */}
            <AdvancedMarker position={destinationCoords} title={`${customerName}'s Doorstep`}>
              <div className="flex flex-col items-center">
                <div className="px-2 py-0.5 rounded bg-emerald-600 text-[10px] font-bold text-white shadow border border-emerald-500 whitespace-nowrap mb-1">
                  Destination
                </div>
                <Pin background="#059669" borderColor="#047857" glyphColor="#ffffff" scale={1.2} />
              </div>
            </AdvancedMarker>
          </Map>
        ) : (
          /* Interactive Fallback Map with Vector Polyline */
          <div className="w-full h-full bg-slate-950 relative flex flex-col justify-between p-4 overflow-hidden select-none">
            {/* Vector Map Background Grid */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 420" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" />
                </pattern>
                <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>

              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Jaipur Route Path Polyline */}
              <polyline
                points="120,330 230,290 350,220 460,140 580,180 680,260"
                fill="none"
                stroke="url(#routeGrad)"
                strokeWidth="5"
                strokeDasharray="8,4"
                strokeLinecap="round"
              />

              {/* Static Stop 1: Warehouse */}
              <circle cx="120" cy="330" r="10" fill="#1e293b" stroke="#38bdf8" strokeWidth="3" />
              <text x="120" y="360" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">Jaipur WH (Origin)</text>

              {/* Static Stop 2: C-Scheme Hub */}
              <circle cx="350" cy="220" r="10" fill="#312e81" stroke="#818cf8" strokeWidth="3" />
              <text x="350" y="250" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">C-Scheme Hub</text>

              {/* Static Stop 3: Customer Doorstep */}
              <circle cx="680" cy="260" r="12" fill="#065f46" stroke="#34d399" strokeWidth="4" />
              <text x="680" y="295" fill="#34d399" fontSize="12" textAnchor="middle" fontWeight="bold">Doorstep ({customerName})</text>
            </svg>

            {/* Dynamic Animated Truck Icon moving along path */}
            <div 
              className="absolute z-10 transition-all duration-1000 ease-in-out flex flex-col items-center"
              style={{
                left: `${15 + (currentPathIndex / (fullPath.length - 1)) * 68}%`,
                top: `${40 + Math.sin(currentPathIndex * 0.8) * 15}%`,
              }}
            >
              <div className="relative">
                <div className="absolute -inset-2 rounded-full bg-blue-500/30 animate-ping" />
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl border-2 border-white ring-2 ring-blue-500/50">
                  <Truck className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-1 px-2.5 py-0.5 rounded-full bg-blue-950/90 border border-blue-700 text-white text-[10px] font-bold shadow whitespace-nowrap">
                {courierName} • {distanceRemainingKm.toFixed(1)} km away
              </div>
            </div>

            <div className="absolute bottom-3 left-3 z-10 bg-slate-900/90 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300 text-xs flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Smart GPS Dispatch • Jaipur Corridor Route (RJ-14)</span>
            </div>
          </div>
        )}

        {/* Live Traffic Badge */}
        <div className="absolute top-4 right-4 z-10 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-white text-xs flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[11px] font-medium text-slate-300">Corridor Traffic: Smooth</span>
        </div>
      </div>

      {/* Driver Card & Contact Panel */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-md">
              {courierName.charAt(0)}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full border-2 border-white dark:border-slate-900">
              <ShieldCheck className="w-3 h-3" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {courierName}
              </h4>
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                4.9
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                Express Driver
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {vehicleModel} • Fully Insured & Verified
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleCallDriver}
            disabled={callingDriver}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition"
          >
            <Phone className={`w-3.5 h-3.5 ${callingDriver ? 'animate-bounce' : ''}`} />
            <span>{callingDriver ? 'Connecting...' : 'Call Driver'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              showToast('info', 'Delivery Instructions', 'Driver notified: Leave package at front door if unavailable.');
            }}
            className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
          >
            Gate Note
          </button>
        </div>
      </div>
    </div>
  );
};
