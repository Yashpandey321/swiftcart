import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles,
  ShieldCheck,
  Truck,
  Compass
} from 'lucide-react';
import { RegisterFormData, FormValidationErrors, UserAccount } from '../../types/auth';
import { registerUser, validateRegisterForm } from '../../services/authService';
import { ActiveView } from '../../types/ecommerce';
import { GoogleAddressAutocomplete } from '../maps/GoogleAddressAutocomplete';
import { GoogleCheckoutSummaryMap } from '../maps/GoogleCheckoutSummaryMap';

interface RegisterViewProps {
  onRegisterSuccess: (user: UserAccount) => void;
  setActiveView: (view: ActiveView) => void;
  returnView?: ActiveView;
}

export const RegisterView: React.FC<RegisterViewProps> = ({
  onRegisterSuccess,
  setActiveView,
  returnView = 'home'
}) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '',
    latitude: 26.8524,
    longitude: 75.7685,
  });

  const [fieldErrors, setFieldErrors] = useState<FormValidationErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [useGooglePinpoint, setUseGooglePinpoint] = useState(false);

  // Real-time single field validation on blur
  const handleBlur = (fieldName: keyof RegisterFormData) => {
    const fullErrors = validateRegisterForm(formData);
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: fullErrors[fieldName]
    }));
  };

  const handleChange = (field: keyof RegisterFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (serverError) setServerError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Validate all fields
    const errors = validateRegisterForm(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setServerError('Please complete all required fields correctly.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await registerUser(formData);
      if (result.success && result.user) {
        onRegisterSuccess(result.user);
      } else {
        setServerError(result.error || 'Registration failed. Please check your information.');
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
      }
    } catch {
      setServerError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPasswordMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
  const isPasswordLengthValid = formData.password.length >= 8;

  return (
    <div className="py-10 bg-slate-50/50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Branding */}
        <div className="text-center max-w-lg mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join SwiftCart Customer Network</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Create Your Account
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Register your delivery coordinates and unlock guaranteed next-day dispatch
          </p>
        </div>

        {/* Global Error Banner */}
        {serverError && (
          <div className="mb-6 max-w-2xl mx-auto p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3 text-xs text-rose-700 dark:text-rose-300 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div className="flex-1 font-semibold">{serverError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          
          <div className="p-6 sm:p-8 space-y-8">

            {/* SECTION 1: PERSONAL INFORMATION */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Personal Information
                  </h2>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Step 1 of 3</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      onBlur={() => handleBlur('fullName')}
                      placeholder="e.g. Yash Pandey"
                      className={`w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden transition ${
                        fieldErrors.fullName 
                          ? 'border-rose-400 focus:ring-2 focus:ring-rose-400/20' 
                          : 'border-slate-200 dark:border-slate-700 focus:border-blue-600'
                      }`}
                    />
                  </div>
                  {fieldErrors.fullName && (
                    <p className="text-[11px] text-rose-500 font-medium mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {fieldErrors.fullName}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      onBlur={() => handleBlur('email')}
                      placeholder="e.g. pandeyyyash2025@gmail.com"
                      className={`w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden transition ${
                        fieldErrors.email 
                          ? 'border-rose-400 focus:ring-2 focus:ring-rose-400/20' 
                          : 'border-slate-200 dark:border-slate-700 focus:border-blue-600'
                      }`}
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="text-[11px] text-rose-500 font-medium mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                      <Phone className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={formData.mobile}
                      onChange={(e) => handleChange('mobile', e.target.value)}
                      onBlur={() => handleBlur('mobile')}
                      placeholder="10-digit mobile number"
                      className={`w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden transition ${
                        fieldErrors.mobile 
                          ? 'border-rose-400 focus:ring-2 focus:ring-rose-400/20' 
                          : 'border-slate-200 dark:border-slate-700 focus:border-blue-600'
                      }`}
                    />
                  </div>
                  {fieldErrors.mobile ? (
                    <p className="text-[11px] text-rose-500 font-medium mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {fieldErrors.mobile}
                    </p>
                  ) : (
                    <p className="text-[10px] text-slate-400 mt-1">Used for delivery OTP & driver status SMS</p>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION 2: DELIVERY ADDRESS & GOOGLE MAPS PINPOINT */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Complete Delivery Address
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setUseGooglePinpoint(!useGooglePinpoint)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>{useGooglePinpoint ? 'Hide Maps Pinpointer' : 'Pinpoint on Google Maps'}</span>
                </button>
              </div>

              {/* Google Maps Search & Autocomplete Helper */}
              {useGooglePinpoint && (
                <div className="mt-4 p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      Google Maps Address Autocomplete & Coordinates
                    </span>
                    <span className="text-[10px] font-semibold bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full">
                      Auto-fills Street & Pincode
                    </span>
                  </div>
                  <GoogleAddressAutocomplete
                    onSelectAddress={(sel) => {
                      setFormData(prev => ({
                        ...prev,
                        address: sel.street || prev.address,
                        city: sel.city || prev.city,
                        state: sel.state || prev.state,
                        pincode: sel.pincode || prev.pincode,
                        latitude: sel.latitude || prev.latitude,
                        longitude: sel.longitude || prev.longitude,
                      }));
                    }}
                  />
                  <p className="text-[11px] text-blue-700 dark:text-blue-300">
                    Selected coordinates: {formData.latitude?.toFixed(4)}° N, {formData.longitude?.toFixed(4)}° E
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                {/* Complete Street Address */}
                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Complete Street Address / House / Flat / Society <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute top-2.5 left-3 pointer-events-none text-slate-400">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <textarea
                      required
                      rows={2}
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      onBlur={() => handleBlur('address')}
                      placeholder="e.g. Flat 402, Royal Palms Heights, VT Road, Mansarovar"
                      className={`w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden transition ${
                        fieldErrors.address 
                          ? 'border-rose-400 focus:ring-2 focus:ring-rose-400/20' 
                          : 'border-slate-200 dark:border-slate-700 focus:border-blue-600'
                      }`}
                    />
                  </div>
                  {fieldErrors.address && (
                    <p className="text-[11px] text-rose-500 font-medium mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {fieldErrors.address}
                    </p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    onBlur={() => handleBlur('city')}
                    placeholder="e.g. Jaipur"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden transition ${
                      fieldErrors.city ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700 focus:border-blue-600'
                    }`}
                  />
                  {fieldErrors.city && (
                    <p className="text-[11px] text-rose-500 font-medium mt-1">{fieldErrors.city}</p>
                  )}
                </div>

                {/* State */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    State <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    onBlur={() => handleBlur('state')}
                    placeholder="e.g. Rajasthan"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden transition ${
                      fieldErrors.state ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700 focus:border-blue-600'
                    }`}
                  />
                  {fieldErrors.state && (
                    <p className="text-[11px] text-rose-500 font-medium mt-1">{fieldErrors.state}</p>
                  )}
                </div>

                {/* Pincode / ZIP */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Pincode / ZIP Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => handleChange('pincode', e.target.value)}
                    onBlur={() => handleBlur('pincode')}
                    placeholder="e.g. 302020"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden transition ${
                      fieldErrors.pincode ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700 focus:border-blue-600'
                    }`}
                  />
                  {fieldErrors.pincode && (
                    <p className="text-[11px] text-rose-500 font-medium mt-1">{fieldErrors.pincode}</p>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION 3: ACCOUNT CREDENTIALS */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Password & Security
                  </h2>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>SHA-256 Encrypted</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <span className={`text-[10px] font-semibold ${isPasswordLengthValid ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {formData.password.length}/8 min chars
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      onBlur={() => handleBlur('password')}
                      placeholder="Minimum 8 characters"
                      className={`w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden transition ${
                        fieldErrors.password 
                          ? 'border-rose-400 focus:ring-2 focus:ring-rose-400/20' 
                          : 'border-slate-200 dark:border-slate-700 focus:border-blue-600'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-[11px] text-rose-500 font-medium mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Confirm Password <span className="text-rose-500">*</span>
                    </label>
                    {isPasswordMatch && (
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Matches
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      onBlur={() => handleBlur('confirmPassword')}
                      placeholder="Re-enter password"
                      className={`w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden transition ${
                        fieldErrors.confirmPassword 
                          ? 'border-rose-400 focus:ring-2 focus:ring-rose-400/20' 
                          : 'border-slate-200 dark:border-slate-700 focus:border-blue-600'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="text-[11px] text-rose-500 font-medium mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {fieldErrors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Terms and Privacy Badge */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
              <Truck className="w-5 h-5 text-blue-600 shrink-0" />
              <span>
                By creating an account, your delivery coordinates will be calibrated with the SwiftCart local fulfillment hub for rapid order routing.
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 active:scale-[0.99] text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Creating Account & Securing Coordinates...</span>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Switch to Login */}
            <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
              Already have a SwiftCart account?{' '}
              <button
                type="button"
                onClick={() => setActiveView('login')}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Sign In here
              </button>
            </div>

          </div>

        </form>

      </div>
    </div>
  );
};
