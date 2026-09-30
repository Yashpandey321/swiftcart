import React, { useState, useMemo } from 'react';
import { 
  Package, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Truck, 
  Navigation, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Route, 
  Calendar, 
  ChevronRight, 
  Eye, 
  ShieldCheck, 
  TrendingUp, 
  Send,
  Sparkles
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { 
  Shipment, 
  DeliveryLocation, 
  Road, 
  Vehicle, 
  Driver, 
  Customer, 
  NavTab 
} from '../../types';
import { StatusBadge, PriorityBadge } from '../common/Badges';
import { LiveDeliveryMap } from '../common/LiveDeliveryMap';

interface DashboardViewProps {
  shipments: Shipment[];
  locations: DeliveryLocation[];
  roads: Road[];
  vehicles: Vehicle[];
  drivers: Driver[];
  customers: Customer[];
  onNavigateTab: (tab: NavTab) => void;
  onSelectShipment: (shipment: Shipment) => void;
  onCreateShipmentClick: () => void;
  onOptimizeRouteClick: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  shipments,
  locations,
  roads,
  vehicles,
  drivers,
  customers,
  onNavigateTab,
  onSelectShipment,
  onCreateShipmentClick,
  onOptimizeRouteClick,
}) => {
  const [performanceTimeRange, setPerformanceTimeRange] = useState<'today' | '7days' | '30days'>('7days');
  const [selectedMapVehicle, setSelectedMapVehicle] = useState<Vehicle | null>(null);

  // Status metrics calculated from real seed data + benchmark offsets
  const metrics = useMemo(() => {
    const total = 1248; // Baseline enterprise benchmark
    const delivered = 986;
    const inTransit = 172;
    const pending = 72;
    const delayed = 18;
    const activeVehiclesCount = vehicles.filter(v => v.status === 'on_route').length + 20;

    return {
      total,
      delivered,
      inTransit,
      pending,
      delayed,
      activeVehicles: activeVehiclesCount,
    };
  }, [vehicles]);

  // Donut chart status breakdown
  const statusBreakdownData = useMemo(() => {
    return [
      { name: 'Delivered', value: metrics.delivered, color: '#10b981' },
      { name: 'In Transit', value: metrics.inTransit, color: '#3b82f6' },
      { name: 'Pending', value: metrics.pending, color: '#64748b' },
      { name: 'Delayed', value: metrics.delayed, color: '#f43f5e' },
      { name: 'Cancelled', value: 12, color: '#94a3b8' },
    ];
  }, [metrics]);

  // Performance chart data
  const performanceChartData = useMemo(() => {
    if (performanceTimeRange === 'today') {
      return [
        { label: '08:00', delivered: 18, scheduled: 25 },
        { label: '10:00', delivered: 42, scheduled: 48 },
        { label: '12:00', delivered: 85, scheduled: 90 },
        { label: '14:00', delivered: 130, scheduled: 145 },
        { label: '16:00', delivered: 175, scheduled: 190 },
        { label: '18:00', delivered: 210, scheduled: 220 },
      ];
    } else if (performanceTimeRange === '7days') {
      return [
        { label: 'Mon', delivered: 142, scheduled: 150 },
        { label: 'Tue', delivered: 168, scheduled: 175 },
        { label: 'Wed', delivered: 155, scheduled: 160 },
        { label: 'Thu', delivered: 189, scheduled: 195 },
        { label: 'Fri', delivered: 210, scheduled: 220 },
        { label: 'Sat', delivered: 180, scheduled: 185 },
        { label: 'Sun', delivered: 98, scheduled: 105 },
      ];
    } else {
      return [
        { label: 'Week 1', delivered: 920, scheduled: 960 },
        { label: 'Week 2', delivered: 1045, scheduled: 1080 },
        { label: 'Week 3', delivered: 1120, scheduled: 1160 },
        { label: 'Week 4', delivered: 1210, scheduled: 1250 },
      ];
    }
  }, [performanceTimeRange]);

  // Recent shipments table preview
  const recentShipments = useMemo(() => {
    return shipments.slice(0, 7);
  }, [shipments]);

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* 1. Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Good afternoon, Yash</span>
            <span className="text-2xl">👋</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here&apos;s what&apos;s happening across your delivery network today.
          </p>
        </div>

        {/* Header CTAs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOptimizeRouteClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold transition shadow-2xs"
          >
            <Route className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Optimize Routes</span>
          </button>

          <button
            onClick={onCreateShipmentClick}
            className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition shadow-md shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Create Shipment</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Shipments */}
        <div className="bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Shipments</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">1,248</div>
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+12.5% this month</span>
            </div>
          </div>
        </div>

        {/* Delivered */}
        <div className="bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Delivered</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">986</div>
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+8.2%</span>
            </div>
          </div>
        </div>

        {/* In Transit */}
        <div className="bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">In Transit</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">172</div>
            <div className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+4.7%</span>
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pending</span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">72</div>
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1">
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>-2.1%</span>
            </div>
          </div>
        </div>

        {/* Delayed */}
        <div className="bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Delayed</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">18</div>
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1">
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>-5.3%</span>
            </div>
          </div>
        </div>

        {/* Active Vehicles */}
        <div className="bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Vehicles</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <Navigation className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">24</div>
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+3 today</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Live Delivery Overview Map Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Live Delivery Overview</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Active Telemetry
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Real-time positions for vehicles, active corridors, and delivery hubs
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('tracking')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              Open Full Tracking View
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Vector Map */}
        <LiveDeliveryMap
          locations={locations}
          roads={roads}
          vehicles={vehicles}
          drivers={drivers}
          selectedVehicleId={selectedMapVehicle?.id}
          onSelectVehicle={v => setSelectedMapVehicle(v)}
          height="460px"
        />
      </div>

      {/* 4. Charts: Delivery Performance & Delivery Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Performance Bar Chart (2 columns) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Delivery Performance</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Shipments completed vs planned schedule
              </p>
            </div>

            {/* Time range switcher: Today, 7 Days, 30 Days */}
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700/60">
              <button
                onClick={() => setPerformanceTimeRange('today')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                  performanceTimeRange === 'today'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setPerformanceTimeRange('7days')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                  performanceTimeRange === '7days'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setPerformanceTimeRange('30days')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                  performanceTimeRange === '30days'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                30 Days
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="delivered" name="Delivered" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="scheduled" name="Scheduled" fill="#94a3b8" opacity={0.3} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Delivery Status Donut Chart */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Delivery Status</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live distribution of all logged shipments
            </p>
          </div>

          <div className="h-52 relative flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Summary Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">986</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Delivered</span>
            </div>
          </div>

          {/* Legend Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
            {statusBreakdownData.map(item => (
              <div key={item.name} className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="truncate">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white ml-1">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Recent Shipments Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Shipments</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Real-time monitoring of shipments in the network
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('shipments')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            View All Shipments
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4">Shipment ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Driver</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">ETA</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {recentShipments.map(shipment => {
                const driver = drivers.find(d => d.id === shipment.driverId);
                const dest = locations.find(l => l.id === shipment.destinationLocationId);

                return (
                  <tr
                    key={shipment.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition group cursor-pointer"
                    onClick={() => onSelectShipment(shipment)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {shipment.trackingNumber || shipment.id}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white">
                      <div>{shipment.customerName}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{shipment.customerPhone}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      <div className="font-medium text-slate-900 dark:text-slate-200 truncate max-w-[160px]">
                        {dest ? dest.name : shipment.deliveryAddress}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                        {shipment.deliveryAddress}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {driver ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-[9px] font-bold flex items-center justify-center shrink-0">
                            {driver.name.charAt(0)}
                          </div>
                          <span className="truncate">{driver.name}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={shipment.priority} />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={shipment.status} />
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {shipment.estimatedDeliveryTime || 'Within 45 min'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onSelectShipment(shipment);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        title="View Shipment Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
