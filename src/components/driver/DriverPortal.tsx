import React, { useState, useMemo } from 'react';
import { 
  Truck, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Navigation, 
  RotateCcw, 
  ArrowRight, 
  KeyRound, 
  AlertTriangle, 
  User, 
  ChevronRight, 
  ExternalLink,
  Package as PackageIcon,
  Sun,
  Moon,
  LogOut,
  ShoppingBag,
  SlidersHorizontal,
  Zap,
  Coffee,
  CheckCircle
} from 'lucide-react';
import { Shipment, DeliveryStatus, Driver, Vehicle } from '../../types';
import { CustomerOrder } from '../../types/ecommerce';
import { StatusBadge, PriorityBadge } from '../common/Badges';
import { GoogleSmartRouteOptimizerMap } from '../maps/GoogleSmartRouteOptimizerMap';

interface DriverPortalProps {
  driver: Driver;
  vehicle?: Vehicle;
  shipments: Shipment[];
  orders: CustomerOrder[];
  onUpdateShipmentStatus: (shipmentId: string, status: DeliveryStatus) => void;
  onSwitchRole: (role: 'customer' | 'admin' | 'driver') => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onShowToast: (msg: string) => void;
}

export const DriverPortal: React.FC<DriverPortalProps> = ({
  driver,
  vehicle,
  shipments,
  orders,
  onUpdateShipmentStatus,
  onSwitchRole,
  isDarkMode,
  onToggleDarkMode,
  onShowToast,
}) => {
  const [driverStatus, setDriverStatus] = useState<Driver['status']>(driver.status || 'on_route');
  const [activeTab, setActiveTab] = useState<'assigned' | 'completed' | 'route'>('assigned');
  
  // OTP Verification Modal State
  const [otpModalShipment, setOtpModalShipment] = useState<Shipment | null>(null);
  const [inputOtp, setInputOtp] = useState<string>('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccess, setOtpSuccess] = useState<boolean>(false);

  // Filter shipments for this driver
  const myShipments = useMemo(() => {
    return shipments.filter(s => {
      // Driver matches by ID or name, or if unassigned and driver wants to see available local jobs
      return s.driverId === driver.id || s.driverName?.toLowerCase().includes('rahul') || s.driverId === 'D-101';
    });
  }, [shipments, driver]);

  const activeDeliveries = myShipments.filter(s => s.status !== 'delivered' && s.status !== 'cancelled');
  const completedDeliveries = myShipments.filter(s => s.status === 'delivered');

  // Find matching order for a shipment to verify OTP
  const getOrderForShipment = (shipment: Shipment): CustomerOrder | undefined => {
    return orders.find(o => o.id === shipment.id || o.trackingNumber === shipment.trackingCode || o.id === shipment.trackingCode);
  };

  const handleStatusChange = (newStatus: Driver['status']) => {
    setDriverStatus(newStatus);
    onShowToast(`Driver status set to: ${newStatus.replace('_', ' ').toUpperCase()}`);
  };

  const handleOpenOtpModal = (shipment: Shipment) => {
    setOtpModalShipment(shipment);
    setInputOtp('');
    setOtpError(null);
    setOtpSuccess(false);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpModalShipment) return;

    const matchedOrder = getOrderForShipment(otpModalShipment);
    const expectedOtp = matchedOrder?.deliveryOtp || '4829'; // default demo fallback

    if (inputOtp.trim() === expectedOtp || inputOtp.trim() === '4829' || inputOtp.trim() === '1234') {
      setOtpSuccess(true);
      setTimeout(() => {
        onUpdateShipmentStatus(otpModalShipment.id, 'delivered');
        onShowToast(`Delivery verified! Package #${otpModalShipment.trackingCode || otpModalShipment.id} delivered.`);
        setOtpModalShipment(null);
        setOtpSuccess(false);
      }, 1000);
    } else {
      setOtpError(`Incorrect OTP. Ask the customer for their 4-digit security code (Demo hint: ${expectedOtp})`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* Top Driver Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand & Driver badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                  SwiftCart Driver App
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400">
                  LIVE CORRIDOR
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Driver: <strong className="text-slate-700 dark:text-slate-200">{driver.name}</strong> • Vehicle: {vehicle?.plateNumber || 'RJ-14-AB-1024'}
              </p>
            </div>
          </div>

          {/* Quick Actions & Role Switcher */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850 transition cursor-pointer"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Switch to Customer or Admin */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => onSwitchRole('customer')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition cursor-pointer"
                title="Customer Store"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-blue-500" />
                <span className="hidden sm:inline">Store</span>
              </button>
              <button
                onClick={() => onSwitchRole('admin')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition cursor-pointer"
                title="Admin Dispatch Hub"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-500" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Driver Profile & Status Control Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            
            {/* Driver Specs */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-xl flex items-center justify-center shadow-lg shadow-emerald-600/20 shrink-0">
                RK
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {driver.name}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                    ★ {driver.rating || 4.9}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Assigned Vehicle: <strong className="text-slate-700 dark:text-slate-200">{vehicle?.name || 'Tata Ace EV (RJ-14-AB-1024)'}</strong> • Capacity: 150 kg
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                  <span>Phone: <a href={`tel:${driver.phone}`} className="text-blue-600 font-semibold">{driver.phone}</a></span>
                  <span>•</span>
                  <span>Hub: Sitapura Logistics Terminal</span>
                </div>
              </div>
            </div>

            {/* Status Selector Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                My Duty Status:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                {(['available', 'on_route', 'break', 'offline'] as Driver['status'][]).map(st => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                      driverStatus === st
                        ? st === 'on_route'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : st === 'available'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : st === 'break'
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'bg-slate-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
            <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <span className="text-[11px] font-medium text-slate-500">Active Deliveries</span>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{activeDeliveries.length}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <span className="text-[11px] font-medium text-slate-500">Completed Today</span>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{completedDeliveries.length}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <span className="text-[11px] font-medium text-slate-500">Battery Level</span>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Zap className="w-4 h-4 text-emerald-500" />
                88%
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <span className="text-[11px] font-medium text-slate-500">Route Efficiency</span>
              <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">98.4%</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('assigned')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'assigned'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <PackageIcon className="w-4 h-4" />
            <span>Active Stops ({activeDeliveries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Completed Deliveries ({completedDeliveries.length})</span>
          </button>
        </div>

        {/* TAB 1: ACTIVE DELIVERIES */}
        {activeTab === 'assigned' && (
          <div className="space-y-4">
            {activeDeliveries.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-3">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">All deliveries completed!</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  You have cleared your active route queue. Take a break or return to the fulfillment hub for additional packages.
                </p>
              </div>
            ) : (
              activeDeliveries.map((shipment, index) => {
                const matchedOrder = getOrderForShipment(shipment);
                const isOutForDelivery = shipment.status === 'out_for_delivery';
                const isInTransit = shipment.status === 'in_transit';

                return (
                  <div
                    key={shipment.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-blue-300 dark:hover:border-blue-700 transition"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      
                      {/* Left: Sequence & Recipient info */}
                      <div className="flex items-start gap-3.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                          #{index + 1}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                              {shipment.trackingCode || shipment.id}
                            </span>
                            <StatusBadge status={shipment.status} />
                            <PriorityBadge priority={shipment.priority} />
                            <span className="text-xs text-slate-500">
                              {shipment.weightKg} kg
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-slate-900 dark:text-white">
                            {shipment.recipient || shipment.customerName || 'Valued Customer'}
                          </h4>

                          <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span>{shipment.deliveryAddress || 'Sitapura Industrial Zone, Jaipur'}</span>
                          </p>

                          {matchedOrder && (
                            <p className="text-[11px] text-slate-500">
                              Items: {matchedOrder.items.map(i => `${i.product.name} (x${i.quantity})`).join(', ')} • Total: ₹{matchedOrder.total.toLocaleString('en-IN')}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2.5 flex-wrap pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                        
                        {/* Call customer */}
                        <a
                          href={`tel:${shipment.recipientPhone || shipment.customerPhone || '+919829155220'}`}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition cursor-pointer"
                        >
                          <Phone className="w-3.5 h-3.5 text-blue-500" />
                          <span>Call</span>
                        </a>

                        {/* Status progression */}
                        {shipment.status === 'assigned' && (
                          <button
                            onClick={() => {
                              onUpdateShipmentStatus(shipment.id, 'picked_up');
                              onShowToast(`Package #${shipment.trackingCode || shipment.id} marked as Picked Up.`);
                            }}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm cursor-pointer"
                          >
                            Mark Picked Up
                          </button>
                        )}

                        {(shipment.status === 'picked_up' || shipment.status === 'in-queue') && (
                          <button
                            onClick={() => {
                              onUpdateShipmentStatus(shipment.id, 'in_transit');
                              onShowToast(`Package #${shipment.trackingCode || shipment.id} now in transit.`);
                            }}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm cursor-pointer"
                          >
                            Start Transit
                          </button>
                        )}

                        {shipment.status === 'in_transit' && (
                          <button
                            onClick={() => {
                              onUpdateShipmentStatus(shipment.id, 'out_for_delivery');
                              onShowToast(`Package #${shipment.trackingCode || shipment.id} out for delivery!`);
                            }}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 transition shadow-sm cursor-pointer"
                          >
                            Out for Delivery
                          </button>
                        )}

                        {/* Deliver with OTP Verification */}
                        {shipment.status === 'out_for_delivery' && (
                          <button
                            onClick={() => handleOpenOtpModal(shipment)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-md shadow-emerald-600/20 cursor-pointer animate-pulse"
                          >
                            <KeyRound className="w-4 h-4" />
                            <span>Verify OTP & Deliver</span>
                          </button>
                        )}

                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: COMPLETED DELIVERIES */}
        {activeTab === 'completed' && (
          <div className="space-y-3">
            {completedDeliveries.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-500">
                No completed deliveries yet today.
              </div>
            ) : (
              completedDeliveries.map((shipment) => (
                <div
                  key={shipment.id}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                          {shipment.trackingCode || shipment.id}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                          Delivered Successfully
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Delivered to {shipment.recipient || 'Customer'} • {shipment.deliveryAddress}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-medium shrink-0">
                    OTP Verified ✓
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: LIVE ROUTE & GOOGLE MAPS NAVIGATION */}
        {activeTab === 'route' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-blue-600" />
                    <span>Live Driver Route & Turn-by-Turn Map</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sequenced delivery stops across Jaipur for vehicle {vehicle?.code || 'V-101'}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {activeDeliveries.length} Stops Remaining
                </span>
              </div>

              <GoogleSmartRouteOptimizerMap
                startLocation={{ name: 'Jaipur Central Warehouse', lat: 26.8524, lng: 75.7685 }}
                stops={activeDeliveries.slice(0, 4).map((d, i) => ({
                  id: d.id,
                  name: d.recipient || `Stop ${i + 1}`,
                  lat: 26.862 + (i % 2 === 0 ? 0.03 : -0.01),
                  lng: 75.76 + (i * 0.025),
                  stopNumber: i + 1,
                  packageCode: d.trackingCode,
                  address: d.deliveryAddress,
                }))}
                originalDistanceKm={28.5}
                optimizedDistanceKm={19.8}
                originalTimeMin={54}
                optimizedTimeMin={38}
                fuelEstimatedL={2.1}
              />
            </div>
          </div>
        )}

      </main>

      {/* OTP Delivery Verification Modal */}
      {otpModalShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shadow-md">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Customer Delivery Verification
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ask recipient <strong>{otpModalShipment.recipient}</strong> for their 4-digit security code shown in their SwiftCart Order Tracking.
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 text-center">
                  Enter 4-Digit Customer OTP
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={inputOtp}
                  onChange={(e) => setInputOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • •"
                  className="w-full text-center tracking-[1em] text-2xl font-mono font-bold py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  autoFocus
                />
              </div>

              {/* Demo Hint */}
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-center">
                <p className="text-[11px] text-blue-700 dark:text-blue-300 font-medium">
                  🔑 Demo security OTP for this order is: <strong className="font-mono font-bold">{getOrderForShipment(otpModalShipment)?.deliveryOtp || '4829'}</strong>
                </p>
              </div>

              {otpError && (
                <p className="text-xs text-rose-600 dark:text-rose-400 text-center font-semibold">
                  {otpError}
                </p>
              )}

              {otpSuccess && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>OTP Verified! Marking as Delivered...</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOtpModalShipment(null)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inputOtp.length < 4 || otpSuccess}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  Confirm Delivery
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
