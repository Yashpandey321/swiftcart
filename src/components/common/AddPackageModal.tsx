import React, { useState } from 'react';
import { 
  X, 
  Package as PackageIcon, 
  Sparkles, 
  MapPin, 
  Clock, 
  Scale, 
  User, 
  Phone, 
  Truck, 
  AlertCircle 
} from 'lucide-react';
import { DeliveryLocation, Vehicle, PackagePriority, Package } from '../../types';

interface AddPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPackage: (pkg: Omit<Package, 'id' | 'createdAt'>) => void;
  locations: DeliveryLocation[];
  vehicles: Vehicle[];
}

export const AddPackageModal: React.FC<AddPackageModalProps> = ({
  isOpen,
  onClose,
  onAddPackage,
  locations,
  vehicles,
}) => {
  const [trackingCode, setTrackingCode] = useState(() => `PKG-${Math.floor(1000 + Math.random() * 9000)}`);
  const [recipient, setRecipient] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [sourceLocationId, setSourceLocationId] = useState(locations[0]?.id || '');
  const [destinationLocationId, setDestinationLocationId] = useState(locations[1]?.id || '');
  const [weightKg, setWeightKg] = useState<number>(3.5);
  const [priority, setPriority] = useState<PackagePriority>('urgent');
  const [deadlineMinutes, setDeadlineMinutes] = useState<number>(60);
  const [assignedVehicleId, setAssignedVehicleId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerateCode = () => {
    setTrackingCode(`PKG-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim()) {
      setError('Customer / Recipient name is required.');
      return;
    }
    if (!sourceLocationId || !destinationLocationId) {
      setError('Please choose valid pickup and delivery locations.');
      return;
    }
    if (sourceLocationId === destinationLocationId) {
      setError('Pickup and destination locations cannot be the same node.');
      return;
    }
    if (weightKg <= 0) {
      setError('Weight must be greater than 0 kg.');
      return;
    }
    if (deadlineMinutes <= 0) {
      setError('Deadline must be greater than 0 minutes.');
      return;
    }

    // Calculate initial urgencyScore based on deadline & priority
    let priorityMultiplier = 1.0;
    if (priority === 'critical') priorityMultiplier = 0.2;
    else if (priority === 'urgent') priorityMultiplier = 0.5;
    else if (priority === 'express') priorityMultiplier = 0.8;
    else if (priority === 'standard') priorityMultiplier = 1.2;
    else if (priority === 'low') priorityMultiplier = 1.8;

    const urgencyScore = Math.max(1, Math.round(deadlineMinutes * priorityMultiplier));

    onAddPackage({
      trackingCode: trackingCode.trim().toUpperCase(),
      recipient: recipient.trim(),
      customerContact: customerContact.trim() || undefined,
      sourceLocationId,
      destinationLocationId,
      weightKg: Number(weightKg.toFixed(1)),
      priority,
      urgencyScore,
      deadlineMinutes,
      status: priority === 'critical' || priority === 'urgent' ? 'pending' : 'in-queue',
      assignedVehicleId: assignedVehicleId || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div onClick={onClose} className="fixed inset-0 -z-10" />

      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <PackageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Register New Package</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Add shipment into DSA Queue or Min-Heap</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center space-x-2 text-rose-700 dark:text-rose-300 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Tracking ID & Auto-generator */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Package ID / Tracking Code
              </label>
              <div className="flex rounded-xl shadow-2xs">
                <input
                  type="text"
                  value={trackingCode}
                  onChange={e => setTrackingCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono font-bold rounded-l-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={handleGenerateCode}
                  className="px-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-r-xl border border-l-0 border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 transition"
                >
                  Regen
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Priority Tier
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as PackagePriority)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
              >
                <option value="critical">Critical (Min-Heap Priority #1)</option>
                <option value="urgent">Urgent (Min-Heap Priority #2)</option>
                <option value="express">Express (Fast Dispatch)</option>
                <option value="standard">Standard (FIFO Queue)</option>
                <option value="low">Low Priority (FIFO Queue)</option>
              </select>
            </div>
          </div>

          {/* Customer / Recipient & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Recipient / Business Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Apex Robotics Labs"
                  value={recipient}
                  onChange={e => {
                    setRecipient(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Customer Contact Phone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. +91 98765-43210"
                  value={customerContact}
                  onChange={e => setCustomerContact(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Pickup & Delivery Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Pickup Origin Hub
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-blue-500" />
                <select
                  value={sourceLocationId}
                  onChange={e => setSourceLocationId(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                >
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Destination Node
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-rose-500" />
                <select
                  value={destinationLocationId}
                  onChange={e => setDestinationLocationId(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                >
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Weight, Deadline & Vehicle Assignment */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Weight (kg)
              </label>
              <div className="relative">
                <Scale className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="1000"
                  value={weightKg}
                  onChange={e => setWeightKg(parseFloat(e.target.value) || 0)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Deadline (Minutes)
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="number"
                  step="5"
                  min="10"
                  max="720"
                  value={deadlineMinutes}
                  onChange={e => setDeadlineMinutes(parseInt(e.target.value) || 30)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Assign Vehicle (Opt.)
              </label>
              <div className="relative">
                <Truck className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <select
                  value={assignedVehicleId}
                  onChange={e => setAssignedVehicleId(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                >
                  <option value="">Unassigned</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.type.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/40 text-[11px] text-blue-700 dark:text-blue-300 flex items-start space-x-2">
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
            <span>
              DSA Routing Notice: Critical and Urgent packages are automatically inserted into the <strong>Min-Heap Priority Queue</strong> (ordered by urgency score). Standard packages route to the <strong>FIFO Queue</strong>.
            </span>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 active:scale-95 transition"
            >
              Add Package
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
