import React, { useState, useRef, useMemo } from 'react';
import { 
  Plus, 
  Minus, 
  Maximize2, 
  Minimize2, 
  Crosshair, 
  Layers, 
  Warehouse, 
  MapPin, 
  Truck, 
  Activity, 
  Info,
  CheckCircle2,
  Navigation,
  Sparkles,
  Map as MapIcon
} from 'lucide-react';
import { DeliveryLocation, Road, Vehicle, Driver } from '../../types';
import { GoogleLiveNetworkMap } from '../maps/GoogleLiveNetworkMap';

interface LiveDeliveryMapProps {
  locations: DeliveryLocation[];
  roads: Road[];
  vehicles: Vehicle[];
  drivers?: Driver[];
  selectedVehicleId?: string | null;
  onSelectVehicle?: (vehicle: Vehicle) => void;
  selectedLocationId?: string | null;
  onSelectLocation?: (location: DeliveryLocation) => void;
  height?: string | number;
  interactive?: boolean;
}

export const LiveDeliveryMap: React.FC<LiveDeliveryMapProps> = ({
  locations,
  roads,
  vehicles,
  drivers = [],
  selectedVehicleId,
  onSelectVehicle,
  selectedLocationId,
  onSelectLocation,
  height = '480px',
  interactive = true,
}) => {
  const [mapEngine, setMapEngine] = useState<'google' | 'topology'>('google');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTraffic, setShowTraffic] = useState(true);
  const [showVehicles, setShowVehicles] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showLayersMenu, setShowLayersMenu] = useState(false);
  const [hoveredVehicle, setHoveredVehicle] = useState<Vehicle | null>(null);
  const [hoveredLocation, setHoveredLocation] = useState<DeliveryLocation | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Map coordinate bounds
  const bounds = useMemo(() => {
    if (locations.length === 0) return { minX: 0, maxX: 1000, minY: 0, maxY: 600 };
    const xs = locations.map(l => l.x);
    const ys = locations.map(l => l.y);
    return {
      minX: Math.min(...xs) - 60,
      maxX: Math.max(...xs) + 60,
      minY: Math.min(...ys) - 60,
      maxY: Math.max(...ys) + 60,
    };
  }, [locations]);

  const viewBoxWidth = Math.max(800, bounds.maxX - bounds.minX);
  const viewBoxHeight = Math.max(500, bounds.maxY - bounds.minY);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.6));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Associate vehicle with location coordinates or path
  const vehiclePositions = useMemo(() => {
    const locMap = new Map(locations.map(l => [l.id, l]));
    return vehicles.map((v, idx) => {
      const driver = drivers.find(d => d.id === v.assignedDriverId || d.vehicleId === v.id);
      const loc = locMap.get(v.currentLocationId) || locations[idx % locations.length];
      // Add slight offset for realistic distribution
      const offsetX = ((idx % 3) - 1) * 22;
      const offsetY = (((idx + 1) % 3) - 1) * 22;
      return {
        vehicle: v,
        driver,
        x: loc ? loc.x + offsetX : 200 + idx * 80,
        y: loc ? loc.y + offsetY : 150 + idx * 40,
      };
    });
  }, [vehicles, locations, drivers]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-sm select-none ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : ''
      }`}
      style={{ height: isFullscreen ? '100vh' : height }}
    >
      {/* Top Map Engine Toggle */}
      <div className="absolute top-3 right-16 z-30 flex items-center bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700 shadow-lg text-xs">
        <button
          onClick={() => setMapEngine('google')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition ${
            mapEngine === 'google'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MapIcon className="w-3.5 h-3.5" />
          <span>Google Maps</span>
        </button>
        <button
          onClick={() => setMapEngine('topology')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition ${
            mapEngine === 'topology'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Corridor Topology</span>
        </button>
      </div>

      {mapEngine === 'google' ? (
        <div className="w-full h-full">
          <GoogleLiveNetworkMap
            locations={locations}
            vehicles={vehicles}
            height={isFullscreen ? '100vh' : (typeof height === 'number' ? `${height}px` : height)}
          />
        </div>
      ) : (
        <>
          {/* SVG Map Canvas */}
          <div 
            className="w-full h-full cursor-grab active:cursor-grabbing overflow-hidden relative"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
        <svg
          className="w-full h-full transition-transform duration-75"
          viewBox={`${bounds.minX} ${bounds.minY} ${viewBoxWidth} ${viewBoxHeight}`}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
          <defs>
            {/* Grid background */}
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.75" />
            </pattern>
            {/* Road glow filter */}
            <filter id="road-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            {/* Vehicle pulse marker */}
            <filter id="vehicle-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#3b82f6" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Background grid */}
          <rect
            x={bounds.minX - 500}
            y={bounds.minY - 500}
            width={viewBoxWidth + 1000}
            height={viewBoxHeight + 1000}
            fill="#0f172a"
          />
          <rect
            x={bounds.minX - 500}
            y={bounds.minY - 500}
            width={viewBoxWidth + 1000}
            height={viewBoxHeight + 1000}
            fill="url(#grid-pattern)"
          />

          {/* Roads / Corridors */}
          <g className="roads-layer">
            {roads.map(road => {
              const fromLoc = locations.find(l => l.id === road.from);
              const toLoc = locations.find(l => l.id === road.to);
              if (!fromLoc || !toLoc) return null;

              const isHeavyTraffic = road.trafficMultiplier && road.trafficMultiplier > 1.3;
              const isModerateTraffic = road.trafficMultiplier && road.trafficMultiplier > 1.1;

              const strokeColor = !showTraffic 
                ? '#334155' 
                : isHeavyTraffic 
                ? '#f43f5e' 
                : isModerateTraffic 
                ? '#f59e0b' 
                : '#3b82f6';

              return (
                <g key={road.id} className="group">
                  {/* Road backdrop base */}
                  <line
                    x1={fromLoc.x}
                    y1={fromLoc.y}
                    x2={toLoc.x}
                    y2={toLoc.y}
                    stroke="#1e293b"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  {/* Active road track */}
                  <line
                    x1={fromLoc.x}
                    y1={fromLoc.y}
                    x2={toLoc.x}
                    y2={toLoc.y}
                    stroke={strokeColor}
                    strokeWidth="3.5"
                    strokeOpacity={showTraffic ? 0.75 : 0.4}
                    strokeLinecap="round"
                    strokeDasharray={road.trafficMultiplier && road.trafficMultiplier > 1.2 ? "6 4" : undefined}
                  />

                  {/* Flow animation for active roads */}
                  {road.isActive && (
                    <line
                      x1={fromLoc.x}
                      y1={fromLoc.y}
                      x2={toLoc.x}
                      y2={toLoc.y}
                      stroke="#60a5fa"
                      strokeWidth="2"
                      strokeDasharray="4 8"
                      strokeLinecap="round"
                      className="animate-[dash_1s_linear_infinite]"
                    />
                  )}

                  {/* Distance badge on road midpoint */}
                  {showLabels && (
                    <g transform={`translate(${(fromLoc.x + toLoc.x) / 2}, ${(fromLoc.y + toLoc.y) / 2})`}>
                      <rect
                        x="-18"
                        y="-8"
                        width="36"
                        height="16"
                        rx="4"
                        fill="#1e293b"
                        stroke="#334155"
                        strokeWidth="1"
                        opacity="0.9"
                      />
                      <text
                        x="0"
                        y="3.5"
                        fill="#94a3b8"
                        fontSize="9"
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        {road.distanceKm}km
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {/* Locations / Nodes */}
          <g className="locations-layer">
            {locations.map(loc => {
              const isSelected = selectedLocationId === loc.id;
              const isWarehouse = loc.type === 'warehouse' || loc.type === 'hub';

              return (
                <g
                  key={loc.id}
                  transform={`translate(${loc.x}, ${loc.y})`}
                  className="cursor-pointer"
                  onClick={() => onSelectLocation && onSelectLocation(loc)}
                  onMouseEnter={() => setHoveredLocation(loc)}
                  onMouseLeave={() => setHoveredLocation(null)}
                >
                  {/* Outer selection ring */}
                  {isSelected && (
                    <circle
                      r="22"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                      strokeDasharray="4 3"
                      className="animate-spin origin-center"
                    />
                  )}

                  {/* Node background circle */}
                  <circle
                    r={isWarehouse ? 16 : 12}
                    fill={isWarehouse ? '#1e1b4b' : '#0f172a'}
                    stroke={isWarehouse ? '#6366f1' : '#0284c7'}
                    strokeWidth={isSelected ? '3' : '2'}
                    className="transition-all hover:scale-110"
                  />

                  {/* Node icon inside SVG */}
                  <circle
                    r={isWarehouse ? 7 : 5}
                    fill={isWarehouse ? '#818cf8' : '#38bdf8'}
                  />

                  {/* Location label */}
                  {showLabels && (
                    <g transform="translate(0, 24)">
                      <rect
                        x={-(loc.name.length * 3.5 + 8)}
                        y="-9"
                        width={loc.name.length * 7 + 16}
                        height="18"
                        rx="4"
                        fill="#0f172a"
                        stroke="#334155"
                        strokeWidth="1"
                        opacity="0.95"
                      />
                      <text
                        x="0"
                        y="3"
                        fill="#f8fafc"
                        fontSize="10"
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        {loc.name}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {/* Vehicle Markers */}
          {showVehicles && (
            <g className="vehicles-layer">
              {vehiclePositions.map(({ vehicle, driver, x, y }) => {
                const isSelected = selectedVehicleId === vehicle.id;
                const isOnRoute = vehicle.status === 'on_route';

                return (
                  <g
                    key={vehicle.id}
                    transform={`translate(${x}, ${y})`}
                    className="cursor-pointer group"
                    onClick={() => onSelectVehicle && onSelectVehicle(vehicle)}
                    onMouseEnter={() => setHoveredVehicle(vehicle)}
                    onMouseLeave={() => setHoveredVehicle(null)}
                  >
                    {/* Pulsing indicator if active */}
                    {isOnRoute && (
                      <circle
                        r="20"
                        fill="#3b82f6"
                        opacity="0.25"
                        className="animate-ping origin-center"
                      />
                    )}

                    {/* Vehicle pill badge in map */}
                    <g transform="translate(-36, -34)">
                      <rect
                        width="72"
                        height="26"
                        rx="13"
                        fill={isSelected ? '#2563eb' : '#1e293b'}
                        stroke={isSelected ? '#60a5fa' : isOnRoute ? '#3b82f6' : '#475569'}
                        strokeWidth="1.5"
                        filter="url(#vehicle-glow)"
                      />
                      {/* Truck dot */}
                      <circle
                        cx="12"
                        cy="13"
                        r="4"
                        fill={isOnRoute ? '#10b981' : '#94a3b8'}
                      />
                      {/* Vehicle ID */}
                      <text
                        x="38"
                        y="16.5"
                        fill="#ffffff"
                        fontSize="10.5"
                        fontWeight="700"
                        textAnchor="middle"
                      >
                        {vehicle.id}
                      </text>
                    </g>

                    {/* Driver Sub-label */}
                    {driver && showLabels && (
                      <g transform="translate(0, -2)">
                        <rect
                          x={-(driver.name.length * 3 + 6)}
                          y="-7"
                          width={driver.name.length * 6 + 12}
                          height="14"
                          rx="3"
                          fill="#090d16"
                          stroke="#334155"
                          strokeWidth="0.8"
                          opacity="0.9"
                        />
                        <text
                          x="0"
                          y="3"
                          fill="#cbd5e1"
                          fontSize="8.5"
                          fontWeight="500"
                          textAnchor="middle"
                        >
                          {driver.name.split(' ')[0]}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          )}
        </svg>
      </div>

      {/* Floating Map Controls (Zoom, Reset, Layers, Fullscreen) */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <div className="flex flex-col bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl overflow-hidden shadow-lg">
          <button
            onClick={handleZoomIn}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <div className="h-px bg-slate-800" />
          <button
            onClick={handleZoomOut}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="h-px bg-slate-800" />
          <button
            onClick={handleResetView}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Center View"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        </div>

        {/* Layers control */}
        <div className="relative">
          <button
            onClick={() => setShowLayersMenu(prev => !prev)}
            className={`p-2 rounded-xl backdrop-blur-md border shadow-lg transition ${
              showLayersMenu 
                ? 'bg-blue-600 text-white border-blue-500' 
                : 'bg-slate-900/90 text-slate-300 hover:text-white border-slate-700/80 hover:bg-slate-800'
            }`}
            title="Map Layers"
          >
            <Layers className="w-4 h-4" />
          </button>

          {showLayersMenu && (
            <div className="absolute right-full mr-2 top-0 w-48 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl p-2.5 z-20 space-y-2 text-xs text-slate-200">
              <div className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider pb-1 border-b border-slate-800">
                Map Layers
              </div>
              <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={showTraffic}
                  onChange={e => setShowTraffic(e.target.checked)}
                  className="rounded border-slate-700 text-blue-600 focus:ring-0"
                />
                <span>Live Traffic Flow</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={showVehicles}
                  onChange={e => setShowVehicles(e.target.checked)}
                  className="rounded border-slate-700 text-blue-600 focus:ring-0"
                />
                <span>Active Vehicles</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={showLabels}
                  onChange={e => setShowLabels(e.target.checked)}
                  className="rounded border-slate-700 text-blue-600 focus:ring-0"
                />
                <span>Location Labels</span>
              </label>
            </div>
          )}
        </div>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800 shadow-lg transition"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Floating Status Bar / Map Legend on Bottom-Left */}
      <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-xl px-3 py-2 flex items-center gap-4 text-xs text-slate-300 shadow-lg hidden sm:flex">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white">Live Network</span>
        </div>
        <div className="h-3 w-px bg-slate-800" />
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Free Flow
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Moderate
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Heavy
          </span>
        </div>
      </div>

      {/* Floating Vehicle Hover Tooltip */}
      {hoveredVehicle && (
        <div className="absolute top-4 left-4 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 shadow-xl max-w-xs text-xs text-slate-300 z-10 pointer-events-none animate-in fade-in-50 duration-150">
          <div className="flex items-center justify-between gap-3 font-bold text-white mb-1">
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-blue-400" />
              <span>{hoveredVehicle.id} • {hoveredVehicle.model}</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              hoveredVehicle.status === 'on_route' ? 'bg-blue-900/60 text-blue-300' : 'bg-slate-800 text-slate-400'
            }`}>
              {hoveredVehicle.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            Plate: <span className="text-slate-200 font-mono">{hoveredVehicle.plateNumber}</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Capacity: <span className="text-slate-200">{hoveredVehicle.currentLoadKg}/{hoveredVehicle.maxCapacityKg} kg ({Math.round((hoveredVehicle.currentLoadKg / hoveredVehicle.maxCapacityKg) * 100)}%)</span>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
};
