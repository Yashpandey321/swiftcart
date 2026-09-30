import React, { useState, useMemo } from 'react';
import { 
  History, 
  ArrowLeft, 
  ArrowRight, 
  Search, 
  ArrowUpDown, 
  Download, 
  CheckCircle2, 
  Clock, 
  Navigation, 
  Sparkles, 
  Layers, 
  Scale, 
  Truck,
  RotateCcw,
  Zap,
  Info
} from 'lucide-react';
import { DoublyLinkedList } from '../../dsa/DoublyLinkedList';
import { DeliveryRecord, DeliveryLocation, Vehicle } from '../../types';
import { mergeSort } from '../../dsa/MergeSort';

interface DeliveryHistoryViewProps {
  historyList: DoublyLinkedList<DeliveryRecord>;
  locations: DeliveryLocation[];
  vehicles: Vehicle[];
}

export const DeliveryHistoryView: React.FC<DeliveryHistoryViewProps> = ({
  historyList,
  locations,
  vehicles,
}) => {
  const [currentNodeIndex, setCurrentNodeIndex] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'timestamp' | 'distance' | 'time' | 'tracking'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'linear' | 'binary'>('linear');
  const [searchStats, setSearchStats] = useState<{ comparisons: number; timeMs: number; found: boolean } | null>(null);

  const rawHistory = historyList.toArray();

  // Merge Sort applied dynamically
  const sortedHistory = useMemo(() => {
    let comparator: (a: DeliveryRecord, b: DeliveryRecord) => number;

    if (sortBy === 'timestamp') {
      comparator = (a, b) => a.timestamp - b.timestamp;
    } else if (sortBy === 'distance') {
      comparator = (a, b) => a.totalDistanceKm - b.totalDistanceKm;
    } else if (sortBy === 'time') {
      comparator = (a, b) => a.totalTimeMinutes - b.totalTimeMinutes;
    } else {
      comparator = (a, b) => a.packageId.localeCompare(b.packageId);
    }

    const sorted = mergeSort(rawHistory, comparator);
    return sortOrder === 'asc' ? sorted : sorted.reverse();
  }, [rawHistory, sortBy, sortOrder]);

  // Execute Search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchStats(null);
      return;
    }

    const startTime = performance.now();
    let comparisons = 0;
    let found = false;

    if (searchMode === 'linear') {
      for (let i = 0; i < sortedHistory.length; i++) {
        comparisons++;
        if (sortedHistory[i].packageId.toLowerCase().includes(searchQuery.toLowerCase())) {
          found = true;
          setCurrentNodeIndex(i);
          break;
        }
      }
    } else {
      // Binary search requires strictly sorted by packageId
      const sortedByPkg = [...sortedHistory].sort((a, b) => a.packageId.localeCompare(b.packageId));
      let low = 0;
      let high = sortedByPkg.length - 1;
      const target = searchQuery.toUpperCase();

      while (low <= high) {
        comparisons++;
        const mid = Math.floor((low + high) / 2);
        if (sortedByPkg[mid].packageId === target) {
          found = true;
          const origIdx = sortedHistory.findIndex(h => h.id === sortedByPkg[mid].id);
          if (origIdx !== -1) setCurrentNodeIndex(origIdx);
          break;
        } else if (sortedByPkg[mid].packageId < target) {
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }
    }

    const elapsed = performance.now() - startTime;
    setSearchStats({ comparisons, timeMs: Number(elapsed.toFixed(3)), found });
  };

  // CSV Export
  const handleExportCsv = () => {
    const headers = ['RecordID', 'PackageID', 'Source', 'Destination', 'VehicleID', 'DistanceKm', 'TimeMin', 'Timestamp'];
    const rows = sortedHistory.map(r => [
      r.id,
      r.packageId,
      r.sourceLocationId,
      r.destinationLocationId,
      r.vehicleId,
      r.totalDistanceKm,
      r.totalTimeMinutes,
      new Date(r.timestamp).toISOString()
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `delivery_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const currentNode = sortedHistory[currentNodeIndex] || null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-blue-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <History className="w-4 h-4" />
            <span>DOUBLY LINKED LIST + DIVIDE-AND-CONQUER SORT</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Delivery History & Audit Log
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Immutable log chain maintained as a Doubly Linked List with $O(N \log N)$ Merge Sort
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Doubly Linked List Interactive Pipeline */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Doubly Linked List Memory Chain
            </h3>
            <p className="text-xs text-slate-500">Each node points to both PREV and NEXT nodes with bidirection pointer traversal</p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentNodeIndex(0)}
              disabled={currentNodeIndex === 0}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold disabled:opacity-40"
            >
              Head
            </button>
            <button
              onClick={() => setCurrentNodeIndex(prev => Math.max(0, prev - 1))}
              disabled={currentNodeIndex === 0}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold disabled:opacity-40"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-xs text-slate-600 dark:text-slate-300 font-bold px-2">
              Node {currentNodeIndex + 1} of {sortedHistory.length}
            </span>
            <button
              onClick={() => setCurrentNodeIndex(prev => Math.min(sortedHistory.length - 1, prev + 1))}
              disabled={currentNodeIndex >= sortedHistory.length - 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold disabled:opacity-40"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCurrentNodeIndex(sortedHistory.length - 1)}
              disabled={currentNodeIndex >= sortedHistory.length - 1}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold disabled:opacity-40"
            >
              Tail
            </button>
          </div>
        </div>

        {/* Visual Chain representation */}
        <div className="flex items-center space-x-3 overflow-x-auto py-4 px-2">
          <span className="text-[11px] font-mono font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded shrink-0">
            NULL &larr;
          </span>

          {sortedHistory.map((item, idx) => {
            const isSelected = idx === currentNodeIndex;
            const src = locations.find(l => l.id === item.sourceLocationId);
            const dst = locations.find(l => l.id === item.destinationLocationId);

            return (
              <React.Fragment key={item.id}>
                <div
                  onClick={() => setCurrentNodeIndex(idx)}
                  className={`w-48 p-3 rounded-2xl border transition-all cursor-pointer shrink-0 shadow-2xs ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 ring-2 ring-blue-400/40 shadow-md'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-blue-300'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mb-1">
                    <span className="font-bold text-blue-600 dark:text-cyan-400">{item.packageId}</span>
                    <span>#{idx}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {src?.code || 'SRC'} → {dst?.code || 'DST'}
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[10px] text-slate-500 dark:text-slate-400 flex justify-between font-mono">
                    <span>{item.totalDistanceKm} km</span>
                    <span>{item.totalTimeMinutes}m</span>
                  </div>
                </div>

                {idx < sortedHistory.length - 1 && (
                  <span className="text-slate-400 font-mono font-bold shrink-0">&harr;</span>
                )}
              </React.Fragment>
            );
          })}

          <span className="text-[11px] font-mono font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded shrink-0">
            &rarr; NULL
          </span>
        </div>
      </div>

      {/* Sorting & Search Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Merge Sort Panel */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase">
              <Sparkles className="w-4 h-4" />
              <span>MERGE SORT (DIVIDE & CONQUER)</span>
            </div>
            <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">O(N log N) Stable</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Sort Key</label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="timestamp">Delivery Timestamp</option>
                <option value="distance">Distance (km)</option>
                <option value="time">Transit Time (min)</option>
                <option value="tracking">Package ID</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Order</label>
              <div className="flex space-x-1">
                <button
                  onClick={() => setSortOrder('asc')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                    sortOrder === 'asc' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                  }`}
                >
                  Ascending
                </button>
                <button
                  onClick={() => setSortOrder('desc')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                    sortOrder === 'desc' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                  }`}
                >
                  Descending
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Binary vs Linear Search Panel */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase">
              <Search className="w-4 h-4" />
              <span>SEARCH COMPLEXITY LAB</span>
            </div>
            <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 text-xs font-bold">
              <button
                onClick={() => setSearchMode('linear')}
                className={`px-2 py-0.5 rounded ${searchMode === 'linear' ? 'bg-white dark:bg-slate-900 text-blue-600' : 'text-slate-400'}`}
              >
                Linear O(N)
              </button>
              <button
                onClick={() => setSearchMode('binary')}
                className={`px-2 py-0.5 rounded ${searchMode === 'binary' ? 'bg-white dark:bg-slate-900 text-blue-600' : 'text-slate-400'}`}
              >
                Binary O(log N)
              </button>
            </div>
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter Package ID (e.g. PKG-1001)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition"
            >
              Search
            </button>
          </div>

          {searchStats && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300">
                Found: <strong>{searchStats.found ? 'Yes' : 'No'}</strong> • Comparisons: <strong>{searchStats.comparisons}</strong>
              </span>
              <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">{searchStats.timeMs} ms</span>
            </div>
          )}
        </div>
      </div>

      {/* History Records Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Comprehensive Delivery History Ledger ({sortedHistory.length} entries)
          </h3>
          <span className="text-xs font-mono text-slate-400">Sorted by {sortBy} ({sortOrder})</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Package</th>
                <th className="py-3 px-4">Origin → Destination</th>
                <th className="py-3 px-4">Carrier</th>
                <th className="py-3 px-4">Distance</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Completion Date</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {sortedHistory.map(item => {
                const src = locations.find(l => l.id === item.sourceLocationId);
                const dst = locations.find(l => l.id === item.destinationLocationId);
                const veh = vehicles.find(v => v.id === item.vehicleId);

                return (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {item.packageId}
                    </td>
                    <td className="py-3 px-4">
                      {src?.name || item.sourceLocationId} → {dst?.name || item.destinationLocationId}
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      {veh?.name || item.vehicleId}
                    </td>
                    <td className="py-3 px-4 font-mono">{item.totalDistanceKm} km</td>
                    <td className="py-3 px-4 font-mono">{item.totalTimeMinutes} min</td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(item.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        SUCCESSFUL
                      </span>
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
