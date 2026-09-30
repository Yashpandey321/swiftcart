import React, { useState, useEffect } from 'react';
import { 
  User, 
  MapPin, 
  Heart, 
  HelpCircle, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Check,
  Mail,
  Phone,
  Building2,
  LogOut,
  Compass,
  AlertCircle
} from 'lucide-react';
import { CustomerProfile, Address, Product, ActiveView } from '../../types/ecommerce';
import { UserAccount } from '../../types/auth';
import { GoogleAddressAutocomplete } from '../maps/GoogleAddressAutocomplete';

interface ProfileViewProps {
  profile: CustomerProfile;
  currentUser?: UserAccount | null;
  onUpdateProfile: (updated: Partial<CustomerProfile>) => void;
  onUpdateUserAccount?: (updates: Partial<UserAccount>) => Promise<{ success: boolean; error?: string }>;
  savedAddresses: Address[];
  onAddAddress: (address: Address) => void;
  onDeleteAddress: (id: string) => void;
  wishlistProducts: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  setActiveView: (view: ActiveView) => void;
  onLogout?: () => void;
  initialTab?: 'profile' | 'addresses' | 'wishlist' | 'support';
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  currentUser,
  onUpdateProfile,
  onUpdateUserAccount,
  savedAddresses,
  onAddAddress,
  onDeleteAddress,
  wishlistProducts,
  onRemoveFromWishlist,
  onSelectProduct,
  setActiveView,
  onLogout,
  initialTab,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'wishlist' | 'support'>(initialTab || 'profile');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Profile editable fields
  const [name, setName] = useState(currentUser?.fullName || profile.name);
  const [email, setEmail] = useState(currentUser?.email || profile.email);
  const [phone, setPhone] = useState(currentUser?.mobile || profile.phone.replace(/[^0-9]/g, ''));
  const [street, setStreet] = useState(currentUser?.address || savedAddresses[0]?.street || '');
  const [city, setCity] = useState(currentUser?.city || savedAddresses[0]?.city || 'Jaipur');
  const [state, setState] = useState(currentUser?.state || savedAddresses[0]?.state || 'Rajasthan');
  const [pincode, setPincode] = useState(currentUser?.pincode || savedAddresses[0]?.pincode || '302020');
  
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Address add modal state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('Jaipur');
  const [newState, setNewState] = useState('Rajasthan');
  const [newPincode, setNewPincode] = useState('302020');
  const [newType, setNewType] = useState<'Home' | 'Office' | 'Other'>('Home');

