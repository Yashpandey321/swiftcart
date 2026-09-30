import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Package as PackageIcon, 
  User, 
  MapPin, 
  Truck, 
  CheckCircle2, 
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { 
  DeliveryLocation, 
  Vehicle, 
  Driver, 
  Shipment, 
  PriorityLevel, 
  PackageType 
} from '../../types';
import { useToast } from './Toast';

interface CreateShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  locations: DeliveryLocation[];
  vehicles: Vehicle[];
  drivers: Driver[];
  onCreateShipment: (shipment: Omit<Shipment, 'id' | 'createdAt' | 'statusLogs'>) => void;
}

export const CreateShipmentModal: React.FC<CreateShipmentModalProps> = ({
  isOpen,
  onClose,
  locations,
  vehicles,
  drivers,
  onCreateShipment,
}) => {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State - Step 1: Sender & Recipient
  const [senderName, setSenderName] = useState('Central Warehouse Hub');
  const [senderPhone, setSenderPhone] = useState('+1 (555) 019-2831');
  const [senderAddress, setSenderAddress] = useState('100 Logistics Way, Industrial District');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');

  // Form State - Step 2: Package Details
  const [packageType, setPackageType] = useState<PackageType>('parcel');
  const [weightKg, setWeightKg] = useState<number>(4.2);
  const [dimensions, setDimensions] = useState({ length: 30, width: 20, height: 15 });
  const [declaredValue, setDeclaredValue] = useState<number>(150);
  const [priority, setPriority] = useState<PriorityLevel>('express');

  // Form State - Step 3: Delivery Options
  const [originLocationId, setOriginLocationId] = useState<string>(locations[0]?.id || 'loc-1');
  const [destinationLocationId, setDestinationLocationId] = useState<string>(locations[1]?.id || 'loc-2');
  const [assignedVehicleId, setAssignedVehicleId] = useState<string>('');
  const [assignedDriverId, setAssignedDriverId] = useState<string>('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const validateStep1 = () => {
    if (!senderName.trim() || !recipientName.trim()) {
      setError('Please provide both sender and recipient names.');
      return false;
    }
    if (!recipientAddress.trim()) {
      setError('Please specify the recipient delivery address.');
      return false;
    }
    setError(null);
    return true;
  };

  const validateStep2 = () => {
    if (weightKg <= 0) {
      setError('Weight must be greater than 0 kg.');
      return false;
    }
    setError(null);
    return true;
  };

  const validateStep3 = () => {
    if (!destinationLocationId) {
      setError('Please select a destination facility/zone.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) setCurrentStep(2);
    else if (currentStep === 2 && validateStep2()) setCurrentStep(3);
    else if (currentStep === 3 && validateStep3()) setCurrentStep(4);
  };

  const handleBack = () => {
    setError(null);
    if (currentStep > 1) setCurrentStep((currentStep - 1) as 1 | 2 | 3);
  };

  const handleSubmit = () => {
    const originLoc = locations.find(l => l.id === originLocationId);
    const destLoc = locations.find(l => l.id === destinationLocationId);

    onCreateShipment({
      trackingNumber: `SR-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: senderName,
      customerPhone: senderPhone,
      customerEmail: 'dispatch@swiftroute.io',
      recipientName,
      recipientPhone,
      deliveryAddress: recipientAddress || destLoc?.address || '123 Delivery Street',
      originLocationId,
      destinationLocationId,
      weightKg,
      priority,
      status: 'pending',
      packageType,
      dimensions,
      declaredValue,
      notes: deliveryNotes,
      driverId: assignedDriverId || undefined,
      vehicleId: assignedVehicleId || undefined,
      estimatedDeliveryTime: 'Within 45 min',
    });

    showToast('success', 'Shipment Created', `Shipment for ${recipientName} added to the dispatch queue.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in-50 duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Create New Shipment</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Step {currentStep} of 4</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Tracker */}
        <div className="px-6 pt-4 pb-2 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          {[
            { num: 1, label: 'Sender & Recipient' },
            { num: 2, label: 'Package Details' },
            { num: 3, label: 'Delivery Options' },
            { num: 4, label: 'Review & Confirm' },
          ].map(step => (
            <div key={step.num} className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition ${
                  currentStep === step.num
                    ? 'bg-blue-600 text-white ring-2 ring-blue-500/20'
                    : currentStep > step.num
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}
              >
                {currentStep > step.num ? <Check className="w-3.5 h-3.5" /> : step.num}
              </div>
              <span className={`hidden sm:inline font-medium ${currentStep === step.num ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Sender & Recipient */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Sender Information</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Sender Name *</label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={e => setSenderName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Sender Phone</label>
                  <input
                    type="text"
                    value={senderPhone}
                    onChange={e => setSenderPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Sender Origin Address</label>
                  <input
                    type="text"
                    value={senderAddress}
                    onChange={e => setSenderAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />

              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Recipient Information</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Recipient Name *</label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={e => setRecipientName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Recipient Phone</label>
                  <input
                    type="text"
                    value={recipientPhone}
                    onChange={e => setRecipientPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Delivery Address *</label>
                  <input
                    type="text"
                    value={recipientAddress}
                    onChange={e => setRecipientAddress(e.target.value)}
                    placeholder="e.g. 42 Tech Boulevard, Tower B, Level 4"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Package Details */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Package Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['parcel', 'box', 'document', 'fragile'] as PackageType[]).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setPackageType(type)}
                      className={`p-3 rounded-xl border text-center text-xs font-semibold capitalize transition ${
                        packageType === type
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Weight (kg) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={weightKg}
                    onChange={e => setWeightKg(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Declared Value ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={declaredValue}
                    onChange={e => setDeclaredValue(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Priority Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['standard', 'express', 'urgent'] as PriorityLevel[]).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`p-3 rounded-xl border text-center text-xs font-semibold capitalize transition ${
                        priority === p
                          ? p === 'urgent'
                            ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-600 ring-1 ring-rose-500'
                            : 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 ring-1 ring-blue-500'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Delivery Options */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Origin Facility / Hub</label>
                  <select
                    value={originLocationId}
                    onChange={e => setOriginLocationId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  >
                    {locations.map(l => (
                      <option key={l.id} value={l.id}>{l.name} ({l.type})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Destination Facility / Zone *</label>
                  <select
                    value={destinationLocationId}
                    onChange={e => setDestinationLocationId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  >
                    {locations.map(l => (
                      <option key={l.id} value={l.id}>{l.name} ({l.type})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Assigned Vehicle (Optional)</label>
                  <select
                    value={assignedVehicleId}
                    onChange={e => setAssignedVehicleId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  >
                    <option value="">Auto-assign optimal vehicle</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.id} - {v.model} ({v.currentLoadKg}/{v.maxCapacityKg}kg)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Assigned Driver (Optional)</label>
                  <select
                    value={assignedDriverId}
                    onChange={e => setAssignedDriverId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  >
                    <option value="">Auto-assign next available driver</option>
                    {drivers.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.status})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Delivery Instructions / Gate Notes</label>
                <textarea
                  rows={2}
                  value={deliveryNotes}
                  onChange={e => setDeliveryNotes(e.target.value)}
                  placeholder="e.g. Ring reception buzzer at Gate 4. Signature required upon handoff."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Confirmation & Summary */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-blue-200 dark:border-blue-800">
                  <div className="font-bold text-sm text-blue-950 dark:text-blue-200">Shipment Specification</div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-600 text-white uppercase">
                    {priority}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Sender:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{senderName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Recipient:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{recipientName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Address:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{recipientAddress}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Weight & Type:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{weightKg} kg • {packageType}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Origin Hub:</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {locations.find(l => l.id === originLocationId)?.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Destination Hub:</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {locations.find(l => l.id === destinationLocationId)?.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/40">
          <button
            type="button"
            onClick={currentStep === 1 ? onClose : handleBack}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </button>

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition shadow-md shadow-blue-600/20"
            >
              <span>Continue</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition shadow-md shadow-emerald-600/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Create Shipment</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
