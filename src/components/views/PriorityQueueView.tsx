import React, { useState } from 'react';
import { 
  Binary, 
  Plus, 
  Minus, 
  Eye, 
  RotateCcw, 
  Sparkles, 
  AlertTriangle, 
  Clock, 
  Scale, 
  ArrowDown, 
  ArrowUp,
  Info
} from 'lucide-react';
import { MinHeap } from '../../dsa/PriorityQueue';
import { Package, DeliveryLocation } from '../../types';

interface PriorityQueueViewProps {
  urgentHeap: MinHeap<Package>;
  locations: DeliveryLocation[];
  onInsert: (pkg: Package) => void;
  onExtractMin: () => Package | null;
  onResetHeap: () => void;
  allPackages: Package[];
  onSelectPackage: (pkg: Package) => void;
}

export const PriorityQueueView: React.FC<PriorityQueueViewProps> = ({
  urgentHeap,
  locations,
  onInsert,
  onExtractMin,
  onResetHeap,
  allPackages,
  onSelectPackage,
}) => {
  const [selectedHeapIndex, setSelectedHeapIndex] = useState<number | null>(null);
  const [heapLogs, setHeapLogs] = useState<string[]>([
    'Min-Heap initialized: Root satisfies Min-Heap Property (parent.score <= child.score).',
  ]);

  const heapArray = urgentHeap.getHeapArray();
  const rootItem = urgentHeap.peek();

  const addLog = (msg: string) => {
    setHeapLogs(prev => [msg, ...prev.slice(0, 8)]);
  };

  const handleExtractMin = () => {
    const extracted = onExtractMin();
    if (extracted) {
      addLog(`EXTRACT-MIN: Extracted Root "${extracted.trackingCode}" (Urgency: ${extracted.urgencyScore}). Sifted down replacement root.`);
    } else {
      addLog('EXTRACT-MIN FAILED: Heap is empty underflow.');
    }
  };

  const handlePeekMin = () => {
    if (rootItem) {
      setSelectedHeapIndex(0);
      addLog(`PEEK-MIN: Root node is "${rootItem.trackingCode}" with urgency score ${rootItem.urgencyScore}.`);
    } else {
      addLog('PEEK: Heap is empty.');
    }
  };

  const handleQuickInsert = () => {
    const available = allPackages.find(p => !heapArray.some(h => h.id === p.id) && p.status !== 'delivered');
    if (available) {
      onInsert(available);
      addLog(`INSERT: Pushed "${available.trackingCode}" (Score: ${available.urgencyScore}) at index ${heapArray.length}. Bubble-up / sifted up.`);
    } else {
      // Synthetic urgent package
      const randomDeadline = Math.floor(15 + Math.random() * 45);
      const synthetic: Package = {
        id: `pkg-urg-${Date.now()}`,
        trackingCode: `URG-${Math.floor(1000 + Math.random() * 9000)}`,
        recipient: 'Emergency Hospital Transplant',
        sourceLocationId: locations[0]?.id || 'loc-1',
        destinationLocationId: locations[6]?.id || 'loc-7',
        weightKg: 2.1,
        priority: 'critical',
        urgencyScore: randomDeadline,
        deadlineMinutes: randomDeadline,
        createdAt: Date.now(),
        status: 'pending',
      };
      onInsert(synthetic);
      addLog(`INSERT: Generated emergency parcel "${synthetic.trackingCode}" (Score: ${synthetic.urgencyScore}). Min-heap heapified.`);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Binary className="w-4 h-4" />
            <span>MIN-HEAP COMPLETE BINARY TREE ARCHITECTURE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Priority Queue & Min-Heap Visualizer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Urgent shipments dynamically maintained in binary tree heap ordered by deadline urgency
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleQuickInsert}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs active:scale-95 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Insert (Push)</span>
          </button>

          <button
            onClick={handleExtractMin}
            disabled={heapArray.length === 0}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs active:scale-95 transition"
          >
            <Minus className="w-4 h-4" />
            <span>Extract-Min (Root)</span>
          </button>

          <button
            onClick={handlePeekMin}
            disabled={heapArray.length === 0}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <Eye className="w-4 h-4" />
            <span>Peek Min Root</span>
          </button>

          <button
            onClick={() => {
              onResetHeap();
              addLog('RESET: Heap cleared.');
            }}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Heap Visualization: Binary Tree + Array Memory Representation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tree Canvas (2 cols) */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Binary Tree Heap Visualization
              </h3>
              <p className="text-xs text-slate-500">Root is guaranteed to hold the highest delivery urgency (Score: min)</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
              HEAP PROPERTY: PARENT ≤ CHILDREN
            </span>
          </div>

          {/* Render Tree Nodes */}
          <div className="min-h-[300px] flex items-center justify-center relative p-4 bg-slate-50/50 dark:bg-slate-950/30 rounded-2xl border border-slate-100 dark:border-slate-800">
            {heapArray.length === 0 ? (
              <div className="text-center text-slate-400 dark:text-slate-500">
                <Binary className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-bold">Min-Heap is currently empty</p>
                <p className="text-[11px] text-slate-400">Click &quot;Insert (Push)&quot; to add packages</p>
              </div>
            ) : (
              <div className="w-full max-w-lg space-y-8 text-center">
                {/* Level 0: Root */}
                {heapArray[0] && (
                  <div className="flex justify-center">
                    <div
                      onClick={() => onSelectPackage(heapArray[0])}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer shadow-md inline-block min-w-[150px] ${
                        selectedHeapIndex === 0
                          ? 'bg-rose-100 dark:bg-rose-950 border-rose-500 ring-2 ring-rose-500'
                          : 'bg-white dark:bg-slate-800 border-rose-400 dark:border-rose-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span className="font-bold text-rose-600 dark:text-rose-400">ROOT [0]</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          Score: {heapArray[0].urgencyScore}
                        </span>
                      </div>
                      <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                        {heapArray[0].trackingCode}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">{heapArray[0].recipient}</p>
                    </div>
                  </div>
                )}

                {/* Level 1: Left & Right children */}
                <div className="grid grid-cols-2 gap-8 relative before:absolute before:top-[-18px] before:left-1/4 before:right-1/4 before:h-0.5 before:bg-slate-300 dark:before:bg-slate-700">
                  {[1, 2].map(idx => {
                    const item = heapArray[idx];
                    if (!item) return <div key={idx} className="h-16" />;
                    return (
                      <div key={idx} className="flex justify-center">
                        <div
                          onClick={() => onSelectPackage(item)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer shadow-xs inline-block w-full max-w-[170px] ${
                            selectedHeapIndex === idx
                              ? 'bg-rose-100 dark:bg-rose-950 border-rose-500'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                            <span className="font-bold">Index [{idx}]</span>
                            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                              Score: {item.urgencyScore}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {item.trackingCode}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">{item.recipient}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Level 2: Children [3, 4, 5, 6] */}
                {heapArray.length > 3 && (
                  <div className="grid grid-cols-4 gap-2 pt-2">
                    {[3, 4, 5, 6].map(idx => {
                      const item = heapArray[idx];
                      if (!item) return <div key={idx} />;
                      return (
                        <div
                          key={idx}
                          onClick={() => onSelectPackage(item)}
                          className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left cursor-pointer hover:border-rose-400 shadow-2xs"
                        >
                          <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                            <span>[{idx}]</span>
                            <span>Sc:{item.urgencyScore}</span>
                          </div>
                          <p className="text-[10px] font-bold text-slate-900 dark:text-white truncate">
                            {item.trackingCode}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Array Buffer Representation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">Contiguous Array Buffer</span>
              <span className="text-[10px] font-mono text-slate-400">
                Parent: Math.floor((i - 1)/2) | Left: 2i + 1 | Right: 2i + 2
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 p-3 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs overflow-x-auto">
              {heapArray.length === 0 ? (
                <span className="text-slate-500 italic text-[11px]">Buffer is currently empty [ ]</span>
              ) : (
                heapArray.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedHeapIndex(idx);
                      onSelectPackage(item);
                    }}
                    className={`px-3 py-1.5 rounded-lg border text-center cursor-pointer transition ${
                      idx === 0
                        ? 'bg-rose-950/80 border-rose-500 text-rose-300 font-black'
                        : selectedHeapIndex === idx
                        ? 'bg-blue-950/80 border-blue-400 text-blue-200'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div className="text-[9px] text-slate-400">Idx {idx}</div>
                    <div className="font-bold">{item.trackingCode}</div>
                    <div className="text-[10px] text-cyan-400 font-bold">s:{item.urgencyScore}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Side Panel: Heap Math & Log Console (1 col) */}
        <div className="space-y-6">
          {/* Complexity Card */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Heap Complexity Benchmarks
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Insert (Push)</span>
                <span className="font-mono font-black text-rose-600 dark:text-rose-400 text-base">O(log N)</span>
                <p className="text-[10px] text-slate-500 mt-1">Sift-up traversal</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Extract-Min</span>
                <span className="font-mono font-black text-rose-600 dark:text-rose-400 text-base">O(log N)</span>
                <p className="text-[10px] text-slate-500 mt-1">Sift-down swap</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Peek Minimum</span>
                <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-base">O(1)</span>
                <p className="text-[10px] text-slate-500 mt-1">Direct array[0]</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Build Heap</span>
                <span className="font-mono font-black text-blue-600 dark:text-cyan-400 text-base">O(N)</span>
                <p className="text-[10px] text-slate-500 mt-1">Bottom-up heapify</p>
              </div>
            </div>
          </div>

          {/* Operation Console Logs */}
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 text-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-rose-400 font-bold">HEAPIFY OPERATION AUDIT</span>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            </div>

            <div className="space-y-1.5 font-mono text-[11px] text-slate-300 max-h-56 overflow-y-auto">
              {heapLogs.map((log, i) => (
                <div key={i} className="flex items-start space-x-2 py-0.5 border-b border-slate-800/60">
                  <span className="text-rose-500">&gt;</span>
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
