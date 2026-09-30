import React, { useState } from 'react';
import { MapPin, X, Check, Plus, Navigation } from 'lucide-react';
import { Address } from '../../types/ecommerce';

interface AddressPickerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: Address[];
  selectedAddress: Address;
  onSelectAddress: (address: Address) => void;
  onAddNewAddress?: () => void;
  userPincode: string;
  onUpdatePincode?: (pincode: string) => void;
}

export const AddressPickerSheet: React.FC<AddressPickerSheetProps> = ({
  isOpen,
  onClose,
  addresses,
  selectedAddress,
  onSelectAddress,
  onAddNewAddress,
  userPincode,
  onUpdatePincode,
}) => {
  const [pincodeInput, setPincodeInput] = useState(userPincode);
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApplyPincode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = pincodeInput.trim();
    if (clean.length === 6 && /^\d+$/.test(clean)) {
      if (onUpdatePincode) onUpdatePincode(clean);
      setPincodeStatus(`✓ Delivery available for ${clean}! Express delivery active.`);
      setTimeout(() => {
        setPincodeStatus(null);
        onClose();
      }, 1200);
    } else {
      setPincodeStatus('⚠️ Please enter a valid 6-digit PIN code');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Sheet / Modal */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 overflow-hidden max-h-[85vh] flex flex-col z-10 animate-in slide-in-from-bottom duration-300">
        
        {/* Drag handle on mobile */}
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Choose Delivery Location
              </h3>
              <p className="text-[11px] text-slate-500">
                Delivery options and speeds may vary based on your location
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Pincode check form */}
        <div className="py-4">
          <form onSubmit={handleApplyPincode} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                maxLength={6}
                value={pincodeInput}
                onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit PIN code"
                className="w-full pl-3.5 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white transition shadow-xs cursor-pointer bg-blue-600 hover:bg-blue-700"
            >
              Apply PIN
            </button>
          </form>

          {pincodeStatus && (
            <p className={`text-xs mt-2 font-medium ${
              pincodeStatus.startsWith('✓') ? 'text-emerald-600' : 'text-amber-600'
            }`}>
              {pincodeStatus}
            </p>
          )}
        </div>

        {/* Saved Addresses List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Saved Delivery Addresses
          </p>

          {addresses.map((addr) => {
            const isSelected = selectedAddress?.id === addr.id;
            return (
              <div
                key={addr.id}
                onClick={() => {
                  onSelectAddress(addr);
                  onClose();
                }}
                className={`p-3 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center border ${
                    isSelected
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {addr.name}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {addr.type}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold text-emerald-600">Default</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-snug">
                      {addr.street}, {addr.city} - {addr.pincode}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Phone: {addr.phone}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="pt-4 mt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => {
              if (onAddNewAddress) onAddNewAddress();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Delivery Address</span>
          </button>
        </div>

      </div>
    </div>
  );
};
