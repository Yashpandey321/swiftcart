import React from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Network, 
  Binary, 
  Layers, 
  ShieldCheck,
  Zap,
  Activity,
  Award
} from 'lucide-react';
import { WeightedGraph } from '../dsa/Graph';
import { DeliveryHistoryItem, Vehicle, Package as PackageType } from '../types';

interface StatsDashboardProps {
  graph: WeightedGraph;
  packages: PackageType[];
  history: DeliveryHistoryItem[];
  vehicles: Vehicle[];
  urgentCount: number;
  standardCount: number;
  undoStackSize: number;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  graph,
  packages,
  history,
  vehicles,
  urgentCount,
  standardCount,
  undoStackSize,
}) => {
  const metrics = graph.getMetrics();

  const totalDelivered = history.length;
  const inTransitCount = packages.filter(p => p.status === 'in-transit' || p.status === 'dispatched').length;
  const totalTraversedKm = history.reduce((acc, h) => acc + h.distanceKm, 0);
  const avgDeliveryTime = totalDelivered > 0
    ? Math.round(history.reduce((acc, h) => acc + h.timeTakenMinutes, 0) / totalDelivered)
    : 0;

  const totalVehicleCapacity = vehicles.reduce((acc, v) => acc + v.maxCapacityKg, 0);
  const totalVehiclePayload = vehicles.reduce((acc, v) => acc + v.currentPayloadKg, 0);
  const fleetUtilization = totalVehicleCapacity > 0
    ? Math.round((totalVehiclePayload / totalVehicleCapacity) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Packages</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900">{packages.length}</span>
            <span className="text-xs text-slate-500 font-mono">in vector memory</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Urgent: <strong className="text-rose-600">{urgentCount}</strong></span>
            <span>Standard: <strong className="text-blue-600">{standardCount}</strong></span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Delivered Log</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-emerald-700">{totalDelivered}</span>
            <span className="text-xs text-slate-500 font-mono">in linked list</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            In-Transit: <strong className="text-indigo-600">{inTransitCount}</strong> shipments
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Distance Traversed</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900">{totalTraversedKm.toFixed(1)}</span>
            <span className="text-xs text-slate-500 font-mono">km total</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Avg Delivery Time: <strong className="text-slate-800">{avgDeliveryTime} mins</strong>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Fleet Load</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900">{fleetUtilization}%</span>
            <span className="text-xs text-slate-500 font-mono">capacity</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            {totalVehiclePayload} / {totalVehicleCapacity} kg active load
          </div>
        </div>
      </div>

      {/* Graph Topology & Algorithmic Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graph Structure Stats */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Network className="w-4 h-4 text-indigo-600" />
              <h4 className="font-bold text-sm text-slate-900">Road Graph Topology Metrics</h4>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              Weighted Graph G(V, E)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">Total Vertices (V)</span>
              <span className="text-lg font-bold text-slate-800 font-mono">{metrics.nodeCount} Hubs</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">Total Edges (E)</span>
              <span className="text-lg font-bold text-slate-800 font-mono">{metrics.edgeCount} Roads</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">Graph Density</span>
              <span className="text-lg font-bold text-indigo-600 font-mono">{metrics.density}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">Average Node Degree</span>
              <span className="text-lg font-bold text-slate-800 font-mono">{metrics.avgDegree}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">Connectivity</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1 mt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{metrics.isFullyConnected ? 'Fully Connected' : 'Disconnected Components'}</span>
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">Undo Stack Depth</span>
              <span className="text-lg font-bold text-amber-600 font-mono">{undoStackSize} Frames</span>
            </div>
          </div>
        </div>

        {/* DSA Time & Space Complexity Benchmark Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <h4 className="font-bold text-sm text-slate-900">DSA Complexity Matrix (College Benchmark)</h4>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
              Big-O Verified
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
              <span className="font-medium text-slate-800">Dijkstra Shortest Path</span>
              <span className="font-mono text-indigo-700 font-bold">O((V + E) log V)</span>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
              <span className="font-medium text-slate-800">BFS / DFS Network Traversal</span>
              <span className="font-mono text-indigo-700 font-bold">O(V + E)</span>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
              <span className="font-medium text-slate-800">Min-Heap Insert / Extract-Min</span>
              <span className="font-mono text-indigo-700 font-bold">O(log N)</span>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
              <span className="font-medium text-slate-800">Hash Map Package Lookup</span>
              <span className="font-mono text-emerald-700 font-bold">O(1) Average</span>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
              <span className="font-medium text-slate-800">Merge Sort Roster Sorting</span>
              <span className="font-mono text-indigo-700 font-bold">O(N log N) Guaranteed</span>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
              <span className="font-medium text-slate-800">FIFO Queue & LIFO Stack</span>
              <span className="font-mono text-emerald-700 font-bold">O(1) Push / Pop / Enqueue</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
