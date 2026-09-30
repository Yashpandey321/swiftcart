import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Leaf, 
  Fuel, 
  DollarSign, 
  Activity, 
  Truck, 
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Award,
  Zap,
  Flame
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import { Shipment, Vehicle, Driver } from '../../types';

interface AnalyticsViewProps {
  shipments: Shipment[];
  vehicles: Vehicle[];
  drivers: Driver[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  shipments,
  vehicles,
  drivers,
}) => {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  // Time Series mock telemetry data
  const deliveriesOverTime = [
    { label: 'Mon', completed: 18, delayed: 1 },
    { label: 'Tue', completed: 24, delayed: 2 },
    { label: 'Wed', completed: 29, delayed: 1 },
    { label: 'Thu', completed: 35, delayed: 3 },
    { label: 'Fri', completed: 42, delayed: 2 },
    { label: 'Sat', completed: 38, delayed: 1 },
    { label: 'Sun', completed: 26, delayed: 0 },
  ];

  // Status breakdown
  const statusData = [
    { name: 'Delivered', value: shipments.filter(s => s.status === 'delivered').length || 18, color: '#10B981' },
    { name: 'In Transit', value: shipments.filter(s => s.status === 'in_transit' || s.status === 'out_for_delivery').length || 8, color: '#3B82F6' },
    { name: 'Pending/Sorting', value: shipments.filter(s => s.status === 'pending' || s.status === 'assigned').length || 6, color: '#F59E0B' },
    { name: 'Delayed', value: 2, color: '#EF4444' },
  ];

  // Priority Breakdown
  const priorityData = [
    { priority: 'Standard', count: shipments.filter(s => s.priority === 'standard').length || 15, color: '#64748B' },
    { priority: 'Express', count: shipments.filter(s => s.priority === 'express').length || 10, color: '#3B82F6' },
    { priority: 'Urgent', count: shipments.filter(s => s.priority === 'urgent').length || 7, color: '#F43F5E' },
  ];

  // Peak Delivery Hours
  const peakHoursData = [
    { hour: '08:00', volume: 12 },
    { hour: '10:00', volume: 28 },
    { hour: '12:00', volume: 45 },
    { hour: '14:00', volume: 38 },
    { hour: '16:00', volume: 42 },
    { hour: '18:00', volume: 30 },
    { hour: '20:00', volume: 14 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Delivery Analytics & Intelligence</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Fleet efficiency, service level agreement (SLA) on-time rates, and cost telemetry
          </p>
        </div>

        {/* Timeframe Toggle: daily / weekly / monthly */}
        <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
          {(['daily', 'weekly', 'monthly'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg capitalize transition ${
                timeframe === tf
                  ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Total Deliveries</span>
          <span className="text-xl font-bold text-slate-900 dark:text-white">182</span>
          <span className="text-[11px] font-semibold text-emerald-600 block mt-0.5">+14% vs last week</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">On-Time Rate</span>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">94.8%</span>
          <span className="text-[11px] text-slate-400 block mt-0.5">Target: 95.0%</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Avg Delivery Time</span>
          <span className="text-xl font-bold text-slate-900 dark:text-white">42 mins</span>
          <span className="text-[11px] font-semibold text-emerald-600 block mt-0.5">-6 mins faster</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Cost per Drop</span>
          <span className="text-xl font-bold text-slate-900 dark:text-white">$4.20</span>
          <span className="text-[11px] font-semibold text-emerald-600 block mt-0.5">-8.4% saved</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Fuel Efficiency</span>
          <span className="text-xl font-bold text-amber-600 dark:text-amber-400">8.2 km/L</span>
          <span className="text-[11px] text-slate-400 block mt-0.5">Eco standard</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Fleet Utilization</span>
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">86%</span>
          <span className="text-[11px] text-slate-400 block mt-0.5">Optimal capacity</span>
        </div>
      </div>

      {/* 3. Charts: Deliveries Over Time & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Deliveries Over Time (Line / Area Chart) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Deliveries Over Time</h2>
              <p className="text-xs text-slate-400">Daily throughput across distribution network</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={deliveriesOverTime}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false} />
                <XAxis dataKey="label" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Area type="monotone" dataKey="completed" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCompleted)" name="Completed Drops" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown (Donut Chart) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Delivery Status Breakdown</h2>
            <p className="text-xs text-slate-400">Active distribution lifecycle status</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {statusData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 dark:text-slate-400 truncate">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Priority Breakdown & Peak Delivery Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Deliveries by Priority */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Deliveries by Priority</h2>
            <p className="text-xs text-slate-400">SLA volume tiers (Urgent vs Express vs Standard)</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false} />
                <XAxis dataKey="priority" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Peak Delivery Hours */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Peak Dispatch Windows</h2>
            <p className="text-xs text-slate-400">Hourly delivery distribution throughout the day</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false} />
                <XAxis dataKey="hour" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="volume" fill="#10B981" radius={[6, 6, 0, 0]} name="Packages" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 5. Driver Performance Ranking */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Top Driver Performance Leaderboard</h2>
            <p className="text-xs text-slate-400">Evaluated on on-time delivery rate, safety score, and completed deliveries</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold uppercase text-slate-400">
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Courier Name</th>
                <th className="py-2.5 px-3">Completed Drops</th>
                <th className="py-2.5 px-3">On-Time Rate</th>
                <th className="py-2.5 px-3">Customer Rating</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {[...drivers].sort((a, b) => b.onTimeRatePercent - a.onTimeRatePercent).map((driver, index) => (
                <tr key={driver.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-bold text-slate-400">#{index + 1}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-[10px]">
                      {driver.name.charAt(0)}
                    </div>
                    <span>{driver.name}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                    {driver.completedDeliveriesCount} packages
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400">
                    {driver.onTimeRatePercent}%
                  </td>
                  <td className="py-3 px-3 font-medium text-amber-500">
                    {driver.rating.toFixed(1)} ★
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      Top Performer
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
