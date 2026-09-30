import React, { useState } from 'react';
import { 
  ListOrdered, 
  ArrowRight, 
  Plus, 
  Minus, 
  Eye, 
  RotateCcw, 
  Clock, 
  Scale, 
  MapPin, 
  Sparkles, 
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Queue } from '../../dsa/Queue';
import { Package, DeliveryLocation } from '../../types';

interface DeliveryQueueViewProps {
  standardQueue: Queue<Package>;
  locations: DeliveryLocation[];
  onEnqueue: (pkg: Package) => void;
  onDequeue: () => Package | null;
  onClear: () => void;
  allPackages: Package[];
  onSelectPackage: (pkg: Package) => void;
}

export const DeliveryQueueView: React.FC<DeliveryQueueViewProps> = ({
  standardQueue,
  locations,
  onEnqueue,
  onDequeue,
  onClear,
  allPackages,
  onSelectPackage,
}) => {
  const [highlightFront, setHighlightFront] = useState(false);
  const [operationLogs, setOperationLogs] = useState<string[]>([
    'Queue initialized with FIFO discipline.',
  ]);

  const queueItems = standardQueue.toArray();
  const frontItem = standardQueue.peek();
  const rearItem = queueItems.length > 0 ? queueItems[queueItems.length - 1] : null;

  const logOperation = (msg: string) => {
    setOperationLogs(prev => [msg, ...prev.slice(0, 7)]);
  };

  const handleDequeue = () => {
    const dequeued = onDequeue();
    if (dequeued) {
      logOperation(`DEQUEUE: Removed "${dequeued.trackingCode}" (${dequeued.recipient}) from FRONT.`);
    } else {
      logOperation('DEQUEUE FAILED: Queue is currently empty underflow.');
    }
  };

  const handlePeek = () => {
    if (frontItem) {
      setHighlightFront(true);
      logOperation(`PEEK: Front element inspected -> "${frontItem.trackingCode}" (${frontItem.recipient}).`);
      setTimeout(() => setHighlightFront(false), 2000);
    } else {
      logOperation('PEEK: Queue is empty.');
    }
  };

  const handleQuickEnqueue = () => {
    const unqueued = allPackages.find(p => !queueItems.some(q => q.id === p.id) && p.status !== 'delivered');
    if (unqueued) {
      onEnqueue(unqueued);
      logOperation(`ENQUEUE: Pushed "${unqueued.trackingCode}" to REAR.`);
    } else {
      // Create synthetic quick package
      const newPkg: Package = {
        id: `pkg-${Date.now()}`,
        trackingCode: `PKG-${Math.floor(1000 + Math.random() * 9000)}`,
        recipient: 'Metro Express Parcel',
        sourceLocationId: locations[0]?.id || 'loc-1',
        destinationLocationId: locations[2]?.id || 'loc-3',
        weightKg: 3.8,
        priority: 'standard',
        urgencyScore: 90,
        deadlineMinutes: 180,
        createdAt: Date.now(),
        status: 'in-queue',
      };
      onEnqueue(newPkg);
      logOperation(`ENQUEUE: Generated and pushed "${newPkg.trackingCode}" to REAR.`);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-blue-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ListOrdered className="w-4 h-4" />
            <span>FIRST-IN, FIRST-OUT (FIFO) DISCIPLINE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Delivery Queue Visualizer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Standard delivery shipments are strictly queued in sequential arrival order
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleQuickEnqueue}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs active:scale-95 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Enqueue (Push)</span>
          </button>

          <button
            onClick={handleDequeue}
            disabled={queueItems.length === 0}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs active:scale-95 transition"
          >
            <Minus className="w-4 h-4" />
            <span>Dequeue (Shift)</span>
          </button>

          <button
            onClick={handlePeek}
            disabled={queueItems.length === 0}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <Eye className="w-4 h-4" />
            <span>Peek Front</span>
          </button>

          <button
            onClick={() => {
              onClear();
              logOperation('CLEAR: Purged all queue elements.');
            }}
            disabled={queueItems.length === 0}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 text-xs font-semibold hover:bg-rose-100 transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Main Visualizer Stage + Side Inspection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Queue Pipeline Stage (2 cols) */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Queue Memory Pipeline
              </h3>
              <p className="text-xs text-slate-500">Elements exit from FRONT and enter at REAR</p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-mono">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">FRONT [Index 0]</span>
              <span className="text-slate-400">→</span>
              <span className="text-blue-600 dark:text-cyan-400 font-bold">REAR [Index {Math.max(0, queueItems.length - 1)}]</span>
            </div>
          </div>

          {/* Horizontal Queue Pipeline */}
          <div className="min-h-[220px] py-6 overflow-x-auto flex items-center space-x-3 px-2">
            {/* FRONT INDICATOR */}
            <div className="shrink-0 flex flex-col items-center">
              <span className="px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white shadow-xs">
                FRONT
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-1 font-bold">EXIT</span>
            </div>

            {queueItems.length === 0 ? (
              <div className="flex-1 py-12 text-center text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <ListOrdered className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-bold">Queue is currently empty</p>
                <p className="text-[11px] text-slate-400">Click &quot;Enqueue (Push)&quot; to add packages</p>
              </div>
            ) : (
              queueItems.map((pkg, idx) => {
                const isFront = idx === 0;
                const isRear = idx === queueItems.length - 1;
                const source = locations.find(l => l.id === pkg.sourceLocationId);
                const dest = locations.find(l => l.id === pkg.destinationLocationId);

                return (
                  <React.Fragment key={pkg.id}>
                    <div
                      onClick={() => onSelectPackage(pkg)}
                      className={`shrink-0 w-52 p-4 rounded-2xl border transition-all cursor-pointer group hover:scale-105 ${
                        isFront && highlightFront
                          ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 shadow-lg ring-2 ring-amber-400'
                          : isFront
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/80 shadow-sm'
                          : isRear
                          ? 'bg-cyan-50/70 dark:bg-cyan-950/30 border-cyan-300 dark:border-cyan-800/80'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-2">
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {pkg.trackingCode}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          #{idx}
                        </span>
                      </div>

                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {pkg.recipient}
                      </p>

                      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[10px] text-slate-500 dark:text-slate-400 space-y-1">
                        <div className="flex items-center justify-between">
                          <span>Route:</span>
                          <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                            {source?.code || 'SRC'} → {dest?.code || 'DST'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Deadline:</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{pkg.deadlineMinutes}m</span>
                        </div>
                      </div>
                    </div>

                    {/* Arrow between nodes */}
                    {idx < queueItems.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </React.Fragment>
                );
              })
            )}

            {/* REAR INDICATOR */}
            <div className="shrink-0 flex flex-col items-center">
              <span className="px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-xs">
                REAR
              </span>
              <span className="text-[10px] text-blue-600 dark:text-cyan-400 font-mono mt-1 font-bold">ENTRY</span>
            </div>
          </div>

          {/* Complexity Capsule */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Enqueue</span>
              <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">O(1)</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Dequeue</span>
              <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">O(1)</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Space</span>
              <span className="font-mono font-black text-blue-600 dark:text-cyan-400">O(N)</span>
            </div>
          </div>
        </div>

        {/* Side Panel: Metadata & Operation Log (1 col) */}
        <div className="space-y-6">
          {/* Status Overview Card */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Queue State Telemetry
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                <span className="text-xs text-slate-500">Queue Length (Size)</span>
                <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                  {queueItems.length}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Front Element (Next to dispatch)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">FRONT</span>
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {frontItem ? `${frontItem.trackingCode} — ${frontItem.recipient}` : 'None (Empty)'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Rear Element (Most recent entry)</span>
                  <span className="text-blue-600 dark:text-cyan-400 font-bold">REAR</span>
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {rearItem ? `${rearItem.trackingCode} — ${rearItem.recipient}` : 'None (Empty)'}
                </p>
              </div>
            </div>
          </div>

          {/* Operation History Console */}
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 text-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400 font-bold">LATEST QUEUE OPERATIONS</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div className="space-y-1.5 font-mono text-[11px] text-slate-300 max-h-48 overflow-y-auto">
              {operationLogs.map((log, i) => (
                <div key={i} className="flex items-start space-x-2 py-0.5 border-b border-slate-800/60">
                  <span className="text-slate-500">&gt;</span>
                  <span className="leading-tight">{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
