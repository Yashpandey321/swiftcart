import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Send, 
  ArrowUpDown, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Scale, 
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { Package, DeliveryLocation, PackagePriority } from '../types';
import { MergeSorter } from '../dsa/MergeSort';

interface PackageManagerProps {
  packages: Package[];
  locations: DeliveryLocation[];
  onAddPackage: (pkg: Omit<Package, 'id' | 'createdAt' | 'status'>) => void;
  onDeletePackage: (id: string) => void;
  onDispatchPackage: (pkgId: string) => void;
  onTogglePriority: (pkgId: string) => void;
}

export const PackageManager: React.FC<PackageManagerProps> = ({
  packages,
  locations,
  onAddPackage,
  onDeletePackage,
  onDispatchPackage,
  onTogglePriority,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sort state using Merge Sort
  const [sortBy, setSortBy] = useState<'weightKg' | 'deadlineMinutes' | 'createdAt' | 'urgencyScore'>('createdAt');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [mergeSortInfo, setMergeSortInfo] = useState<string | null>(null);

  // Form state
  const [recipient, setRecipient] = useState('');
  const [sourceId, setSourceId] = useState(locations[0]?.id || '');
  const [destId, setDestId] = useState(locations[1]?.id || '');
  const [weightKg, setWeightKg] = useState(5.0);
  const [priority, setPriority] = useState<PackagePriority>('standard');
  const [deadlineMinutes, setDeadlineMinutes] = useState(120);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim() || !sourceId || !destId) return;

    const trackingCode = `TRK-${Math.floor(1000 + Math.random() * 9000)}`;
    const urgencyScore = priority === 'urgent' 
      ? Math.max(5, Math.floor(deadlineMinutes / 4)) 
      : Math.floor(deadlineMinutes / 2) + 50;

    onAddPackage({
      trackingCode,
      recipient: recipient.trim(),
      sourceLocationId: sourceId,
      destinationLocationId: destId,
      weightKg: Number(weightKg),
      priority,
      urgencyScore,
      deadlineMinutes: Number(deadlineMinutes),
    });

    setIsModalOpen(false);
    setRecipient('');
  };

  // Perform Merge Sort on packages
  const handleSortChange = (key: 'weightKg' | 'deadlineMinutes' | 'createdAt' | 'urgencyScore') => {
    const newAsc = sortBy === key ? !sortAsc : true;
    setSortBy(key);
    setSortAsc(newAsc);

    const sorter = new MergeSorter();
    const sortable = packages.map(p => ({
      id: p.id,
      label: p.trackingCode,
      value: p[key],
      meta: p,
    }));
    const res = sorter.sort(sortable, newAsc);
    setMergeSortInfo(
      `Sorted ${packages.length} packages by ${key} via Merge Sort in ${res.comparisonsCount} comparisons (Depth: ${res.recursionDepth})`
    );
  };

  // Filter packages
  const filteredPackages = [...packages].filter(p => {
    if (filterPriority !== 'all' && p.priority !== filterPriority) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTrack = p.trackingCode.toLowerCase().includes(q);
      const matchRecip = p.recipient.toLowerCase().includes(q);
      if (!matchTrack && !matchRecip) return false;
    }
    return true;
  });

  // Sort according to current Merge Sort configuration
  filteredPackages.sort((a, b) => {
    const valA = a[sortBy];
    const valB = b[sortBy];
    return sortAsc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
  });

  const getLocationName = (id: string) => {
    return locations.find(l => l.id === id)?.name || id;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
      {/* Header Controls */}
      <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
        <div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <span>Package Registry</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
              Vector Buffer: {packages.length} Items
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Indexed in contiguous Vector storage. Sortable with Merge Sort and indexed in Hash Map.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition flex items-center space-x-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Package</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by tracking code or recipient..."
            className="w-full text-xs border border-slate-200 rounded-md px-2 py-1 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 text-slate-600">
            <Filter className="w-3 h-3 text-slate-400" />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="border border-slate-200 rounded px-2 py-1 text-xs"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent Only (Min-Heap)</option>
              <option value="standard">Standard Only (FIFO)</option>
            </select>
          </div>

          <div className="flex items-center space-x-1 text-slate-600">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-slate-200 rounded px-2 py-1 text-xs"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-queue">In-Queue</option>
              <option value="dispatched">Dispatched</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Merge Sort Banner notification */}
      {mergeSortInfo && (
        <div className="bg-indigo-50 px-4 py-1.5 border-b border-indigo-100 text-[11px] text-indigo-800 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>{mergeSortInfo}</span>
          </div>
          <button
            onClick={() => setMergeSortInfo(null)}
            className="text-indigo-400 hover:text-indigo-700 font-bold ml-2"
          >
            ×
          </button>
        </div>
      )}

      {/* Packages Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-semibold">
            <tr>
              <th className="px-4 py-2.5">Idx</th>
              <th className="px-4 py-2.5">Tracking Code</th>
              <th className="px-4 py-2.5">Recipient</th>
              <th className="px-4 py-2.5">Origin → Destination</th>
              <th 
                className="px-4 py-2.5 cursor-pointer hover:text-indigo-600 transition"
                onClick={() => handleSortChange('weightKg')}
              >
                <div className="flex items-center space-x-1">
                  <span>Weight (kg)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th 
                className="px-4 py-2.5 cursor-pointer hover:text-indigo-600 transition"
                onClick={() => handleSortChange('urgencyScore')}
              >
                <div className="flex items-center space-x-1">
                  <span>Priority & Heap Score</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th 
                className="px-4 py-2.5 cursor-pointer hover:text-indigo-600 transition"
                onClick={() => handleSortChange('deadlineMinutes')}
              >
                <div className="flex items-center space-x-1">
                  <span>Deadline</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredPackages.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-slate-400">
                  No packages match the criteria. Create one above.
                </td>
              </tr>
            ) : (
              filteredPackages.map((pkg, idx) => (
                <tr key={pkg.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-4 py-3 font-mono text-slate-400 text-[11px]">
                    [{idx}]
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-slate-800">
                    {pkg.trackingCode}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {pkg.recipient}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <span className="font-semibold text-slate-800">{getLocationName(pkg.sourceLocationId)}</span>
                    <span className="mx-1 text-slate-400">→</span>
                    <span className="font-semibold text-slate-800">{getLocationName(pkg.destinationLocationId)}</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-700">
                    {pkg.weightKg} kg
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => onTogglePriority(pkg.id)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition ${
                          pkg.priority === 'urgent'
                            ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                        title="Click to toggle Priority"
                      >
                        {pkg.priority}
                      </button>
                      <span className="text-[10px] text-slate-400 font-mono">
                        (score: {pkg.urgencyScore})
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600">
                    {pkg.deadlineMinutes}m
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold capitalize ${
                        pkg.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : pkg.status === 'dispatched' || pkg.status === 'in-transit'
                          ? 'bg-blue-100 text-blue-800'
                          : pkg.priority === 'urgent'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {pkg.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      {pkg.status !== 'delivered' && (
                        <button
                          onClick={() => onDispatchPackage(pkg.id)}
                          className="p-1 rounded text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50"
                          title="Dispatch along Dijkstra Route"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => onDeletePackage(pkg.id)}
                        className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                        title="Delete Package"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE PACKAGE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-5 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Create New Package</h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Recipient / Client Name</label>
                <input
                  type="text"
                  required
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="e.g. Acme Robotics Lab"
                  className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Origin Node</label>
                  <select
                    value={sourceId}
                    onChange={(e) => setSourceId(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5"
                  >
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Destination Node</label>
                  <select
                    value={destId}
                    onChange={(e) => setDestId(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5"
                  >
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.2"
                    max="1000"
                    required
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseFloat(e.target.value) || 1)}
                    className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Deadline (minutes)</label>
                  <input
                    type="number"
                    min="15"
                    max="1440"
                    required
                    value={deadlineMinutes}
                    onChange={(e) => setDeadlineMinutes(parseInt(e.target.value) || 60)}
                    className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Priority Tier</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPriority('standard')}
                    className={`py-2 px-3 rounded-lg border text-center font-semibold transition ${
                      priority === 'standard'
                        ? 'bg-blue-50 border-blue-500 text-blue-800 ring-1 ring-blue-500'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Standard (FIFO Queue)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriority('urgent')}
                    className={`py-2 px-3 rounded-lg border text-center font-semibold transition ${
                      priority === 'urgent'
                        ? 'bg-rose-50 border-rose-500 text-rose-800 ring-1 ring-rose-500'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Urgent (Min-Heap)
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-xs"
                >
                  Enqueue Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
