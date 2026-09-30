import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Building2, 
  Globe, 
  Bell, 
  ShieldCheck, 
  Sliders, 
  Save, 
  RotateCcw,
  CheckCircle2,
  Lock,
  Mail,
  Smartphone
} from 'lucide-react';
import { useToast } from '../common/Toast';

export const SettingsView: React.FC = () => {
  const { showToast } = useToast();

  // General Settings State
  const [companyName, setCompanyName] = useState('SwiftRoute Logistics');
  const [timeZone, setTimeZone] = useState('Asia/Kolkata (IST)');
  const [currency, setCurrency] = useState('USD');
  const [distanceUnit, setDistanceUnit] = useState('km');
  const [weightUnit, setWeightUnit] = useState('kg');

  // Delivery Rules
  const [maxPackagesPerVehicle, setMaxPackagesPerVehicle] = useState(40);
  const [maxWeightPerVehicle, setMaxWeightPerVehicle] = useState(1200);
  const [priorityWindowHours, setPriorityWindowHours] = useState(2);
  const [standardWindowHours, setStandardWindowHours] = useState(24);

  // Notifications
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [driverPushNotifications, setDriverPushNotifications] = useState(true);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('success', 'Configuration Saved', 'System parameters updated successfully.');
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200 max-w-4xl">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Platform Settings</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure enterprise company identity, fleet limits, dispatch rules, and automated notifications
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition shadow-md shadow-blue-600/20"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Section 1: General Company Identity */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Building2 className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">General Business Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Primary Time Zone</label>
              <select
                value={timeZone}
                onChange={e => setTimeZone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST, UTC+5:30)</option>
                <option value="America/New_York (EST)">America/New_York (EST, UTC-5:00)</option>
                <option value="Europe/London (GMT)">Europe/London (GMT, UTC+0:00)</option>
                <option value="Asia/Singapore (SGT)">Asia/Singapore (SGT, UTC+8:00)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Billing Currency</label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="USD">USD ($)</option>
                <option value="INR">INR (₹)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Distance Unit</label>
                <select
                  value={distanceUnit}
                  onChange={e => setDistanceUnit(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="km">Kilometers (km)</option>
                  <option value="miles">Miles (mi)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Weight Unit</label>
                <select
                  value={weightUnit}
                  onChange={e => setWeightUnit(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="lbs">Pounds (lbs)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Delivery & Dispatch Rules */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">Delivery & Fleet Rules</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Max Packages per Vehicle
              </label>
              <input
                type="number"
                min="5"
                max="100"
                value={maxPackagesPerVehicle}
                onChange={e => setMaxPackagesPerVehicle(parseInt(e.target.value) || 20)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Max Payload Weight per Vehicle (kg)
              </label>
              <input
                type="number"
                min="100"
                max="5000"
                step="50"
                value={maxWeightPerVehicle}
                onChange={e => setMaxWeightPerVehicle(parseInt(e.target.value) || 500)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Priority Delivery Window (Hours)
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={priorityWindowHours}
                onChange={e => setPriorityWindowHours(parseInt(e.target.value) || 2)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Standard Delivery Window (Hours)
              </label>
              <input
                type="number"
                min="6"
                max="72"
                value={standardWindowHours}
                onChange={e => setStandardWindowHours(parseInt(e.target.value) || 24)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Automated Notifications */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Bell className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">Customer & Driver Alerts</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="font-semibold text-xs text-slate-900 dark:text-white">SMS Notifications to Customers</div>
                  <div className="text-[11px] text-slate-400">Send automatic tracking links when package is out for delivery</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={smsNotifications}
                onChange={e => setSmsNotifications(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded-md"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="font-semibold text-xs text-slate-900 dark:text-white">Email Delivery Confirmation Receipts</div>
                  <div className="text-[11px] text-slate-400">Send proof-of-delivery receipts and signed dispatch bills to customers</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailUpdates}
                onChange={e => setEmailUpdates(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded-md"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="font-semibold text-xs text-slate-900 dark:text-white">Driver In-App Push Dispatch Alerts</div>
                  <div className="text-[11px] text-slate-400">Notify courier mobile devices immediately when new route assignments are published</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={driverPushNotifications}
                onChange={e => setDriverPushNotifications(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded-md"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition shadow-md shadow-blue-600/20"
          >
            <Save className="w-4 h-4" />
            <span>Save All Configuration Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
