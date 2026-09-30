import React, { useState } from 'react';
import { 
  X, 
  Package as PackageIcon, 
  MapPin, 
  Clock, 
  Scale, 
  User, 
  Phone, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  Printer, 
  Send,
  Navigation,
  FileText,
  Calendar,
  Building2,
  DollarSign
} from 'lucide-react';
import { 
  Shipment, 
  DeliveryLocation, 
  Vehicle, 
  Driver, 
  DeliveryStatus 
} from '../../types';
import { StatusBadge, PriorityBadge } from './Badges';
import { useToast } from './Toast';

interface ShipmentDetailsDrawerProps {
  shipment: Shipment | null;
  onClose: () => void;
  locations: DeliveryLocation[];
  vehicles: Vehicle[];
  drivers: Driver[];
  onUpdateStatus: (shipmentId: string, status: DeliveryStatus) => void;
  onAssignDriver?: (shipmentId: string, driverId: string) => void;
}

export const ShipmentDetailsDrawer: React.FC<ShipmentDetailsDrawerProps> = ({
  shipment,
  onClose,
  locations,
  vehicles,
  drivers,
  onUpdateStatus,
  onAssignDriver,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'tracking' | 'package' | 'customer' | 'actions'>('overview');

  if (!shipment) return null;

  const originLoc = locations.find(l => l.id === shipment.originLocationId);
  const destLoc = locations.find(l => l.id === shipment.destinationLocationId);
  const driver = drivers.find(d => d.id === shipment.driverId);
  const vehicle = vehicles.find(v => v.id === shipment.vehicleId);

  // Status progression
  const statusOrder: DeliveryStatus[] = ['pending', 'assigned', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'];
  const currentStepIndex = statusOrder.indexOf(shipment.status);

  const trackingSteps = [
    { title: 'Order Created', location: originLoc?.name || 'Origin Hub', time: new Date(shipment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'pending' as DeliveryStatus },
    { title: 'Driver Assigned', location: originLoc?.name || 'Dispatch Bay', time: driver ? '10 mins later' : 'Pending', status: 'assigned' as DeliveryStatus },
    { title: 'Package Picked Up', location: originLoc?.name || 'Sort Facility', time: 'En route to hub', status: 'picked_up' as DeliveryStatus },
    { title: 'In Transit', location: 'Active Freight Corridor', time: 'Live GPS stream', status: 'in_transit' as DeliveryStatus },
    { title: 'Out for Delivery', location: destLoc?.name || 'Destination Zone', time: shipment.estimatedDeliveryTime || 'Within 45 min', status: 'out_for_delivery' as DeliveryStatus },
    { title: 'Delivered', location: shipment.deliveryAddress, time: shipment.status === 'delivered' ? 'Completed' : 'Estimated soon', status: 'delivered' as DeliveryStatus },
  ];

  const handleStatusChange = (status: DeliveryStatus) => {
    onUpdateStatus(shipment.id, status);
    showToast('success', 'Status Updated', `Shipment ${shipment.trackingNumber || shipment.id} updated to ${status}.`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-2xs animate-in fade-in-50 duration-150 flex justify-end">
      <div 
        onClick={onClose}
        className="flex-1" 
      />

      <div className="w-full max-w-xl bg-white dark:bg-slate-900 h-full border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right-8 duration-200">
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-base font-bold text-blue-600 dark:text-blue-400">
                {shipment.trackingNumber || shipment.id}
              </span>
              <PriorityBadge priority={shipment.priority} />
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={shipment.status} />
              <span className="text-xs text-slate-400">
                Created {new Date(shipment.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4 text-xs font-semibold overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'tracking', label: 'Tracking History' },
            { id: 'package', label: 'Package Info' },
            { id: 'customer', label: 'Customer Info' },
            { id: 'actions', label: 'Actions' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 border-b-2 transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Drawer Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-600 dark:text-slate-300">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5 animate-in fade-in-50 duration-150">
              {/* Route Path summary card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Transit Corridor</span>
                  <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                    ETA: {shipment.estimatedDeliveryTime || '45 min'}
                  </span>
                </div>

                <div className="space-y-3 relative pl-6 border-l-2 border-slate-200 dark:border-slate-700 ml-2">
                  <div className="relative">
                    <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-600 border-2 border-white dark:border-slate-900" />
                    <div className="font-semibold text-slate-900 dark:text-white">
                      Origin: {originLoc?.name || 'Main Distribution Hub'}
                    </div>
                    <div className="text-[11px] text-slate-400">{originLoc?.address || 'Origin facility'}</div>
                  </div>

                  <div className="relative pt-2">
                    <span className="absolute -left-[31px] top-2 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white dark:border-slate-900" />
                    <div className="font-semibold text-slate-900 dark:text-white">
                      Destination: {destLoc?.name || 'Customer Address'}
                    </div>
                    <div className="text-[11px] text-slate-400">{shipment.deliveryAddress}</div>
                  </div>
                </div>
              </div>

              {/* Assignment info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block mb-1">
                    Assigned Driver
                  </span>
                  {driver ? (
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{driver.name}</div>
                      <div className="text-[11px] text-slate-400">{driver.phone}</div>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">Unassigned</span>
                  )}
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block mb-1">
                    Assigned Vehicle
                  </span>
                  {vehicle ? (
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{vehicle.id} • {vehicle.model}</div>
                      <div className="text-[11px] font-mono text-slate-400">{vehicle.plateNumber}</div>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">Unassigned</span>
                  )}
                </div>
              </div>

              {/* Package Notes */}
              {shipment.notes && (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60">
                  <span className="font-bold text-amber-800 dark:text-amber-300 block mb-0.5">Special Instructions:</span>
                  <p className="text-amber-900 dark:text-amber-200 text-xs">{shipment.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TRACKING TIMELINE */}
          {activeTab === 'tracking' && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <div className="font-bold text-slate-900 dark:text-white text-sm mb-2">Live Progress Log</div>
              <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-700 ml-2 space-y-6">
                {trackingSteps.map((step, idx) => {
                  const stepOrderIdx = statusOrder.indexOf(step.status);
                  const isDone = currentStepIndex >= stepOrderIdx;
                  const isCurrent = currentStepIndex === stepOrderIdx;

                  return (
                    <div key={idx} className="relative">
                      <span
                        className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${
                          isCurrent
                            ? 'bg-blue-600 ring-4 ring-blue-500/20'
                            : isDone
                            ? 'bg-emerald-500'
                            : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      />
                      <div className="flex items-center justify-between">
                        <span className={`font-semibold ${isDone ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                          {step.title}
                        </span>
                        <span className="text-[10px] text-slate-400">{step.time}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {step.location}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: PACKAGE INFO */}
          {activeTab === 'package' && (
            <div className="space-y-3 animate-in fade-in-50 duration-150">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Weight</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{shipment.weightKg} kg</span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Package Type</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white capitalize">{shipment.packageType || 'Parcel'}</span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Dimensions</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {shipment.dimensions ? `${shipment.dimensions.length}×${shipment.dimensions.width}×${shipment.dimensions.height} cm` : 'Standard box'}
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Declared Value</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">${shipment.declaredValue || 120}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOMER INFO */}
          {activeTab === 'customer' && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white">Sender Account</div>
                <div>Name: <span className="font-semibold text-slate-900 dark:text-white">{shipment.customerName}</span></div>
                <div>Contact: <span className="text-slate-700 dark:text-slate-300">{shipment.customerPhone}</span></div>
                <div>Email: <span className="text-slate-700 dark:text-slate-300">{shipment.customerEmail || 'dispatch@customer.com'}</span></div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white">Recipient Address</div>
                <div>Recipient: <span className="font-semibold text-slate-900 dark:text-white">{shipment.recipientName || 'Authorized Receiver'}</span></div>
                <div>Phone: <span className="text-slate-700 dark:text-slate-300">{shipment.recipientPhone || 'On file'}</span></div>
                <div>Delivery Location: <span className="text-slate-700 dark:text-slate-300">{shipment.deliveryAddress}</span></div>
              </div>
            </div>
          )}

          {/* TAB 5: ACTIONS */}
          {activeTab === 'actions' && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <div className="font-bold text-slate-900 dark:text-white">Dispatch Operations</div>
              <div className="space-y-2">
                <button
                  onClick={() => handleStatusChange('in_transit')}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold transition"
                >
                  <span>Dispatch (Mark In Transit)</span>
                  <Truck className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleStatusChange('out_for_delivery')}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300 font-semibold transition"
                >
                  <span>Mark Out for Delivery</span>
                  <Send className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleStatusChange('delivered')}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-semibold transition"
                >
                  <span>Confirm Successful Delivery</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    showToast('info', 'Print Dispatch Label', `Shipping label printed for ${shipment.trackingNumber || shipment.id}.`);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold transition"
                >
                  <span>Print Dispatch Bill & Barcode</span>
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2 bg-slate-50 dark:bg-slate-950/40">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
