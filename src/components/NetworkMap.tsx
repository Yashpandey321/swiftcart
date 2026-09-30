import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  Warehouse, 
  MapPin, 
  Plus, 
  Play, 
  RotateCcw, 
  Navigation, 
  Layers, 
  Zap, 
  Truck, 
  Info,
  Check,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { DeliveryLocation, Road, DijkstraResult, TraversalStep, Vehicle } from '../types';
import { WeightedGraph } from '../dsa/Graph';

interface NetworkMapProps {
  graph: WeightedGraph;
  locations: DeliveryLocation[];
  roads: Road[];
  vehicles: Vehicle[];
  onAddLocation: (loc: Omit<DeliveryLocation, 'id'>) => void;
  onAddRoad: (road: Omit<Road, 'id'>) => void;
  onDeleteRoad: (roadId: string) => void;
  onDeleteLocation: (locId: string) => void;
  onUpdateLocationCoords: (id: string, x: number, y: number) => void;
  onDispatchDelivery?: (startId: string, endId: string, vehicleId?: string) => void;
}

type MapMode = 'select' | 'add-location' | 'add-road' | 'dijkstra' | 'bfs' | 'dfs';

export const NetworkMap: React.FC<NetworkMapProps> = ({
  graph,
  locations,
  roads,
  vehicles,
  onAddLocation,
  onAddRoad,
  onDeleteRoad,
  onDeleteLocation,
  onUpdateLocationCoords,
  onDispatchDelivery,
}) => {
  const [mode, setMode] = useState<MapMode>('select');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [roadStartNodeId, setRoadStartNodeId] = useState<string | null>(null);
  
  // Dijkstra & Traversal states
  const [dijkstraSourceId, setDijkstraSourceId] = useState<string>('loc-1');
  const [dijkstraTargetId, setDijkstraTargetId] = useState<string>('loc-7');
  const [dijkstraResult, setDijkstraResult] = useState<DijkstraResult | null>(null);
  const [dijkstraStepIndex, setDijkstraStepIndex] = useState<number>(-1);

  // Traversal state (BFS / DFS)
  const [traversalType, setTraversalType] = useState<'bfs' | 'dfs'>('bfs');
  const [traversalSteps, setTraversalSteps] = useState<TraversalStep[]>([]);
  const [traversalStepIndex, setTraversalStepIndex] = useState<number>(-1);
  const [isTraversalPlaying, setIsTraversalPlaying] = useState<boolean>(false);

  // New location modal state
  const [newLocModal, setNewLocModal] = useState<{ x: number; y: number } | null>(null);
  const [newLocName, setNewLocName] = useState('');
  const [newLocCode, setNewLocCode] = useState('');
  const [newLocType, setNewLocType] = useState<'hub' | 'warehouse' | 'dropoff'>('dropoff');

  // New road modal state
  const [newRoadModal, setNewRoadModal] = useState<{ from: string; to: string } | null>(null);
  const [newRoadDist, setNewRoadDist] = useState<number>(5.0);
  const [newRoadSpeed, setNewRoadSpeed] = useState<number>(50);
  const [newRoadTraffic, setNewRoadTraffic] = useState<number>(1.0);

  // Dragging state
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Vehicle Simulation state
  const [animatingPath, setAnimatingPath] = useState<string[] | null>(null);
  const [animationProgress, setAnimationProgress] = useState<number>(0);
  const [vehiclePos, setVehiclePos] = useState<{ x: number; y: number } | null>(null);

  // Run Dijkstra whenever source or target changes in dijkstra mode
  useEffect(() => {
    if (dijkstraSourceId && dijkstraTargetId && dijkstraSourceId !== dijkstraTargetId) {
      const res = graph.dijkstra(dijkstraSourceId, dijkstraTargetId);
      setDijkstraResult(res);
      setDijkstraStepIndex(res.steps.length - 1);
    }
  }, [dijkstraSourceId, dijkstraTargetId, roads, locations]);

  // Handle Drag & Drop of nodes
  const handleMouseDown = (nodeId: string, e: React.MouseEvent) => {
    if (mode === 'select') {
      e.stopPropagation();
      setDraggedNodeId(nodeId);
      setSelectedNodeId(nodeId);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedNodeId && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const x = Math.max(40, Math.min(rect.width - 40, e.clientX - rect.left));
      const y = Math.max(40, Math.min(rect.height - 40, e.clientY - rect.top));
      onUpdateLocationCoords(draggedNodeId, Math.round(x), Math.round(y));
    }
  };

  const handleMouseUp = () => {
    setDraggedNodeId(null);
  };

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (mode === 'add-location' && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const x = Math.round(e.clientX - rect.left);
      const y = Math.round(e.clientY - rect.top);
      setNewLocModal({ x, y });
      setNewLocName(`Hub ${locations.length + 1}`);
      setNewLocCode(`HB-${locations.length + 1}`);
    } else if (mode === 'select') {
      setSelectedNodeId(null);
    }
  };

  const handleNodeClick = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (mode === 'select') {
      setSelectedNodeId(nodeId);
    } else if (mode === 'add-road') {
      if (!roadStartNodeId) {
        setRoadStartNodeId(nodeId);
      } else if (roadStartNodeId !== nodeId) {
        // Auto calculate euclidean distance in km for realistic default
        const nodeA = graph.nodes.get(roadStartNodeId);
        const nodeB = graph.nodes.get(nodeId);
        let dist = 7.5;
        if (nodeA && nodeB) {
          const pixelDist = Math.hypot(nodeA.x - nodeB.x, nodeA.y - nodeB.y);
          dist = Number((pixelDist / 40).toFixed(1)); // 40px ~= 1km
        }
        setNewRoadDist(dist);
        setNewRoadModal({ from: roadStartNodeId, to: nodeId });
        setRoadStartNodeId(null);
      }
    } else if (mode === 'dijkstra') {
      if (!dijkstraSourceId) {
        setDijkstraSourceId(nodeId);
      } else if (dijkstraSourceId === nodeId) {
        // Unset or do nothing
      } else {
        setDijkstraTargetId(nodeId);
      }
    }
  };

  const submitNewLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocModal) return;
    onAddLocation({
      name: newLocName.trim() || 'New Location',
      code: newLocCode.trim().toUpperCase() || 'LOC',
      type: newLocType,
      x: newLocModal.x,
      y: newLocModal.y,
      address: `${Math.floor(Math.random() * 500) + 1} Logistics Blvd`,
      isHub: newLocType !== 'dropoff',
    });
    setNewLocModal(null);
    setMode('select');
  };

  const submitNewRoad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoadModal) return;
    onAddRoad({
      from: newRoadModal.from,
      to: newRoadModal.to,
      distanceKm: Number(newRoadDist),
      speedLimitKmH: Number(newRoadSpeed),
      trafficFactor: Number(newRoadTraffic),
      roadCondition: newRoadTraffic > 1.2 ? 'congested' : newRoadTraffic > 1.0 ? 'moderate' : 'optimal',
      isBidirectional: true,
    });
    setNewRoadModal(null);
    setMode('select');
  };

  // Run BFS / DFS
  const executeTraversal = (type: 'bfs' | 'dfs') => {
    setTraversalType(type);
    const startNode = selectedNodeId || dijkstraSourceId || locations[0]?.id;
    if (!startNode) return;
    const res = type === 'bfs' ? graph.bfs(startNode) : graph.dfs(startNode);
    setTraversalSteps(res.steps);
    setTraversalStepIndex(0);
    setIsTraversalPlaying(true);
  };

  // Traversal animation timer
  useEffect(() => {
    let timer: any;
    if (isTraversalPlaying && traversalSteps.length > 0) {
      timer = setInterval(() => {
        setTraversalStepIndex(prev => {
          if (prev < traversalSteps.length - 1) {
            return prev + 1;
          } else {
            setIsTraversalPlaying(false);
            return prev;
          }
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTraversalPlaying, traversalSteps]);

  // Simulate vehicle traveling along Dijkstra path
  const startVehicleAnimation = () => {
    if (!dijkstraResult || dijkstraResult.path.length < 2) return;
    const path = dijkstraResult.path;
    setAnimatingPath(path);
    setAnimationProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.02;
      if (progress >= 1.0) {
        progress = 1.0;
        clearInterval(interval);
        setTimeout(() => setAnimatingPath(null), 1000);
      }
      setAnimationProgress(progress);

      // Compute current coordinates along path
      const totalSegments = path.length - 1;
      const segmentFloat = progress * totalSegments;
      const segmentIndex = Math.min(Math.floor(segmentFloat), totalSegments - 1);
      const segmentProgress = segmentFloat - segmentIndex;

      const nodeA = graph.nodes.get(path[segmentIndex]);
      const nodeB = graph.nodes.get(path[segmentIndex + 1]);

      if (nodeA && nodeB) {
        const x = nodeA.x + (nodeB.x - nodeA.x) * segmentProgress;
        const y = nodeA.y + (nodeB.y - nodeA.y) * segmentProgress;
        setVehiclePos({ x, y });
      }
    }, 40);
  };

  const activePathEdges = new Set<string>();
  if (dijkstraResult && dijkstraResult.path.length > 1) {
    for (let i = 0; i < dijkstraResult.path.length - 1; i++) {
      const u = dijkstraResult.path[i];
      const v = dijkstraResult.path[i + 1];
      activePathEdges.add(`${u}->${v}`);
      activePathEdges.add(`${v}->${u}`);
    }
  }

  const currentTraversalStep = traversalStepIndex >= 0 && traversalStepIndex < traversalSteps.length 
    ? traversalSteps[traversalStepIndex] 
    : null;

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-5rem)] max-h-[880px]">
      {/* Interactive Map Area */}
      <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 shadow-xl flex flex-col overflow-hidden relative">
        {/* Map Header Controls */}
        <div className="bg-slate-950/80 backdrop-blur-xs px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 z-10">
          {/* Mode Switcher */}
          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => { setMode('select'); setRoadStartNodeId(null); }}
              className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                mode === 'select' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Select & Drag
            </button>
            <button
              onClick={() => { setMode('add-location'); setRoadStartNodeId(null); }}
              className={`px-3 py-1 text-xs font-medium rounded-md flex items-center space-x-1 transition ${
                mode === 'add-location' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Plus className="w-3 h-3" />
              <span>Add Node</span>
            </button>
            <button
              onClick={() => { setMode('add-road'); setRoadStartNodeId(null); }}
              className={`px-3 py-1 text-xs font-medium rounded-md flex items-center space-x-1 transition ${
                mode === 'add-road' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Add Road</span>
            </button>
            <button
              onClick={() => { setMode('dijkstra'); setRoadStartNodeId(null); }}
              className={`px-3 py-1 text-xs font-medium rounded-md flex items-center space-x-1 transition ${
                mode === 'dijkstra' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Navigation className="w-3 h-3" />
              <span>Dijkstra Path</span>
            </button>
          </div>

          {/* Quick Traversal Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => { setMode('bfs'); executeTraversal('bfs'); }}
              className={`px-2.5 py-1 text-xs font-medium rounded-md border flex items-center space-x-1 transition ${
                mode === 'bfs' 
                  ? 'bg-blue-600/30 text-blue-300 border-blue-500' 
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3 h-3 text-blue-400" />
              <span>Run BFS</span>
            </button>
            <button
              onClick={() => { setMode('dfs'); executeTraversal('dfs'); }}
              className={`px-2.5 py-1 text-xs font-medium rounded-md border flex items-center space-x-1 transition ${
                mode === 'dfs' 
                  ? 'bg-purple-600/30 text-purple-300 border-purple-500' 
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <Zap className="w-3 h-3 text-purple-400" />
              <span>Run DFS</span>
            </button>
            {dijkstraResult && dijkstraResult.path.length > 1 && (
              <button
                onClick={startVehicleAnimation}
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-emerald-600 hover:bg-emerald-500 text-white flex items-center space-x-1 shadow-xs transition"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Simulate Route</span>
              </button>
            )}
          </div>
        </div>

        {/* Mode Instructions Banner */}
        <div className="px-4 py-1.5 bg-slate-900/90 border-b border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>
            {mode === 'select' && 'Click a location or road to inspect. Drag any node to reposition in real time.'}
            {mode === 'add-location' && 'Click anywhere on the map grid to place a new delivery node.'}
            {mode === 'add-road' && (!roadStartNodeId ? 'Step 1: Click the starting location node.' : `Step 2: Click the destination node to connect from ${graph.nodes.get(roadStartNodeId)?.name}.`)}
            {mode === 'dijkstra' && 'Click nodes to change Source (Green) and Destination (Rose).'}
            {(mode === 'bfs' || mode === 'dfs') && `Visualizing ${mode.toUpperCase()} graph exploration wavefront.`}
          </span>
          <span className="text-slate-500 font-mono text-[10px]">
            {locations.length} Nodes • {roads.length} Roads
          </span>
        </div>

        {/* SVG Canvas */}
        <div className="flex-1 relative overflow-hidden bg-radial from-slate-900 via-slate-950 to-slate-950 select-none">
          <svg
            ref={svgRef}
            className="w-full h-full cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={handleCanvasClick}
          >
            {/* Grid Pattern */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(51, 65, 85, 0.25)" strokeWidth="1" />
              </pattern>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Roads (Edges) */}
            {roads.map((road) => {
              const fromLoc = graph.nodes.get(road.from);
              const toLoc = graph.nodes.get(road.to);
              if (!fromLoc || !toLoc) return null;

              const isPartOfShortestPath =
                activePathEdges.has(`${road.from}->${road.to}`) ||
                activePathEdges.has(`${road.to}->${road.from}`);

              const midX = (fromLoc.x + toLoc.x) / 2;
              const midY = (fromLoc.y + toLoc.y) / 2;

              let strokeColor = 'rgba(71, 85, 105, 0.6)';
              if (isPartOfShortestPath) {
                strokeColor = '#10b981';
              } else if (road.roadCondition === 'congested') {
                strokeColor = 'rgba(239, 68, 68, 0.6)';
              } else if (road.roadCondition === 'moderate') {
                strokeColor = 'rgba(245, 158, 11, 0.6)';
              }

              return (
                <g key={road.id} className="transition-all duration-300">
                  {/* Road Line */}
                  <line
                    x1={fromLoc.x}
                    y1={fromLoc.y}
                    x2={toLoc.x}
                    y2={toLoc.y}
                    stroke={strokeColor}
                    strokeWidth={isPartOfShortestPath ? 4 : 2}
                    strokeDasharray={isPartOfShortestPath ? 'none' : 'none'}
                    className={isPartOfShortestPath ? 'filter drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]' : ''}
                  />

                  {/* Road Weight Label */}
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect
                      x="-22"
                      y="-9"
                      width="44"
                      height="18"
                      rx="4"
                      fill="#0f172a"
                      stroke={isPartOfShortestPath ? '#10b981' : '#334155'}
                      strokeWidth="1"
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={isPartOfShortestPath ? '#34d399' : '#94a3b8'}
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {road.distanceKm}km
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Simulated Delivery Vehicle Animation */}
            {animatingPath && vehiclePos && (
              <g transform={`translate(${vehiclePos.x}, ${vehiclePos.y})`} className="transition-transform">
                <circle r="14" fill="#10b981" className="animate-ping opacity-30" />
                <circle r="11" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" />
                <Truck
                  x="-7"
                  y="-7"
                  width="14"
                  height="14"
                  className="text-white fill-current"
                />
              </g>
            )}

            {/* Location Nodes */}
            {locations.map((loc) => {
              const isSelected = selectedNodeId === loc.id;
              const isDijkstraSource = dijkstraSourceId === loc.id;
              const isDijkstraTarget = dijkstraTargetId === loc.id;
              const isInShortestPath = dijkstraResult?.path.includes(loc.id);
              const isTraversalCurrent = currentTraversalStep?.currentNode === loc.id;
              const isTraversalVisited = currentTraversalStep?.visited.includes(loc.id);

              let fillBg = '#1e293b';
              let ringColor = '#475569';
              let ringWidth = 2;

              if (isDijkstraSource) {
                fillBg = '#065f46';
                ringColor = '#10b981';
                ringWidth = 3;
              } else if (isDijkstraTarget) {
                fillBg = '#881337';
                ringColor = '#f43f5e';
                ringWidth = 3;
              } else if (isInShortestPath) {
                fillBg = '#0f766e';
                ringColor = '#2dd4bf';
                ringWidth = 2.5;
              } else if (isTraversalCurrent) {
                fillBg = '#7c2d12';
                ringColor = '#f97316';
                ringWidth = 3;
              } else if (isTraversalVisited) {
                fillBg = '#1e3a8a';
                ringColor = '#3b82f6';
              } else if (isSelected) {
                ringColor = '#a855f7';
                ringWidth = 3;
              }

              return (
                <g
                  key={loc.id}
                  transform={`translate(${loc.x}, ${loc.y})`}
                  onMouseDown={(e) => handleMouseDown(loc.id, e)}
                  onClick={(e) => handleNodeClick(loc.id, e)}
                  className="cursor-pointer group"
                >
                  {/* Outer pulse for source/target/traversal */}
                  {(isDijkstraSource || isDijkstraTarget || isTraversalCurrent) && (
                    <circle
                      r="22"
                      fill="none"
                      stroke={ringColor}
                      strokeWidth="1.5"
                      className="animate-pulse opacity-60"
                    />
                  )}

                  {/* Main Node Circle */}
                  <circle
                    r="16"
                    fill={fillBg}
                    stroke={ringColor}
                    strokeWidth={ringWidth}
                    className="filter drop-shadow-md group-hover:stroke-indigo-400 transition"
                  />

                  {/* Center Node Icon */}
                  {loc.type === 'warehouse' && (
                    <Warehouse x="-7" y="-7" width="14" height="14" className="text-amber-300 pointer-events-none" />
                  )}
                  {loc.type === 'hub' && (
                    <Building2 x="-7" y="-7" width="14" height="14" className="text-indigo-300 pointer-events-none" />
                  )}
                  {loc.type === 'dropoff' && (
                    <MapPin x="-7" y="-7" width="14" height="14" className="text-emerald-300 pointer-events-none" />
                  )}

                  {/* Node Label */}
                  <g transform="translate(0, 24)">
                    <rect
                      x="-38"
                      y="-7"
                      width="76"
                      height="16"
                      rx="4"
                      fill="rgba(15, 23, 42, 0.85)"
                      stroke="#334155"
                      strokeWidth="0.8"
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#f8fafc"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {loc.code}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Dijkstra Path Result Pill Bar (Floating) */}
        {dijkstraResult && dijkstraResult.path.length > 0 && (
          <div className="absolute bottom-3 left-4 right-4 bg-slate-950/95 border border-slate-700/80 rounded-xl p-3 shadow-2xl flex flex-wrap items-center justify-between gap-3 z-20">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-950 text-emerald-400 border border-emerald-700/50 rounded-lg">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Shortest Path Found
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.2 rounded font-mono font-bold">
                    {dijkstraResult.totalDistanceKm} km
                  </span>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.2 rounded font-mono font-bold">
                    ~{dijkstraResult.estimatedTimeMin} min ETA
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex items-center space-x-1.5 mt-0.5 font-mono">
                  {dijkstraResult.path.map((nid, i) => (
                    <React.Fragment key={nid}>
                      <span className={i === 0 ? 'text-emerald-400' : i === dijkstraResult.path.length - 1 ? 'text-rose-400' : 'text-slate-200'}>
                        {graph.nodes.get(nid)?.code}
                      </span>
                      {i < dijkstraResult.path.length - 1 && (
                        <ChevronRight className="w-3 h-3 text-slate-600 inline" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={startVehicleAnimation}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center space-x-1.5 transition"
              >
                <Truck className="w-4 h-4" />
                <span>Animate Route</span>
              </button>
              {onDispatchDelivery && (
                <button
                  onClick={() => onDispatchDelivery(dijkstraSourceId, dijkstraTargetId)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center space-x-1.5 transition"
                >
                  <Check className="w-4 h-4" />
                  <span>Dispatch Package</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Control & Inspection Panel */}
      <div className="w-full lg:w-80 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        {/* Panel Header */}
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-slate-700" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
              {mode === 'dijkstra' ? 'Dijkstra Controller' : mode === 'bfs' || mode === 'dfs' ? `${mode.toUpperCase()} Traversal` : 'Node / Edge Inspector'}
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {graph.nodes.size} Hubs
          </span>
        </div>

        {/* Panel Body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs">
          {/* DIJKSTRA CONTROLLER */}
          {mode === 'dijkstra' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-emerald-950 space-y-1">
                <div className="font-bold text-xs flex items-center space-x-1.5">
                  <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Dijkstra Shortest Path Finder</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Greedily relaxes edge weights (distance × traffic factor) to find the globally optimal route.
                </p>
              </div>

              {/* Source & Destination Selectors */}
              <div className="space-y-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Source Node (Start):
                  </label>
                  <select
                    value={dijkstraSourceId}
                    onChange={(e) => setDijkstraSourceId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500"
                  >
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} ({loc.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Target Node (Destination):
                  </label>
                  <select
                    value={dijkstraTargetId}
                    onChange={(e) => setDijkstraTargetId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500"
                  >
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} ({loc.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Step-by-Step Dijkstra Trace */}
              {dijkstraResult && dijkstraResult.steps.length > 0 && (
                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] text-slate-800 uppercase tracking-wide">
                      Algorithm Step Trace
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">
                      Step {dijkstraStepIndex + 1} / {dijkstraResult.steps.length}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max={dijkstraResult.steps.length - 1}
                    value={dijkstraStepIndex}
                    onChange={(e) => setDijkstraStepIndex(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />

                  {dijkstraResult.steps[dijkstraStepIndex] && (
                    <div className="text-[11px] text-slate-700 bg-white border border-slate-200 rounded p-2">
                      <p className="font-medium text-slate-900 mb-1">
                        {dijkstraResult.steps[dijkstraStepIndex].description}
                      </p>
                      <div className="text-[10px] text-slate-500">
                        Current Node: <span className="font-semibold text-slate-800">{dijkstraResult.steps[dijkstraStepIndex].currentNodeName}</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Relaxations: <span className="font-mono">{dijkstraResult.steps[dijkstraStepIndex].relaxedEdges.length}</span> edges
                      </div>
                    </div>
                  )}

                  {/* Tentative Distances Table */}
                  <div className="max-h-36 overflow-y-auto border border-slate-200 rounded bg-white">
                    <table className="w-full text-[10px]">
                      <thead className="bg-slate-100 text-slate-600 border-b border-slate-200">
                        <tr>
                          <th className="px-2 py-1 text-left">Node</th>
                          <th className="px-2 py-1 text-right">Tentative Dist</th>
                          <th className="px-2 py-1 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(dijkstraResult.steps[dijkstraStepIndex]?.tentativeDistances || {}).map(
                          ([nodeId, dist]) => {
                            const isVisited = dijkstraResult.steps[dijkstraStepIndex]?.visitedNodes.includes(nodeId);
                            return (
                              <tr key={nodeId} className="border-b border-slate-100">
                                <td className="px-2 py-0.5 font-medium">{graph.nodes.get(nodeId)?.code}</td>
                                <td className="px-2 py-0.5 text-right font-mono">
                                  {dist === Infinity ? '∞' : `${dist} km`}
                                </td>
                                <td className="px-2 py-0.5 text-center">
                                  <span className={`px-1 py-0.2 rounded text-[9px] ${
                                    isVisited ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                                  }`}>
                                    {isVisited ? 'Visited' : 'Open'}
                                  </span>
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TRAVERSAL CONTROLLER (BFS / DFS) */}
          {(mode === 'bfs' || mode === 'dfs') && (
            <div className="space-y-3">
              <div className={`p-3 rounded-lg border text-xs space-y-1 ${
                mode === 'bfs' ? 'bg-blue-50 border-blue-200 text-blue-950' : 'bg-purple-50 border-purple-200 text-purple-950'
              }`}>
                <div className="font-bold flex items-center space-x-1">
                  <span>{mode.toUpperCase()} Graph Traversal</span>
                </div>
                <p className="text-[11px]">
                  {mode === 'bfs' 
                    ? 'Explores network layer-by-layer using a FIFO Queue frontier.' 
                    : 'Explores deep branch paths using a LIFO Stack frontier.'}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => executeTraversal(mode)}
                  className="flex-1 py-1.5 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition flex items-center justify-center space-x-1"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Re-Run {mode.toUpperCase()}</span>
                </button>
              </div>

              {currentTraversalStep && (
                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Step {traversalStepIndex + 1} / {traversalSteps.length}</span>
                    <span className="font-semibold text-slate-800">{currentTraversalStep.currentNodeName}</span>
                  </div>
                  <p className="text-[11px] text-slate-700 bg-white p-2 rounded border border-slate-200">
                    {currentTraversalStep.description}
                  </p>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-600 uppercase block mb-1">
                      {mode === 'bfs' ? 'Frontier Queue' : 'Frontier Stack'}:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {currentTraversalStep.frontier.length === 0 ? (
                        <span className="text-[10px] text-slate-400 italic">Frontier empty</span>
                      ) : (
                        currentTraversalStep.frontier.map((id, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-slate-200 text-slate-800 font-mono text-[10px] rounded">
                            {graph.nodes.get(id)?.code || id}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* INSPECTOR (DEFAULT MODE) */}
          {mode !== 'dijkstra' && mode !== 'bfs' && mode !== 'dfs' && (
            <div>
              {selectedNodeId ? (
                (() => {
                  const node = graph.nodes.get(selectedNodeId);
                  if (!node) return null;
                  const outgoingEdges = graph.adjacencyList.get(selectedNodeId) || [];
                  return (
                    <div className="space-y-3">
                      <div className="border-b border-slate-200 pb-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600">
                          Selected Location Node
                        </span>
                        <h4 className="font-bold text-sm text-slate-900">{node.name}</h4>
                        <span className="text-[11px] font-mono text-slate-500">{node.code} • {node.type}</span>
                      </div>

                      <div className="text-[11px] text-slate-600 space-y-1">
                        <div>Address: <span className="font-medium text-slate-800">{node.address}</span></div>
                        <div>Canvas Coords: <span className="font-mono text-slate-800">({node.x}, {node.y})</span></div>
                        <div>Degree: <span className="font-mono font-bold text-indigo-700">{outgoingEdges.length}</span> connected roads</div>
                      </div>

                      {/* Connected Roads List */}
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                          Connected Roads
                        </span>
                        <div className="space-y-1">
                          {outgoingEdges.map((edge) => {
                            const destNode = graph.nodes.get(edge.to);
                            return (
                              <div
                                key={edge.roadId}
                                className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200 text-[11px]"
                              >
                                <div>
                                  <span className="font-medium text-slate-800">{destNode?.name}</span>
                                  <div className="text-[10px] text-slate-500">
                                    {edge.distanceKm} km • {edge.speedLimitKmH} km/h • Traffic x{edge.trafficFactor}
                                  </div>
                                </div>
                                <button
                                  onClick={() => onDeleteRoad(edge.roadId)}
                                  className="text-rose-500 hover:text-rose-700 text-[10px] font-semibold"
                                >
                                  Delete
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-2 flex flex-col gap-1.5">
                        <button
                          onClick={() => {
                            setDijkstraSourceId(selectedNodeId);
                            setMode('dijkstra');
                          }}
                          className="w-full py-1.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-500 text-xs transition"
                        >
                          Find Route from Here
                        </button>
                        <button
                          onClick={() => onDeleteLocation(selectedNodeId)}
                          className="w-full py-1 bg-white border border-rose-300 text-rose-600 font-medium rounded-lg hover:bg-rose-50 text-xs transition"
                        >
                          Delete Node
                        </button>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="text-center py-8 text-slate-400 space-y-2">
                  <Navigation className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs">
                    Click any node or road on the map to inspect its graph properties, weight, and connections.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CREATE LOCATION MODAL */}
      {newLocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-sm p-5 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Create New Delivery Node</h3>
            <form onSubmit={submitNewLocation} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Location Name</label>
                <input
                  type="text"
                  required
                  value={newLocName}
                  onChange={(e) => setNewLocName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5"
                  placeholder="e.g. Westside Depot"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Node Code</label>
                <input
                  type="text"
                  required
                  value={newLocCode}
                  onChange={(e) => setNewLocCode(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 uppercase font-mono"
                  placeholder="e.g. WST-01"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Type</label>
                <select
                  value={newLocType}
                  onChange={(e) => setNewLocType(e.target.value as any)}
                  className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5"
                >
                  <option value="hub">Distribution Hub</option>
                  <option value="warehouse">Storage Warehouse</option>
                  <option value="dropoff">Customer Drop-off</option>
                </select>
              </div>
              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewLocModal(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg"
                >
                  Add Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE ROAD MODAL */}
      {newRoadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-sm p-5 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Add Road Between Nodes</h3>
            <p className="text-xs text-slate-500">
              Connecting <span className="font-semibold text-slate-800">{graph.nodes.get(newRoadModal.from)?.name}</span> and{' '}
              <span className="font-semibold text-slate-800">{graph.nodes.get(newRoadModal.to)?.name}</span>.
            </p>
            <form onSubmit={submitNewRoad} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Road Distance (km)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="100"
                  required
                  value={newRoadDist}
                  onChange={(e) => setNewRoadDist(parseFloat(e.target.value) || 1)}
                  className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Speed Limit (km/h)</label>
                <input
                  type="number"
                  min="20"
                  max="120"
                  required
                  value={newRoadSpeed}
                  onChange={(e) => setNewRoadSpeed(parseInt(e.target.value) || 50)}
                  className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Traffic Factor ({newRoadTraffic}x multiplier)
                </label>
                <select
                  value={newRoadTraffic}
                  onChange={(e) => setNewRoadTraffic(parseFloat(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5"
                >
                  <option value={1.0}>Optimal / Clear (1.0x)</option>
                  <option value={1.2}>Moderate Traffic (1.2x)</option>
                  <option value={1.5}>Heavy Traffic / Congestion (1.5x)</option>
                </select>
              </div>
              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewRoadModal(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg"
                >
                  Add Road
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
