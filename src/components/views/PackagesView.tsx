import React, { useState, useMemo } from 'react';
import { 
  Package as PackageIcon, 
  Plus, 
  Download, 
  Upload, 
  Search, 
  Filter, 
  MoreVertical, 
  MapPin, 
  Clock, 
  Scale, 
  Truck, 
  Trash2, 
  Eye, 
  Navigation, 
  CheckCircle2, 
  SlidersHorizontal,
  ChevronDown,
  ArrowUpDown
} from 'lucide-react';
import { Package, DeliveryLocation, Vehicle, PackagePriority, PackageStatus } from '../../types';

interface PackagesViewProps {
  packages: Package[];
  locations: DeliveryLocation[];
  vehicles: Vehicle[];
  onOpenAddModal: () => void;
  onSelectPackage: (pkg: Package) => void;
  onDeletePackage: (pkgId: string) => void;
  onOptimizeRoute: (sourceId: string, destId: string) => void;
  onImportPresets: () => void;
  onUpdateStatus: (pkgId: string, status: PackageStatus) => void;
}

export const PackagesView: React.FC<PackagesViewProps> = ({
  packages,
  locations,
  vehicles,
  onOpenAddModal,
  onSelectPackage,
  onDeletePackage,
  onOptimizeRoute,
  onImportPresets,
  onUpdateStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [vehicleFilter, setVehicleFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'deadline' | 'weight' | 'tracking'>('priority');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Selected packages checkboxes for bulk actions
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filter & sort logic
  const filteredPackages = useMemo(() => {
    return packages
      .filter(pkg => {
        const matchesQuery = 
          pkg.trackingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pkg.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (pkg.customerContact && pkg.customerContact.includes(searchQuery));
        
        const matchesStatus = statusFilter === 'all' || pkg.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || pkg.priority === priorityFilter;
        const matchesVehicle = vehicleFilter === 'all' || 
          (vehicleFilter === 'unassigned' ? !pkg.assignedVehicleId : pkg.assignedVehicleId === vehicleFilter);
        const matchesLocation = locationFilter === 'all' || 
          pkg.sourceLocationId === locationFilter || pkg.destinationLocationId === locationFilter;

        return matchesQuery && matchesStatus && matchesPriority && matchesVehicle && matchesLocation;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === 'priority') {
          diff = a.urgencyScore - b.urgencyScore;
        } else if (sortBy === 'deadline') {
          diff = a.deadlineMinutes - b.deadlineMinutes;
        } else if (sortBy === 'weight') {
          diff = a.weightKg - b.weightKg;
        } else if (sortBy === 'tracking') {
          diff = a.trackingCode.localeCompare(b.trackingCode);
        }
        return sortDirection === 'asc' ? diff : -diff;
      });
  }, [packages, searchQuery, statusFilter, priorityFilter, vehicleFilter, locationFilter, sortBy, sortDirection]);

  // Handle Export to JSON
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(packages, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `delivery-packages-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Toggle selection
  const handleToggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredPackages.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredPackages.map(p => p.id)));
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedIds.size} selected packages?`)) {
      selectedIds.forEach(id => onDeletePackage(id));
      setSelectedIds(new Set());
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Package Registry & Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Array / Vector stored records with constant-time HashMap index & Heap prioritization
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onImportPresets}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs transition"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Load Presets</span>
          </button>

          <button
            onClick={handleExportJson}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-md shadow-blue-500/20 active:scale-95 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Package</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by tracking code (e.g. PKG-1024), customer..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
            >
              <option value="all">All Lifecycle Statuses</option>
              <option value="pending">Pending (Heap)</option>
              <option value="in-queue">In-Queue (FIFO)</option>
              <option value="in-transit">In Transit</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="urgent">Urgent</option>
              <option value="express">Express</option>
              <option value="standard">Standard</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex space-x-1">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-l-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
            >
              <option value="priority">Sort: Urgency</option>
              <option value="deadline">Sort: Deadline</option>
              <option value="weight">Sort: Weight</option>
              <option value="tracking">Sort: Tracking ID</option>
            </select>
            <button
              onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="px-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-l-0 border-slate-200 dark:border-slate-700 rounded-r-xl text-slate-600 dark:text-slate-300 transition"
              title="Toggle Sort Direction"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Secondary Filters Bar */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 gap-2">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5">
              <span>Carrier:</span>
              <select
                value={vehicleFilter}
                onChange={e => setVehicleFilter(e.target.value)}
                className="bg-transparent font-semibold text-slate-900 dark:text-white focus:outline-hidden"
              >
                <option value="all">All Vehicles</option>
                <option value="unassigned">Unassigned</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-1.5">
              <span>Node:</span>
              <select
                value={locationFilter}
                onChange={e => setLocationFilter(e.target.value)}
                className="bg-transparent font-semibold text-slate-900 dark:text-white focus:outline-hidden"
              >
                <option value="all">All Nodes</option>
                {locations.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-[11px] font-mono">
            Showing <strong>{filteredPackages.length}</strong> of <strong>{packages.length}</strong> shipments
          </div>
        </div>
      </div>

      {/* Bulk Action Toolbar if items selected */}
      {selectedIds.size > 0 && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 rounded-xl flex items-center justify-between animate-in fade-in duration-100">
          <span className="text-xs font-bold text-blue-900 dark:text-blue-200">
            {selectedIds.size} package(s) selected
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleBulkDelete}
              className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected</span>
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Package Table Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.size > 0 && selectedIds.size === filteredPackages.length}
                    onChange={handleSelectAll}
                    className="rounded text-blue-600 accent-blue-600 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">Package ID</th>
                <th className="py-3.5 px-4">Recipient</th>
                <th className="py-3.5 px-4">Origin → Destination</th>
                <th className="py-3.5 px-4">Weight</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Deadline</th>
                <th className="py-3.5 px-4">Vehicle</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredPackages.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    <PackageIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-semibold">No packages found matching filter criteria</p>
                    <p className="text-xs text-slate-400 mt-1">Try relaxing search terms or add a new shipment</p>
                  </td>
                </tr>
              ) : (
                filteredPackages.map(pkg => {
                  const source = locations.find(l => l.id === pkg.sourceLocationId);
                  const dest = locations.find(l => l.id === pkg.destinationLocationId);
                  const vehicle = vehicles.find(v => v.id === pkg.assignedVehicleId);
                  const isChecked = selectedIds.has(pkg.id);

                  return (
                    <tr 
                      key={pkg.id} 
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition cursor-pointer ${
                        isChecked ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-center" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(pkg.id)}
                          className="rounded text-blue-600 accent-blue-600 cursor-pointer"
                        />
                      </td>

                      {/* ID */}
                      <td 
                        className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white"
                        onClick={() => onSelectPackage(pkg)}
                      >
                        {pkg.trackingCode}
                      </td>

                      {/* Recipient */}
                      <td className="py-3 px-4" onClick={() => onSelectPackage(pkg)}>
                        <div className="font-bold text-slate-900 dark:text-white">{pkg.recipient}</div>
                        {pkg.customerContact && (
                          <div className="text-[10px] text-slate-400">{pkg.customerContact}</div>
                        )}
                      </td>

                      {/* Origin -> Destination */}
                      <td className="py-3 px-4" onClick={() => onSelectPackage(pkg)}>
                        <div className="flex items-center space-x-1.5 font-medium">
                          <span className="text-blue-600 dark:text-blue-400">{source?.code || 'SRC'}</span>
                          <span className="text-slate-400">→</span>
                          <span className="text-rose-600 dark:text-rose-400">{dest?.code || 'DST'}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                          {dest?.name || 'Destination'}
                        </div>
                      </td>

                      {/* Weight */}
                      <td className="py-3 px-4 font-mono" onClick={() => onSelectPackage(pkg)}>
                        {pkg.weightKg} kg
                      </td>

                      {/* Priority */}
                      <td className="py-3 px-4" onClick={() => onSelectPackage(pkg)}>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          pkg.priority === 'critical' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' :
                          pkg.priority === 'urgent' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' :
                          pkg.priority === 'express' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' :
                          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {pkg.priority}
                        </span>
                      </td>

                      {/* Deadline */}
                      <td className="py-3 px-4 font-mono" onClick={() => onSelectPackage(pkg)}>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{pkg.deadlineMinutes}m</span>
                        </div>
                      </td>

                      {/* Vehicle */}
                      <td className="py-3 px-4" onClick={() => onSelectPackage(pkg)}>
                        {vehicle ? (
                          <div className="text-slate-800 dark:text-slate-200 font-semibold truncate max-w-[100px]">
                            {vehicle.name}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4" onClick={() => onSelectPackage(pkg)}>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          pkg.status === 'delivered' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' :
                          pkg.status === 'in-transit' ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300' :
                          pkg.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' :
                          'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {pkg.status}
                        </span>
                      </td>

                      {/* Actions Menu */}
                      <td className="py-3 px-4 text-right relative" onClick={e => e.stopPropagation()}>
                        <div className="inline-flex items-center space-x-1">
                          <button
                            onClick={() => onSelectPackage(pkg)}
                            title="Inspect Details"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onOptimizeRoute(pkg.sourceLocationId, pkg.destinationLocationId)}
                            title="Find Dijkstra Shortest Route"
                            className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition"
                          >
                            <Navigation className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeletePackage(pkg.id)}
                            title="Delete"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
