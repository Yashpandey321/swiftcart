import React, { useState } from 'react';
import { 
  Layers, 
  Binary, 
  Hash, 
  ListOrdered, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  Search, 
  Database, 
  Grid3X3,
  Play,
  RotateCw,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { MinHeap } from '../dsa/PriorityQueue';
import { Queue } from '../dsa/Queue';
import { HashMap, LookupReport } from '../dsa/HashMap';
import { Vector } from '../dsa/Vector';
import { LinkedList } from '../dsa/LinkedList';
import { Stack } from '../dsa/Stack';
import { MergeSorter, MergeSortResult } from '../dsa/MergeSort';
import { WeightedGraph } from '../dsa/Graph';
import { Package, DeliveryHistoryItem, UndoAction } from '../types';

interface DsaVisualizerProps {
  urgentHeap: MinHeap<Package>;
  standardQueue: Queue<Package>;
  packageMap: HashMap<Package>;
  packageVector: Vector<Package>;
  deliveryHistory: LinkedList<DeliveryHistoryItem>;
  undoStack: Stack<UndoAction>;
  graph: WeightedGraph;
  packages: Package[];
  onDispatchUrgent: () => void;
  onDispatchStandard: () => void;
  onPopUndo: () => void;
}

type DsaTab = 'heap' | 'queue' | 'hashmap' | 'vector' | 'linkedlist' | 'stack' | 'mergesort' | 'graphrep';

export const DsaVisualizer: React.FC<DsaVisualizerProps> = ({
  urgentHeap,
  standardQueue,
  packageMap,
  packageVector,
  deliveryHistory,
  undoStack,
  graph,
  packages,
  onDispatchUrgent,
  onDispatchStandard,
  onPopUndo,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<DsaTab>('heap');

  // Hash Map search state
  const [searchKey, setSearchKey] = useState<string>('TRK-9011');
  const [lookupReport, setLookupReport] = useState<LookupReport<Package> | null>(null);

  // Merge Sort interactive state
  const [sortKey, setSortKey] = useState<'weightKg' | 'deadlineMinutes' | 'urgencyScore'>('weightKg');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [mergeSortResult, setMergeSortResult] = useState<MergeSortResult | null>(null);
  const [mergeStepIndex, setMergeStepIndex] = useState<number>(0);

  // Trigger interactive Hash Map test
  const handleHashLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchKey.trim()) return;
    const report = packageMap.lookup(searchKey.trim());
    setLookupReport(report);
  };

  // Run Merge Sort Trace
  const handleRunMergeSort = () => {
    const sorter = new MergeSorter();
    const sortableItems = packages.map(p => ({
      id: p.id,
      label: `${p.trackingCode} (${p.recipient})`,
      value: p[sortKey],
      meta: p,
    }));
    const res = sorter.sort(sortableItems, sortOrder === 'asc');
    setMergeSortResult(res);
    setMergeStepIndex(0);
  };

  const heapArray = urgentHeap.getHeapArray();
  const queueArray = standardQueue.toArray();
  const vectorBuffer = packageVector.getRawBuffer();
  const historyNodes = deliveryHistory.getNodes();
  const stackItems = undoStack.toArray();
  const hashMapBuckets = packageMap.getBuckets();
  const hashMapStats = packageMap.getStats();
  const adjacencyMatrix = graph.getAdjacencyMatrix();

  const tabs = [
    { id: 'heap' as DsaTab, label: 'Min-Heap (Priority Queue)', icon: Binary },
    { id: 'queue' as DsaTab, label: 'FIFO Queue (Pending)', icon: ListOrdered },
    { id: 'hashmap' as DsaTab, label: 'Hash Map (O(1) Lookup)', icon: Hash },
    { id: 'vector' as DsaTab, label: 'Dynamic Vector (Memory)', icon: Database },
    { id: 'linkedlist' as DsaTab, label: 'Linked List (History)', icon: Layers },
    { id: 'stack' as DsaTab, label: 'Undo Stack (LIFO)', icon: RotateCcw },
    { id: 'mergesort' as DsaTab, label: 'Merge Sort Lab', icon: Sparkles },
    { id: 'graphrep' as DsaTab, label: 'Adjacency Representations', icon: Grid3X3 },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden min-h-[720px]">
      {/* Visualizer Tab Navigation Bar */}
      <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between overflow-x-auto">
        <div className="flex items-center space-x-1.5 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Visualizer Stage */}
      <div className="p-6 flex-1 bg-slate-50/50 overflow-y-auto">
        {/* ============================================================ */}
        {/* TAB 1: MIN-HEAP / PRIORITY QUEUE                             */}
        {/* ============================================================ */}
        {activeSubTab === 'heap' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                  <Binary className="w-4 h-4 text-indigo-600" />
                  <span>Binary Min-Heap Priority Queue</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Stores urgent packages ordered by deadline/urgency score. Root has minimum urgency value (highest dispatch priority).
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={onDispatchUrgent}
                  disabled={urgentHeap.isEmpty()}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition flex items-center space-x-1.5 shadow-xs"
                >
                  <span>Extract Min (Dispatch Top Urgent)</span>
                </button>
              </div>
            </div>

            {/* Binary Tree Visual Representation */}
            <div className="bg-slate-900 rounded-xl p-6 text-white border border-slate-800 shadow-inner">
              <div className="text-xs font-mono text-slate-400 mb-4 flex justify-between">
                <span>TREE STRUCTURE (Binary Min-Heap)</span>
                <span>Heap Size: {heapArray.length} Nodes</span>
              </div>

              {heapArray.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No urgent packages in heap. Create an urgent package to populate.
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-6 py-4 overflow-x-auto">
                  {/* Layer 0: Root (Index 0) */}
                  <div className="flex justify-center">
                    <div className="p-3 bg-rose-950 border-2 border-rose-500 rounded-xl text-center shadow-lg min-w-[130px] animate-pulse">
                      <div className="text-[10px] text-rose-300 font-mono">ROOT [Idx 0]</div>
                      <div className="font-bold text-xs text-white">{heapArray[0]?.key}</div>
                      <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                        Urgency: {heapArray[0]?.priority}
                      </div>
                    </div>
                  </div>

                  {/* Layer 1: Indices 1, 2 */}
                  {heapArray.length > 1 && (
                    <div className="flex justify-center gap-12 sm:gap-24 relative">
                      {[1, 2].map((idx) => {
                        const node = heapArray[idx];
                        if (!node) return <div key={idx} className="w-[110px]" />;
                        return (
                          <div
                            key={idx}
                            className="p-2.5 bg-slate-800 border border-slate-600 rounded-lg text-center shadow-md min-w-[120px]"
                          >
                            <div className="text-[9px] text-slate-400 font-mono">CHILD [Idx {idx}]</div>
                            <div className="font-bold text-xs text-slate-100">{node.key}</div>
                            <div className="text-[10px] text-indigo-300 font-mono mt-0.5">
                              Urgency: {node.priority}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Layer 2: Indices 3, 4, 5, 6 */}
                  {heapArray.length > 3 && (
                    <div className="flex justify-center gap-4 sm:gap-8 flex-wrap">
                      {[3, 4, 5, 6].map((idx) => {
                        const node = heapArray[idx];
                        if (!node) return null;
                        return (
                          <div
                            key={idx}
                            className="p-2 bg-slate-850 border border-slate-700 rounded-lg text-center shadow-xs min-w-[100px]"
                          >
                            <div className="text-[8px] text-slate-500 font-mono">[Idx {idx}]</div>
                            <div className="font-semibold text-[11px] text-slate-200">{node.key}</div>
                            <div className="text-[9px] text-slate-400 font-mono">U: {node.priority}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Array Backing Storage */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase text-slate-800 tracking-wider">
                  Contiguous Array Representation (Memory Buffer)
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  Parent(i) = ⌊(i-1)/2⌋ • Left(i) = 2i+1 • Right(i) = 2i+2
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {heapArray.map((node, i) => (
                  <div
                    key={i}
                    className={`border rounded-lg p-2 text-center min-w-[90px] font-mono text-xs ${
                      i === 0
                        ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="text-[9px] text-slate-400 font-semibold mb-0.5">Index [{i}]</div>
                    <div className="truncate font-semibold">{node.key}</div>
                    <div className="text-[10px] text-indigo-600 font-bold">score: {node.priority}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Heap Operation Trace Log */}
            <div className="bg-slate-900 text-slate-300 rounded-xl p-4 font-mono text-xs space-y-1.5 max-h-48 overflow-y-auto">
              <div className="text-[11px] text-slate-400 uppercase font-bold mb-2">
                Heapify Operation Trace Log (Recent Swaps):
              </div>
              {urgentHeap.operationLog.length === 0 ? (
                <div className="text-slate-500 italic text-[11px]">No heap operations yet.</div>
              ) : (
                urgentHeap.operationLog.slice(-8).map((log, i) => (
                  <div key={i} className="text-[11px] text-indigo-300">
                    › {log}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: FIFO QUEUE                                            */}
        {/* ============================================================ */}
        {activeSubTab === 'queue' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                  <ListOrdered className="w-4 h-4 text-blue-600" />
                  <span>Sequential FIFO Queue (Standard Shipments)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Maintains non-urgent packages in strict First-In, First-Out arrival order to guarantee fair processing without starvation.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={onDispatchStandard}
                  disabled={standardQueue.isEmpty()}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition flex items-center space-x-1.5 shadow-xs"
                >
                  <span>Dequeue (Dispatch Front)</span>
                </button>
              </div>
            </div>

            {/* Queue Conveyor Lane */}
            <div className="bg-slate-900 rounded-xl p-6 text-white border border-slate-800">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-rose-400 font-bold">HEAD (Next Out)</span>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4 text-slate-500" />
                  <span className="text-emerald-400 font-bold">TAIL (Last In)</span>
                </div>
              </div>

              {queueArray.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs font-mono">
                  Queue is currently empty.
                </div>
              ) : (
                <div className="flex items-center space-x-3 overflow-x-auto py-4">
                  {queueArray.map((pkg, idx) => (
                    <div
                      key={pkg.id}
                      className={`shrink-0 p-3.5 rounded-xl border text-center min-w-[150px] relative shadow-md transition ${
                        idx === 0
                          ? 'bg-rose-950/80 border-rose-500 ring-2 ring-rose-500/40'
                          : idx === queueArray.length - 1
                          ? 'bg-emerald-950/80 border-emerald-500'
                          : 'bg-slate-800 border-slate-700'
                      }`}
                    >
                      <div className="text-[10px] font-mono text-slate-400 mb-1">
                        {idx === 0 ? 'HEAD' : idx === queueArray.length - 1 ? 'TAIL' : `Position ${idx}`}
                      </div>
                      <div className="font-bold text-xs text-white">{pkg.trackingCode}</div>
                      <div className="text-[11px] text-slate-300 truncate max-w-[130px] mx-auto mt-0.5">
                        {pkg.recipient}
                      </div>
                      <div className="text-[10px] text-indigo-300 font-mono mt-1">
                        {pkg.weightKg} kg • {pkg.deadlineMinutes}m
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-white border border-slate-200 rounded-lg p-3">
                <span className="text-slate-500 block">Queue Length</span>
                <span className="font-mono text-lg font-bold text-slate-800">{standardQueue.size()}</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-3">
                <span className="text-slate-500 block">Head Element</span>
                <span className="font-mono text-sm font-semibold text-rose-600">
                  {standardQueue.peek()?.trackingCode || 'None'}
                </span>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-3">
                <span className="text-slate-500 block">Queue Invariant</span>
                <span className="text-slate-700 font-medium">Enqueue O(1) • Dequeue O(1)</span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: HASH MAP (SEPARATE CHAINING)                          */}
        {/* ============================================================ */}
        {activeSubTab === 'hashmap' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                  <Hash className="w-4 h-4 text-indigo-600" />
                  <span>Hash Map with Separate Chaining (O(1) Package Lookup)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Maps tracking codes to package records using DJB2 polynomial hashing modulo {hashMapStats.bucketCount} buckets.
                </p>
              </div>

              {/* Search Bar */}
              <form onSubmit={handleHashLookup} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                    placeholder="Enter Tracking Code (e.g. TRK-9011)"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 uppercase font-mono font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition"
                >
                  Lookup Key (Inspect Hashing)
                </button>
              </form>

              {/* Lookup Result Instrument */}
              {lookupReport && (
                <div className={`p-3 rounded-lg border text-xs font-mono ${
                  lookupReport.found ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}>
                  <div className="flex items-center space-x-2 font-bold mb-1">
                    {lookupReport.found ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                    )}
                    <span>{lookupReport.found ? 'Key Found in Hash Map' : 'Key Not Found'}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed mb-2">{lookupReport.explanation}</p>
                  {lookupReport.value && (
                    <div className="bg-white/80 p-2 rounded border border-emerald-300 text-[11px] text-slate-800 flex flex-wrap gap-4">
                      <span>Recipient: <strong>{lookupReport.value.recipient}</strong></span>
                      <span>Weight: <strong>{lookupReport.value.weightKg} kg</strong></span>
                      <span>Priority: <strong>{lookupReport.value.priority}</strong></span>
                      <span>Status: <strong>{lookupReport.value.status}</strong></span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Hash Buckets Visual Grid */}
            <div className="bg-slate-900 rounded-xl p-5 text-white border border-slate-800 space-y-4">
              <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                <span>HASH BUCKET ARRAY (Capacity: {hashMapStats.bucketCount})</span>
                <span>Load Factor: {hashMapStats.loadFactor.toFixed(2)} • Collisions: {hashMapStats.collisionCount}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {hashMapBuckets.map((bucket) => {
                  const isQueriedBucket = lookupReport?.bucketIndex === bucket.index;
                  return (
                    <div
                      key={bucket.index}
                      className={`border rounded-lg p-3 transition ${
                        isQueriedBucket
                          ? 'bg-indigo-950/80 border-indigo-400 ring-2 ring-indigo-500/50'
                          : 'bg-slate-800/80 border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] font-mono mb-2">
                        <span className="font-bold text-indigo-300">BUCKET [{bucket.index}]</span>
                        <span className="text-slate-400">
                          {bucket.entries.length === 0 ? 'Empty' : `${bucket.entries.length} chained`}
                        </span>
                      </div>

                      {bucket.entries.length === 0 ? (
                        <div className="text-[11px] text-slate-600 font-mono italic">null</div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
                          {bucket.entries.map((entry, idx) => (
                            <React.Fragment key={entry.key}>
                              <span className="px-2 py-1 bg-slate-900 border border-slate-600 rounded text-slate-200 text-[11px]">
                                {entry.key}
                              </span>
                              {idx < bucket.entries.length - 1 && (
                                <span className="text-slate-500 text-[10px]">→</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: DYNAMIC VECTOR (CONTIGUOUS MEMORY)                    */}
        {/* ============================================================ */}
        {activeSubTab === 'vector' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <Database className="w-4 h-4 text-emerald-600" />
                <span>Dynamic Vector / Resizable Array Modeling</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Packages are indexed in a contiguous memory block. When size exceeds current capacity, capacity doubles (geometric factor x2) to maintain amortized O(1) push time.
              </p>
            </div>

            {/* Memory Capacity Bar */}
            <div className="bg-slate-900 rounded-xl p-5 text-white border border-slate-800 space-y-4">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>CONTIGUOUS MEMORY SLOTS</span>
                <span>
                  Size: {packageVector.size()} / Capacity: {packageVector.capacity()} (
                  {(packageVector.loadFactor() * 100).toFixed(0)}% Utilized)
                </span>
              </div>

              {/* Visual Memory Blocks */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {vectorBuffer.map((item, idx) => {
                  const isOccupied = item !== null;
                  return (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border text-center font-mono text-xs transition ${
                        isOccupied
                          ? 'bg-emerald-950/80 border-emerald-600 text-emerald-200'
                          : 'bg-slate-800/40 border-dashed border-slate-700 text-slate-500'
                      }`}
                    >
                      <div className="text-[9px] text-slate-400 mb-0.5">[{idx}]</div>
                      <div className="font-bold truncate text-[11px]">
                        {isOccupied ? item.trackingCode : 'EMPTY'}
                      </div>
                      <div className="text-[9px] text-slate-400 truncate mt-0.5">
                        {isOccupied ? `${item.weightKg}kg` : 'Reserved'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reallocation History */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
              <span className="font-bold text-xs uppercase text-slate-800 tracking-wider">
                Geometric Reallocation History Log (Doubling Factor x2)
              </span>
              {packageVector.reallocationHistory.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No resizing events triggered yet (within initial capacity).</p>
              ) : (
                <div className="space-y-1 text-xs font-mono">
                  {packageVector.reallocationHistory.map((event, i) => (
                    <div key={i} className="p-2 bg-slate-50 rounded border border-slate-200 text-slate-700 flex justify-between">
                      <span>Resized from capacity {event.oldCapacity} → {event.newCapacity} slots</span>
                      <span className="text-slate-500">Triggered at count: {event.triggerElementCount}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 5: DOUBLY LINKED LIST                                    */}
        {/* ============================================================ */}
        {activeSubTab === 'linkedlist' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <Layers className="w-4 h-4 text-purple-600" />
                <span>Doubly Linked List (Delivery History Audit Trail)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Maintains completed deliveries as chained nodes with bidirectional pointer links (prev & next), guaranteeing O(1) history append and chronological traversal.
              </p>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 text-white border border-slate-800">
              <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-4">
                <span>HEAD POINTER</span>
                <span>Total Delivered: {historyNodes.length} Nodes</span>
                <span>TAIL POINTER</span>
              </div>

              {historyNodes.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs font-mono">
                  No completed deliveries yet. Dispatch packages to generate history log.
                </div>
              ) : (
                <div className="flex items-center space-x-2 overflow-x-auto py-4">
                  {historyNodes.map((node, idx) => (
                    <React.Fragment key={node.id}>
                      <div className="shrink-0 p-3.5 bg-slate-800 border border-slate-700 rounded-xl min-w-[170px] shadow-md">
                        <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                          <span>Node #{idx + 1}</span>
                          <span className="text-indigo-400">{node.data.vehicleName}</span>
                        </div>
                        <div className="font-bold text-xs text-white">{node.data.trackingCode}</div>
                        <div className="text-[11px] text-slate-300 truncate mt-0.5">
                          {node.data.recipient}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-1">
                          {node.data.fromLocationName} → {node.data.toLocationName}
                        </div>
                        <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                          {node.data.distanceKm} km • {node.data.timeTakenMinutes} min
                        </div>
                      </div>

                      {idx < historyNodes.length - 1 && (
                        <div className="shrink-0 text-indigo-400 font-mono text-sm px-1">
                          ⇄
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 6: UNDO STACK                                            */}
        {/* ============================================================ */}
        {activeSubTab === 'stack' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                  <RotateCcw className="w-4 h-4 text-amber-600" />
                  <span>LIFO Stack (Multi-Level Undo Mechanism)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Last-In, First-Out stack captures recent user actions (Package Created, Dispatched, Roads Added). Popping reverses the top action.
                </p>
              </div>
              <button
                onClick={onPopUndo}
                disabled={undoStack.isEmpty()}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition flex items-center space-x-1.5 shadow-xs"
              >
                <span>Pop Stack (Execute Undo)</span>
              </button>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 text-white border border-slate-800">
              <div className="text-xs font-mono text-slate-400 mb-4 flex justify-between">
                <span>STACK FRAMES (Top of Stack is First)</span>
                <span>Depth: {stackItems.length} Frames</span>
              </div>

              {stackItems.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs font-mono">
                  Stack is empty. Perform an action to push a frame.
                </div>
              ) : (
                <div className="space-y-2 max-w-xl mx-auto">
                  {stackItems.map((action, idx) => (
                    <div
                      key={action.id}
                      className={`p-3 rounded-lg border flex items-center justify-between transition ${
                        idx === 0
                          ? 'bg-amber-950/80 border-amber-500 ring-2 ring-amber-500/40'
                          : 'bg-slate-800 border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-300">
                            {idx === 0 ? 'TOP' : `FRAME [${stackItems.length - 1 - idx}]`}
                          </span>
                          <span className="font-bold text-xs text-slate-100">{action.type}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{action.description}</div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        {new Date(action.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 7: MERGE SORT LAB                                        */}
        {/* ============================================================ */}
        {activeSubTab === 'mergesort' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Merge Sort Trace & Divide-and-Conquer Visualizer</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Guaranteed O(N log N) sorting with stability. Divides the package array recursively in halves, then merges sorted sub-arrays.
                </p>
              </div>

              {/* Sort Controls */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-slate-700">Sort By:</span>
                  <select
                    value={sortKey}
                    onChange={(e) => setSortKey(e.target.value as any)}
                    className="border border-slate-300 rounded-lg px-2.5 py-1 text-xs"
                  >
                    <option value="weightKg">Package Weight (kg)</option>
                    <option value="deadlineMinutes">Deadline Time (min)</option>
                    <option value="urgencyScore">Urgency Score</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-slate-700">Order:</span>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as any)}
                    className="border border-slate-300 rounded-lg px-2.5 py-1 text-xs"
                  >
                    <option value="asc">Ascending (Low to High)</option>
                    <option value="desc">Descending (High to Low)</option>
                  </select>
                </div>

                <button
                  onClick={handleRunMergeSort}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition"
                >
                  Execute Merge Sort Trace
                </button>
              </div>
            </div>

            {/* Merge Sort Trace Visualizer */}
            {mergeSortResult && mergeSortResult.steps.length > 0 && (
              <div className="bg-slate-900 rounded-xl p-5 text-white border border-slate-800 space-y-4">
                <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                  <span>
                    STEP {mergeStepIndex + 1} / {mergeSortResult.steps.length} (
                    {mergeSortResult.steps[mergeStepIndex]?.phase.toUpperCase()})
                  </span>
                  <span>
                    Comparisons: {mergeSortResult.comparisonsCount} • Max Tree Depth: {mergeSortResult.recursionDepth}
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max={mergeSortResult.steps.length - 1}
                  value={mergeStepIndex}
                  onChange={(e) => setMergeStepIndex(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />

                <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 text-xs">
                  <p className="font-semibold text-indigo-300 mb-1">
                    {mergeSortResult.steps[mergeStepIndex]?.description}
                  </p>
                </div>

                {/* Sub-arrays split/merge visualization */}
                <div className="space-y-3">
                  <span className="text-[11px] font-mono text-slate-400 uppercase block">
                    Current Array Snapshot:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {mergeSortResult.steps[mergeStepIndex]?.arraySnapshot.map((item, i) => (
                      <div
                        key={i}
                        className="p-2 bg-slate-800 border border-slate-700 rounded text-center min-w-[90px] font-mono text-xs"
                      >
                        <div className="text-[9px] text-slate-400 truncate">{item.label}</div>
                        <div className="font-bold text-indigo-300 text-sm">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 8: ADJACENCY REPRESENTATIONS                             */}
        {/* ============================================================ */}
        {activeSubTab === 'graphrep' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <Grid3X3 className="w-4 h-4 text-slate-700" />
                <span>Adjacency Matrix & Adjacency List Representations</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Demonstrates how the road network graph is maintained in dual representations for optimal algorithm performance.
              </p>
            </div>

            {/* Adjacency Matrix Table */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
              <span className="font-bold text-xs uppercase text-slate-800 tracking-wider">
                Adjacency Matrix (V × V Road Distance in km)
              </span>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs font-mono border-collapse">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border p-2 text-left">Node</th>
                      {adjacencyMatrix.headers.map((h, i) => (
                        <th key={i} className="border p-2 text-center text-slate-700">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {adjacencyMatrix.matrix.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="border p-2 font-bold bg-slate-100">
                          {adjacencyMatrix.headers[i]}
                        </td>
                        {row.map((val, j) => (
                          <td
                            key={j}
                            className={`border p-2 text-center ${
                              i === j
                                ? 'bg-slate-200/50 font-bold text-slate-400'
                                : val !== null
                                ? 'bg-emerald-50 text-emerald-800 font-bold'
                                : 'text-slate-300'
                            }`}
                          >
                            {val !== null ? `${val}` : '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Adjacency List */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
              <span className="font-bold text-xs uppercase text-slate-800 tracking-wider">
                Adjacency List (Map of Linked Neighbors)
              </span>
              <div className="space-y-2">
                {Array.from(graph.adjacencyList.entries()).map(([nodeId, edges]) => {
                  const node = graph.nodes.get(nodeId);
                  return (
                    <div
                      key={nodeId}
                      className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center space-x-3 text-xs"
                    >
                      <span className="font-bold font-mono text-slate-900 min-w-[70px]">
                        {node?.code}:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {edges.length === 0 ? (
                          <span className="text-slate-400 italic">No outgoing roads</span>
                        ) : (
                          edges.map((e, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-white border border-slate-300 font-mono text-[11px] text-slate-700"
                            >
                              → {graph.nodes.get(e.to)?.code} ({e.distanceKm}km)
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