  // Sync state if currentUser changes
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.fullName);
      setEmail(currentUser.email);
      setPhone(currentUser.mobile);
      setStreet(currentUser.address);
      setCity(currentUser.city);
      setState(currentUser.state);
      setPincode(currentUser.pincode);
    }
  }, [currentUser]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!name.trim()) {
      setErrorMessage('Full Name is required.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!street.trim()) {
      setErrorMessage('Delivery address street is required.');
      return;
    }

    setIsSaving(true);
    try {
      if (onUpdateUserAccount) {
        const res = await onUpdateUserAccount({
          fullName: name.trim(),
          email: email.trim().toLowerCase(),
          mobile: cleanPhone,
          address: street.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
        });
        if (!res.success) {
          setErrorMessage(res.error || 'Failed to update profile.');
          setIsSaving(false);
          return;
        }
      }

      onUpdateProfile({
        name: name.trim(),
        email: email.trim(),
        phone: `+91 ${cleanPhone}`,
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      setErrorMessage('An unexpected error occurred while saving profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStreet.trim()) {
      onAddAddress({
        id: 'addr-' + Date.now(),
        name,
        phone: `+91 ${phone}`,
        street: newStreet.trim(),
        city: newCity.trim(),
        state: newState.trim(),
        pincode: newPincode.trim(),
        type: newType,
        isDefault: false,
        latitude: 26.8524,
        longitude: 75.7685,
      });
      setShowAddressModal(false);
      setNewStreet('');
    }
  };

  return (
    <div className="py-8 bg-slate-50/50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header Profile Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              {(currentUser?.fullName || profile.name).charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                  {currentUser?.fullName || profile.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                  {currentUser?.membershipTier || 'Prime Member'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {currentUser?.email || profile.email} • +91 {currentUser?.mobile || profile.phone}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Primary Delivery Hub: {currentUser?.city || 'Jaipur'}, {currentUser?.state || 'Rajasthan'} ({currentUser?.pincode || '302020'})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => setActiveView('dashboard')}
              className="px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-600 dark:text-blue-400 font-bold text-xs cursor-pointer"
            >
              Dashboard
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-2">
          {[
            { id: 'profile', label: 'View & Edit Profile', icon: User },
            { id: 'addresses', label: `Saved Delivery Addresses (${savedAddresses.length})`, icon: MapPin },
            { id: 'wishlist', label: `Wishlist (${wishlistProducts.length})`, icon: Heart },
            { id: 'support', label: 'Help & Delivery FAQs', icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          
          {/* TAB 1: VIEW & EDIT PERSONAL PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs max-w-3xl space-y-6">
              
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  User Details & Delivery Address
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your name, contact information, and default doorstep delivery address.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {savedSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Your profile and delivery coordinates have been updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-5">
                
                {/* Contact Information Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Name */}
                  <div className="sm:col-span-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Yash Pandey"
                        className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden focus:border-blue-600"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="sm:col-span-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden focus:border-blue-600"
                      />
                    </div>
                  </div>

                  {/* Mobile */}
                  <div className="sm:col-span-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="10-digit mobile"
                        className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden focus:border-blue-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Address Fields */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span>Complete Delivery Address (Doorstep Location)</span>
                    </label>
                  </div>

                  {/* Google Autocomplete Shortcut */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-750">
                    <p className="text-[11px] font-bold text-slate-500 mb-2">Search with Google Maps Autocomplete:</p>
                    <GoogleAddressAutocomplete
                      onSelectAddress={(sel) => {
                        if (sel.street) setStreet(sel.street);
                        if (sel.city) setCity(sel.city);
                        if (sel.state) setState(sel.state);
                        if (sel.pincode) setPincode(sel.pincode);
                      }}
                    />
                  </div>

                  {/* Street */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">
                      Street Address / House / Flat <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="e.g. Flat 402, Royal Palms Heights, VT Road"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden focus:border-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 block mb-1">
                        City <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 block mb-1">
                        State <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 block mb-1">
                        Pincode <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Password Notice */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Password is protected by salted SHA-256 and never shown in plain text.</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer transition disabled:opacity-50"
                  >
                    {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
                  </button>
                </div>

              </form>

            </div>
          )}

          {/* TAB 2: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Saved Delivery Addresses
                  </h2>
                  <p className="text-xs text-slate-500">Your calibrated locations for autonomous route dispatch</p>
                </div>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {addr.name}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {addr.type}
                          </span>
                        </div>
                        {addr.isDefault && (
                          <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full">
                            PRIMARY
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
                        {addr.street}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Phone: {addr.phone}
                      </p>
                      {addr.latitude && addr.longitude && (
                        <p className="text-[10px] text-emerald-600 font-semibold mt-1">
                          Google Maps Coordinates: {addr.latitude.toFixed(4)}°, {addr.longitude.toFixed(4)}°
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                      <button
                        onClick={() => onDeleteAddress(addr.id)}
                        className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Address</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Your Saved Items ({wishlistProducts.length})
                </h2>
              </div>

              {wishlistProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {wishlistProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => onSelectProduct(product)}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between cursor-pointer group"
                    >
                      <div>
                        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950 p-2">
                          <img
                            src={product.thumbnail}
                            alt=""
                            className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveFromWishlist(product.id);
                            }}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-rose-600 shadow-xs cursor-pointer"
                            title="Remove from wishlist"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[10px] font-bold text-blue-600 mt-2 block">
                          {product.brand}
                        </span>
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-2 mt-0.5">
                          {product.name}
                        </h4>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-baseline justify-between">
                        <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600">
                          {product.discountPercent}% OFF
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
                  <Heart className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Your wishlist is empty</h3>
                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    Explore our catalogue and click the heart icon on items you love.
                  </p>
                  <button
                    onClick={() => setActiveView('products')}
                    className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Browse Collections
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: HELP & FAQS */}
          {activeTab === 'support' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 max-w-3xl">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
                <p className="text-xs text-slate-500 mt-0.5">Quick answers regarding SwiftCart delivery and logistics</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                  <p className="font-bold text-slate-900 dark:text-white">How does SwiftCart Same-Day Delivery work?</p>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">
                    When you order an in-stock product before 1:00 PM, our Autonomous Route Engine immediately batches your package with the nearest suburban courier for delivery before 8:00 PM the same evening.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                  <p className="font-bold text-slate-900 dark:text-white">What is the Delivery OTP for?</p>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">
                    The 4-digit OTP ensures the package is only handed to you. Never share it over the phone—only provide it in person when the delivery agent arrives.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                  <p className="font-bold text-slate-900 dark:text-white">Can I update my delivery address?</p>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">
                    Yes! You can edit your default delivery address directly above on this profile tab, or select an alternate address during checkout.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Add Delivery Address</h3>
            
            <form onSubmit={handleAddAddressSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-500 block mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  placeholder="House/Flat No., Apartment, Colony"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-500 block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={newPincode}
                    onChange={(e) => setNewPincode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Address Label</label>
                <div className="flex gap-2">
                  {(['Home', 'Office', 'Other'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewType(t)}
                      className={`flex-1 py-1.5 rounded-xl border text-xs font-bold cursor-pointer ${
                        newType === t
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
