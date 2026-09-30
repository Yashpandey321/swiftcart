import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Plus, 
  Check, 
  Truck, 
  CreditCard, 
  Zap, 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight, 
  Clock,
  QrCode,
  Building,
  Banknote,
  User,
  Phone,
  Edit2,
  BookmarkCheck,
  Compass,
  AlertCircle
} from 'lucide-react';
import { 
  CartItem, 
  Address, 
  DeliveryOption, 
  PaymentType, 
  PaymentDetails, 
  CustomerOrder,
  ActiveView
} from '../../types/ecommerce';
import { UserAccount } from '../../types/auth';
import { DELIVERY_OPTIONS } from '../../data/ecommerceData';
import { GoogleAddressAutocomplete } from '../maps/GoogleAddressAutocomplete';
import { GoogleCheckoutSummaryMap } from '../maps/GoogleCheckoutSummaryMap';

interface CheckoutViewProps {
  cartItems: CartItem[];
  savedAddresses: Address[];
  currentUser?: UserAccount | null;
  onPlaceOrder: (order: Partial<CustomerOrder>) => void;
  onBackToCart: () => void;
  setActiveView: (view: ActiveView) => void;
  onSaveAddressToProfile?: (address: Address) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cartItems = [],
  savedAddresses = [],
  currentUser,
  onPlaceOrder,
  onBackToCart,
  setActiveView,
  onSaveAddressToProfile,
}) => {
  // Stepper state: 1: Address, 2: Delivery, 3: Payment, 4: Review
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Initialize selected address with priority to currentUser or savedAddresses
  const defaultUserAddress: Address = {
    id: currentUser ? `addr-${currentUser.userId}` : (savedAddresses[0]?.id || 'addr-default'),
    name: currentUser?.fullName || savedAddresses[0]?.name || 'Yash Pandey',
    phone: currentUser ? (currentUser.mobile.startsWith('+91') ? currentUser.mobile : `+91 ${currentUser.mobile}`) : (savedAddresses[0]?.phone || '+91 98290 14820'),
    street: currentUser?.address || savedAddresses[0]?.street || 'Flat 402, Royal Palms Heights, VT Road, Mansarovar',
    city: currentUser?.city || savedAddresses[0]?.city || 'Jaipur',
    state: currentUser?.state || savedAddresses[0]?.state || 'Rajasthan',
    pincode: currentUser?.pincode || savedAddresses[0]?.pincode || '302020',
    type: 'Home',
    isDefault: true,
    latitude: currentUser?.latitude || savedAddresses[0]?.latitude || 26.8524,
    longitude: currentUser?.longitude || savedAddresses[0]?.longitude || 75.7685,
  };

  const [selectedAddress, setSelectedAddress] = useState<Address>(defaultUserAddress);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOption>(DELIVERY_OPTIONS[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentType>('upi');
  const [upiId, setUpiId] = useState('yashpandey@oksbi');

  // Address editing mode
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editForm, setEditForm] = useState({
    name: defaultUserAddress.name,
    phone: defaultUserAddress.phone,
    street: defaultUserAddress.street,
    city: defaultUserAddress.city,
    state: defaultUserAddress.state,
    pincode: defaultUserAddress.pincode,
    latitude: defaultUserAddress.latitude,
    longitude: defaultUserAddress.longitude,
    saveToProfile: true,
  });

  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [newAddrForm, setNewAddrForm] = useState({
    name: currentUser?.fullName || 'Yash Pandey',
    phone: currentUser?.mobile || '+91 98290 14820',
    street: '',
    landmark: '',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302020',
    type: 'Home' as 'Home' | 'Office' | 'Other',
    latitude: 26.8524,
    longitude: 75.7685,
    saveToProfile: true,
  });

  // Keep state updated if currentUser arrives
  useEffect(() => {
    if (currentUser) {
      const updated: Address = {
        id: `addr-${currentUser.userId}`,
        name: currentUser.fullName,
        phone: currentUser.mobile.startsWith('+91') ? currentUser.mobile : `+91 ${currentUser.mobile}`,
        street: currentUser.address,
        city: currentUser.city,
        state: currentUser.state,
        pincode: currentUser.pincode,
        type: 'Home',
        isDefault: true,
        latitude: currentUser.latitude || 26.8524,
        longitude: currentUser.longitude || 75.7685,
      };
      setSelectedAddress(updated);
      setEditForm(prev => ({
        ...prev,
        name: updated.name,
        phone: updated.phone,
        street: updated.street,
        city: updated.city,
        state: updated.state,
        pincode: updated.pincode,
        latitude: updated.latitude,
        longitude: updated.longitude,
      }));
    }
  }, [currentUser]);

  // Pricing
  const subtotal = (Array.isArray(cartItems) ? cartItems : []).reduce(
    (sum, item) => sum + (item?.product?.price || 0) * (item?.quantity || 0),
    0
  );
  const deliveryCost = selectedDelivery.price;
  const discount = subtotal > 2000 ? 500 : 0;
  const grandTotal = subtotal + deliveryCost - discount;

  const handleApplyEditedAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Address = {
      ...selectedAddress,
      name: editForm.name.trim(),
      phone: editForm.phone.trim(),
      street: editForm.street.trim(),
      city: editForm.city.trim(),
      state: editForm.state.trim(),
      pincode: editForm.pincode.trim(),
      latitude: editForm.latitude || 26.8524,
      longitude: editForm.longitude || 75.7685,
    };
    setSelectedAddress(updated);
    setIsEditingAddress(false);

    if (editForm.saveToProfile && onSaveAddressToProfile) {
      onSaveAddressToProfile(updated);
    }
  };

  const handleResetToRegistered = () => {
    if (currentUser) {
      const regAddr: Address = {
        id: `addr-${currentUser.userId}`,
        name: currentUser.fullName,
        phone: currentUser.mobile.startsWith('+91') ? currentUser.mobile : `+91 ${currentUser.mobile}`,
        street: currentUser.address,
        city: currentUser.city,
        state: currentUser.state,
        pincode: currentUser.pincode,
        type: 'Home',
        isDefault: true,
        latitude: currentUser.latitude || 26.8524,
        longitude: currentUser.longitude || 75.7685,
      };
      setSelectedAddress(regAddr);
      setEditForm({
        name: regAddr.name,
        phone: regAddr.phone,
        street: regAddr.street,
        city: regAddr.city,
        state: regAddr.state,
        pincode: regAddr.pincode,
        latitude: regAddr.latitude,
        longitude: regAddr.longitude,
        saveToProfile: true,
      });
      setIsEditingAddress(false);
    }
  };

  const handleCreateNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Address = {
      id: 'addr-' + Date.now(),
      name: newAddrForm.name || 'Yash Pandey',
      phone: newAddrForm.phone || '+91 98290 14820',
      street: newAddrForm.street || 'Malviya Nagar Sector 3',
      landmark: newAddrForm.landmark,
      city: newAddrForm.city,
      state: newAddrForm.state,
      pincode: newAddrForm.pincode,
      type: newAddrForm.type,
      latitude: newAddrForm.latitude,
      longitude: newAddrForm.longitude,
      isDefault: false,
    };
    setSelectedAddress(created);
    setIsAddingNewAddress(false);

    if (newAddrForm.saveToProfile && onSaveAddressToProfile) {
      onSaveAddressToProfile(created);
    }
  };

  const handleFinalOrderSubmit = () => {
    const paymentDetails: PaymentDetails = {
      method: paymentMethod,
      upiId: paymentMethod === 'upi' ? upiId : undefined,
    };

    onPlaceOrder({
      userId: currentUser?.userId,
      items: cartItems,
      subtotal,
      deliveryFee: deliveryCost,
      discount,
      total: grandTotal,
      address: selectedAddress,
      deliveryOption: selectedDelivery,
      paymentDetails,
    });
  };

  const steps = [
    { num: 1, title: 'Address' },
    { num: 2, title: 'Delivery' },
    { num: 3, title: 'Payment' },
    { num: 4, title: 'Review' },
  ];

  return (
    <div className="py-8 bg-slate-50/50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Progress Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-xl mx-auto relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
            {steps.map((s) => {
              const isCompleted = currentStep > s.num;
              const isCurrent = currentStep === s.num;
              return (
                <div key={s.num} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isCompleted
                        ? 'bg-emerald-600 text-white shadow-md'
                        : isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-500/20 shadow-md'
                        : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                  </div>
                  <span
                    className={`text-[11px] font-semibold mt-1.5 ${
                      isCurrent
                        ? 'text-blue-600 dark:text-blue-400'
                        : isCompleted
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Left Stage */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs">
            
            {/* STEP 1: ADDRESS & USER INFORMATION */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-2">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Delivery Address & Contact
                    </h2>
                    <p className="text-xs text-slate-500">
                      Auto-loaded from your SwiftCart registered profile
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isEditingAddress && !isAddingNewAddress && (
                      <button
                        onClick={() => setIsEditingAddress(true)}
                        className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Edit for This Order</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setIsAddingNewAddress(!isAddingNewAddress);
                        setIsEditingAddress(false);
                      }}
                      className="px-3.5 py-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isAddingNewAddress ? 'Cancel' : 'New Address'}</span>
                    </button>
                  </div>
                </div>

                {/* EDIT ADDRESS FOR THIS ORDER FORM */}
                {isEditingAddress && (
                  <form onSubmit={handleApplyEditedAddress} className="p-5 rounded-2xl bg-blue-50/40 dark:bg-blue-950/20 border-2 border-blue-500/30 space-y-4 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                        <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Edit Delivery Address for this Order</span>
                      </h3>
                      <button
                        type="button"
                        onClick={handleResetToRegistered}
                        className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        Use Registered Address
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Mobile Number</label>
                        <input
                          type="text"
                          required
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Complete Street Address</label>
                      <input
                        type="text"
                        required
                        value={editForm.street}
                        onChange={(e) => setEditForm({ ...editForm, street: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">City</label>
                        <input
                          type="text"
                          required
                          value={editForm.city}
                          onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">State</label>
                        <input
                          type="text"
                          required
                          value={editForm.state}
                          onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Pincode</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={editForm.pincode}
                          onChange={(e) => setEditForm({ ...editForm, pincode: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
                        />
                      </div>
                    </div>

                    {/* Checkbox: Save this address to my profile */}
                    <div className="pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <input
                          type="checkbox"
                          checked={editForm.saveToProfile}
                          onChange={(e) => setEditForm({ ...editForm, saveToProfile: e.target.checked })}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span>Save this address to my profile</span>
                      </label>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingAddress(false)}
                        className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                      >
                        Apply for This Order
                      </button>
                    </div>
                  </form>
                )}

                {/* ADD COMPLETELY NEW ADDRESS FORM */}
                {isAddingNewAddress && (
                  <form onSubmit={handleCreateNewAddress} className="space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Add New Delivery Location
                      </h3>
                      <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                        Google Maps Enabled
                      </span>
                    </div>

                    {/* Google Address Autocomplete & Map Pinning */}
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                        Pinpoint Address on Google Maps
                      </label>
                      <GoogleAddressAutocomplete
                        onSelectAddress={(selected) => {
                          setNewAddrForm(prev => ({
                            ...prev,
                            street: selected.street || prev.street,
                            city: selected.city || prev.city,
                            state: selected.state || prev.state,
                            pincode: selected.pincode || prev.pincode,
                            latitude: selected.latitude || prev.latitude,
                            longitude: selected.longitude || prev.longitude,
                          }));
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-500 block mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={newAddrForm.name}
                          onChange={(e) => setNewAddrForm({ ...newAddrForm, name: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-500 block mb-1">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={newAddrForm.phone}
                          onChange={(e) => setNewAddrForm({ ...newAddrForm, phone: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 block mb-1">Street Address, Flat / House No.</label>
                      <input
                        type="text"
                        required
                        value={newAddrForm.street}
                        onChange={(e) => setNewAddrForm({ ...newAddrForm, street: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-500 block mb-1">City</label>
                        <input
                          type="text"
                          required
                          value={newAddrForm.city}
                          onChange={(e) => setNewAddrForm({ ...newAddrForm, city: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-500 block mb-1">State</label>
                        <input
                          type="text"
                          required
                          value={newAddrForm.state}
                          onChange={(e) => setNewAddrForm({ ...newAddrForm, state: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-500 block mb-1">PIN Code</label>
                        <input
                          type="text"
                          required
                          value={newAddrForm.pincode}
                          onChange={(e) => setNewAddrForm({ ...newAddrForm, pincode: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <input
                          type="checkbox"
                          checked={newAddrForm.saveToProfile}
                          onChange={(e) => setNewAddrForm({ ...newAddrForm, saveToProfile: e.target.checked })}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span>Save this address to my profile</span>
                      </label>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingNewAddress(false)}
                        className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Save & Select Address
                      </button>
                    </div>
                  </form>
                )}

                {/* PRIMARY HIGHLIGHTED CUSTOMER INFORMATION & DELIVERY ADDRESS CARD */}
                {!isEditingAddress && !isAddingNewAddress && (
                  <div className="p-5 rounded-3xl bg-slate-50/80 dark:bg-slate-800/60 border-2 border-blue-500/25 shadow-xs space-y-4">
                    
                    {/* Customer Information Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-750">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                          CUSTOMER INFORMATION
                        </p>
                        <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                          Name: <span className="font-semibold">{selectedAddress.name}</span>
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          Mobile: <span className="font-semibold">{selectedAddress.phone}</span>
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                          ✓ Verified Recipient
                        </span>
                        {currentUser && (
                          <span className="text-[10px] text-slate-400 mt-1">
                            Account: {currentUser.email}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Delivery Address Block */}
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-1">
                        DELIVERY ADDRESS
                      </p>
                      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 text-xs space-y-0.5">
                        <p className="font-bold text-slate-900 dark:text-white text-sm">
                          {selectedAddress.street}
                        </p>
                        <p className="text-slate-600 dark:text-slate-300 font-medium">
                          {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                        </p>
                        <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                          <span className="flex items-center gap-1 text-blue-600 font-semibold">
                            <MapPin className="w-3.5 h-3.5" />
                            GPS Coords: {selectedAddress.latitude?.toFixed(4)}° N, {selectedAddress.longitude?.toFixed(4)}° E
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsEditingAddress(true)}
                            className="font-bold text-blue-600 hover:underline cursor-pointer"
                          >
                            Change / Edit
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Multiple Saved Addresses Selector (if user has other addresses) */}
                    {savedAddresses.length > 1 && (
                      <div className="pt-2">
                        <p className="text-[11px] font-bold text-slate-500 mb-2">Or select from other saved addresses:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {savedAddresses.filter(a => a.id !== selectedAddress.id).map(addr => (
                            <button
                              key={addr.id}
                              type="button"
                              onClick={() => setSelectedAddress(addr)}
                              className="text-left p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 bg-white dark:bg-slate-900 text-xs transition cursor-pointer"
                            >
                              <p className="font-bold text-slate-900 dark:text-white">{addr.name} ({addr.type})</p>
                              <p className="text-slate-500 truncate mt-0.5">{addr.street}, {addr.city}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={onBackToCart}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Cart</span>
                  </button>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/20"
                  >
                    <span>Confirm Address & Choose Delivery</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: DELIVERY OPTION */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Choose Delivery Speed
                  </h2>
                  <p className="text-xs text-slate-500">
                    Dispatched using SwiftCart Smart Logistics Router
                  </p>
                </div>

                <div className="space-y-3">
                  {DELIVERY_OPTIONS.map((opt) => {
                    const isSelected = selectedDelivery.id === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setSelectedDelivery(opt)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 shadow-xs'
                            : 'border-slate-200 dark:border-slate-750 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                          }`}>
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-900 dark:text-white">
                                {opt.title}
                              </span>
                              {opt.badge && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                  {opt.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{opt.description}</p>
                            <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                              Estimated Arrival: {opt.estimatedTime}
                            </p>
                          </div>
                        </div>

                        <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                          {opt.price === 0 ? 'FREE' : `+₹${opt.price}`}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center gap-3">
                  <Truck className="w-5 h-5 text-blue-600 shrink-0" />
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    <strong>Optimized Route Guarantee:</strong> All orders are assigned to the nearest fulfilment corridor with live transit telemetry and delivery security OTP.
                  </p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Address</span>
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/20"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT METHOD */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Select Payment Method
                  </h2>
                  <p className="text-xs text-slate-500">
                    100% Encrypted & RBI Guidelines Compliant
                  </p>
                </div>

                <div className="space-y-3">
                  {/* UPI */}
                  <div
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 shadow-xs'
                        : 'border-slate-200 dark:border-slate-750'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === 'upi' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                        }`}>
                          {paymentMethod === 'upi' && <Check className="w-3 h-3" />}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900 dark:text-white">Instant UPI (GPay, PhonePe, Paytm)</p>
                          <p className="text-xs text-slate-500">Fastest checkout with zero gateway fees</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        ⚡ RECOMMENDED
                      </span>
                    </div>

                    {paymentMethod === 'upi' && (
                      <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-900/50 flex gap-2">
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="yourname@upi"
                          className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
                        />
                        <button
                          type="button"
                          className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
                        >
                          Verify UPI
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Cards */}
                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 shadow-xs'
                        : 'border-slate-200 dark:border-slate-750'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'card' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                      }`}>
                        {paymentMethod === 'card' && <Check className="w-3 h-3" />}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">Credit / Debit Card</p>
                        <p className="text-xs text-slate-500">Visa, Mastercard, RuPay & Amex</p>
                      </div>
                    </div>
                  </div>

                  {/* Cash on Delivery */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 shadow-xs'
                        : 'border-slate-200 dark:border-slate-750'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'cod' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                      }`}>
                        {paymentMethod === 'cod' && <Check className="w-3 h-3" />}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">
                          Cash on Delivery (COD)
                        </p>
                        <p className="text-xs text-slate-500">Pay cash or UPI QR at your doorstep to delivery agent</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Delivery</span>
                  </button>
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/20"
                  >
                    <span>Review Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: ORDER REVIEW & PLACE ORDER */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Review and Confirm Order
                  </h2>
                  <p className="text-xs text-slate-500">
                    Verify customer details & destination before autonomous dispatch
                  </p>
                </div>

                {/* Google Maps Delivery Location Card */}
                <GoogleCheckoutSummaryMap
                  address={selectedAddress}
                  estimatedDelivery={selectedDelivery.estimatedDelivery || selectedDelivery.estimatedTime}
                />

                {/* Clear Customer Information & Delivery Address Display Before Payment */}
                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-4">
                  <div className="border-b border-slate-200 dark:border-slate-700 pb-3">
                    <p className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      CUSTOMER INFORMATION
                    </p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      Name: <span className="font-semibold">{selectedAddress.name}</span>
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Mobile: <span className="font-semibold">{selectedAddress.phone}</span>
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-1">
                      DELIVERY ADDRESS
                    </p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {selectedAddress.street}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      Delivery: <strong>{selectedDelivery.title}</strong> ({selectedDelivery.estimatedTime})
                    </span>
                    <span className="text-slate-500 uppercase">
                      Payment: <strong>{paymentMethod}</strong>
                    </span>
                  </div>
                </div>

                {/* Items Summary in Review */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Packages in this Shipment ({cartItems.length})
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.product.id} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <img src={item.product.thumbnail} alt="" className="w-10 h-10 object-cover rounded-lg" referrerPolicy="no-referrer" />
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-xs">{item.product.name}</p>
                            <p className="text-[11px] text-slate-400">Qty: {item.quantity} × ₹{item.product.price.toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Final Place Order CTA */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <button
                    onClick={handleFinalOrderSubmit}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 active:scale-[0.99] text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <span>Place Order • ₹{grandTotal.toLocaleString('en-IN')}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <p className="text-[11px] text-center text-slate-400">
                    By placing your order, an autonomous dispatch task will be registered on the Google Maps route network.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Right Summary Sidebar */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-200 dark:border-slate-800">
                Order Summary
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="text-slate-900 dark:text-white font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery Charges</span>
                  <span className="text-slate-900 dark:text-white font-semibold">
                    {deliveryCost === 0 ? 'FREE' : `₹${deliveryCost}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Special Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between text-sm font-extrabold text-slate-900 dark:text-white">
                  <span>Grand Total</span>
                  <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Delivery info guarantee */}
              <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 text-[11px] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>SwiftCart Buyer Protection & OTP Guaranteed Delivery</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
