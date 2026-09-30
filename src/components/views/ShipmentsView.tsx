import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  MoreVertical, 
  Eye, 
  Edit, 
  UserCheck, 
  Printer, 
  XCircle, 
  CheckSquare, 
  Square, 
  ArrowUpDown, 
  Truck, 
  Calendar,
  AlertCircle,
  FileSpreadsheet,
  Route
} from 'lucide-react';
import { 
  Shipment, 
  DeliveryLocation, 
  Driver, 
  Vehicle, 
  DeliveryStatus, 
  PriorityLevel 
} from '../../types';
import { StatusBadge, PriorityBadge } from '../common/Badges';
import { useToast } from '../common/Toast';

interface ShipmentsViewProps {
  shipments: Shipment[];
  locations: DeliveryLocation[];
  drivers: Driver[];
  vehicles: Vehicle[];
  onSelectShipment: (shipment: Shipment) => void;
  onCreateShipmentClick: () => void;
  onUpdateShipmentStatus: (shipmentId: string, status: DeliveryStatus) => void;
  onAssignDriver: (shipmentId: string, driverId: string) => void;
  onDeleteShipment?: (shipmentId: string) => void;
  onOptimizeSelected?: (shipmentIds: string[]) => void;
}

export const ShipmentsView: React.FC<ShipmentsViewProps> = ({
  shipments,
  locations,
  drivers,
  vehicles,
  onSelectShipment,
  onCreateShipmentClick,
  onUpdateShipmentStatus,
  onAssignDriver,
  onDeleteShipment,
  onOptimizeSelected,
}) => {
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedShipmentIds, setSelectedShipmentIds] = useState<string[]>([]);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  // Filtered shipments list
  const filteredShipments = useMemo(() => {
    return shipments.filter(s => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = s.id.toLowerCase().includes(q) || (s.trackingNumber && s.trackingNumber.toLowerCase().includes(q));
        const matchesCustomer = s.customerName.toLowerCase().includes(q);
        const matchesRecipient = (s.recipientName || '').toLowerCase().includes(q);
        const matchesAddress = s.deliveryAddress.toLowerCase().includes(q);
        if (!matchesId && !matchesCustomer && !matchesRecipient && !matchesAddress) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'all' && s.status !== statusFilter) {
        return false;
      }

      // Priority filter
      if (priorityFilter !== 'all' && s.priority !== priorityFilter) {
        return false;
      }

      return true;
    });
  }, [shipments, searchQuery, statusFilter, priorityFilter]);

  // Bulk selection handling
  const allSelected = filteredShipments.length > 0 && selectedShipmentIds.length === filteredShipments.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedShipmentIds([]);
    } else {
      setSelectedShipmentIds(filteredShipments.map(s => s.id));
    }
  };

  const toggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedShipmentIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Shipment ID', 'Tracking', 'Customer', 'Recipient', 'Address', 'Weight(kg)', 'Priority', 'Status', 'Driver', 'ETA'];
    const rows = filteredShipments.map(s => {
      const driver = drivers.find(d => d.id === s.driverId);
      return [
        s.id,
        s.trackingNumber || s.id,
        `"${s.customerName}"`,
        `"${s.recipientName || ''}"`,
        `"${s.deliveryAddress}"`,
        s.weightKg,
        s.priority,
        s.status,
        `"${driver?.name || 'Unassigned'}"`,
        `"${s.estimatedDeliveryTime || ''}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `swiftroute-shipments-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'Export Complete', `Exported ${filteredShipments.length} shipments to CSV.`);
  };

  const handleBulkStatusUpdate = (status: DeliveryStatus) => {
    selectedShipmentIds.forEach(id => onUpdateShipmentStatus(id, status));
    showToast('success', 'Status Updated', `Updated status for ${selectedShipmentIds.length} shipments to ${status}.`);
    setSelectedShipmentIds([]);
  };

  const handlePrintLabel = (shipment: Shipment, e: React.MouseEvent) => {
    e.stopPropagation();
    showToast('info', 'Print Dispatch Label', `Shipping label generated for ${shipment.trackingNumber || shipment.id}.`);
  };

  return (
    <div className="space-y-5 animate-in fade-in-50 duration-200">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Shipment Management</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor, assign, inspect, and dispatch shipments across your courier network
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onCreateShipmentClick}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition shadow-md shadow-blue-600/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Create Shipment</span>
          </button>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search shipment ID, customer, recipient, address..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-44">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="picked_up">Picked Up</option>
              <option value="in_transit">In Transit</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="delayed">Delayed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="w-full md:w-36">
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All Priorities</option>
              <option value="standard">Standard</option>
              <option value="express">Express</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Bar (when selected) */}
        {selectedShipmentIds.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 animate-in fade-in-50 duration-150 text-xs">
            <div className="flex items-center gap-2 text-blue-900 dark:text-blue-200 font-semibold">
              <span>{selectedShipmentIds.length} shipments selected</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkStatusUpdate('in_transit')}
                className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-2xs"
              >
                Mark In Transit
              </button>
              <button
                onClick={() => handleBulkStatusUpdate('delivered')}
                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-2xs"
              >
                Mark Delivered
              </button>
              {onOptimizeSelected && (
                <button
                  onClick={() => onOptimizeSelected(selectedShipmentIds)}
                  className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-2xs flex items-center gap-1"
                >
                  <Route className="w-3.5 h-3.5" />
                  Optimize Route
                </button>
              )}
              <button
                onClick={() => setSelectedShipmentIds([])}
                className="px-2.5 py-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Shipments Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-4 w-10">
                  <button onClick={toggleSelectAll} className="flex items-center">
                    {allSelected ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </th>
                <th className="py-3.5 px-4">Shipment ID</th>
                <th className="py-3.5 px-4">Sender / Customer</th>
                <th className="py-3.5 px-4">Recipient</th>
                <th className="py-3.5 px-4">Destination</th>
                <th className="py-3.5 px-4">Weight</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Driver</th>
                <th className="py-3.5 px-4">ETA</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredShipments.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400 text-xs">
                    No shipments found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredShipments.map(shipment => {
                  const isSelected = selectedShipmentIds.includes(shipment.id);
                  const driver = drivers.find(d => d.id === shipment.driverId);
                  const vehicle = vehicles.find(v => v.id === shipment.vehicleId);
                  const dest = locations.find(l => l.id === shipment.destinationLocationId);

                  return (
                    <tr
                      key={shipment.id}
                      onClick={() => onSelectShipment(shipment)}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition cursor-pointer ${
                        isSelected ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4" onClick={e => toggleSelectOne(shipment.id, e)}>
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {shipment.trackingNumber || shipment.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">{shipment.customerName}</div>
                        <div className="text-[10px] text-slate-400">{shipment.customerPhone}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {shipment.recipientName || 'Authorized Receiver'}
                        </div>
                        <div className="text-[10px] text-slate-400">{shipment.recipientPhone || 'On file'}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900 dark:text-slate-200 truncate max-w-[140px]">
                          {dest ? dest.name : shipment.deliveryAddress}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                          {shipment.deliveryAddress}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                        {shipment.weightKg} kg
                      </td>
                      <td className="py-3 px-4">
                        <PriorityBadge priority={shipment.priority} />
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={shipment.status} />
                      </td>
                      <td className="py-3 px-4">
                        {driver ? (
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-[9px] font-bold flex items-center justify-center shrink-0">
                              {driver.name.charAt(0)}
                            </div>
                            <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[110px]">
                              {driver.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {shipment.estimatedDeliveryTime || '45 mins'}
                      </td>
                      <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onSelectShipment(shipment)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={e => handlePrintLabel(shipment, e)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title="Print Label"
                          >
                            <Printer className="w-4 h-4" />
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

        {/* Table Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredShipments.length} of {shipments.length} shipments</span>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40" disabled>
              Previous
            </button>
            <span className="px-2 font-semibold text-slate-900 dark:text-white">1</span>
            <button className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
