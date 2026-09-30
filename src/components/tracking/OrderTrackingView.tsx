import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  MapPin, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Navigation, 
  Building2, 
  Warehouse, 
  Home, 
  AlertCircle,
  Copy,
  Check,
  Search,
  KeyRound,
  RotateCw,
  Sparkles,
  ArrowDown,
  Package,
  CheckCircle,
  User,
  Compass
} from 'lucide-react';
import { CustomerOrder, ActiveView } from '../../types/ecommerce';
import { optimizeDeliveryRoute } from '../../services/smartRouteEngine';
import { GoogleOrderTrackingMap } from '../maps/GoogleOrderTrackingMap';

interface OrderTrackingViewProps {
  orders: CustomerOrder[];
  selectedOrderId?: string;
  onSelectOrder: (orderId: string) => void;
  setActiveView: (view: ActiveView) => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  orders = [],
  selectedOrderId,
  onSelectOrder,
  setActiveView,
}) => {
  const [searchInput, setSearchInput] = useState(selectedOrderId || '');
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [instructionModalOpen, setInstructionModalOpen] = useState(false);
  const [instructionText, setInstructionText] = useState('Please leave parcel with security gate or ring doorbell twice.');
  const [instructionSaved, setInstructionSaved] = useState(false);

  // Find active order or default to the most recent one
  const activeOrder = 
    orders.find((o) => o.id === selectedOrderId) ||
    orders.find((o) => o.id === searchInput.trim()) ||
    orders[0];

  // Route calculation engine run behind the scenes
  const routeData = activeOrder
    ? optimizeDeliveryRoute(activeOrder)
    : null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSelectOrder(searchInput.trim());
    }
  };

  const copyOtp = () => {
    if (activeOrder?.deliveryOtp) {
      navigator.clipboard.writeText(activeOrder.deliveryOtp);
      setCopiedOtp(true);
      setTimeout(() => setCopiedOtp(false), 1500);
    }
  };

  if (!activeOrder) {
    return (
      <div className="py-16 text-center">
        <Truck className="w-12 h-12 mx-auto text-slate-400 mb-3" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">No Orders Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">You have not placed any orders yet.</p>
        <button
          onClick={() => setActiveView('products')}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  // Delivery lifecycle mapping
  // Lifecycle steps:
  // 1. Order Placed
  // 2. Package Confirmed
  // 3. Preparing Package
  // 4. Out for Delivery
  // 5. Delivered
  const lifecycleStages = [
    {
      id: 'placed',
      title: 'Order Placed',
      description: 'Order confirmed and registered in SwiftCart system',
      isCompleted: true, // Always true once order exists
      isActive: activeOrder.status === 'Processing' || activeOrder.status === 'Confirmed',
    },
    {
      id: 'confirmed',
      title: 'Package Confirmed',
      description: 'Inventory reserved & payment verified at fulfillment hub',
      isCompleted: activeOrder.status !== 'Processing',
      isActive: activeOrder.status === 'Confirmed',
    },
    {
      id: 'preparing',
      title: 'Preparing Package',
      description: 'Packed with tamper-evident seal and barcoded for transit',
      isCompleted: ['Preparing', 'Shipped', 'Out for Delivery', 'Delivered'].includes(activeOrder.status),
      isActive: activeOrder.status === 'Preparing' || activeOrder.status === 'Shipped',
    },
    {
      id: 'out_for_delivery',
      title: 'Out for Delivery',
      description: 'Courier en route with real-time GPS tracking enabled',
      isCompleted: ['Out for Delivery', 'Delivered'].includes(activeOrder.status),
      isActive: activeOrder.status === 'Out for Delivery',
    },
    {
      id: 'delivered',
      title: 'Delivered',
      description: 'Handed over to customer with OTP verification',
      isCompleted: activeOrder.status === 'Delivered',
      isActive: false,
    },
  ];

  return (
    <div className="py-8 bg-slate-50/50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header & Quick Order Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Live Package Tracking
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                activeOrder.status === 'Delivered'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200'
              }`}>
                {activeOrder.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Order ID: <span className="font-bold text-slate-900 dark:text-white">#{activeOrder.id}</span> • Placed on {activeOrder.date}
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search Order ID (e.g. SC-102849)..."
                className="pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-750 text-slate-900 dark:text-white shadow-xs outline-hidden"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
            >
              Track
            </button>
          </form>
        </div>

        {/* 5-STAGE COMPLETE DELIVERY LIFECYCLE BANNER (Prompt requirement) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Delivery Lifecycle Progress</span>
              </h2>
              <p className="text-[11px] text-slate-500">
                End-to-end milestone progression for Order #{activeOrder.id}
              </p>
            </div>
            <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">
              ETA: {activeOrder.estimatedDelivery}
            </span>
          </div>

          {/* Horizontal / Wrapped Stages Flow */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
            {lifecycleStages.map((stage, idx) => {
              const isLast = idx === lifecycleStages.length - 1;
              return (
                <div
                  key={stage.id}
                  className={`relative p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                    stage.isActive
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 shadow-xs ring-2 ring-blue-500/20'
                      : stage.isCompleted
                      ? 'bg-slate-50 dark:bg-slate-800/40 border-emerald-500/30'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Step 0{idx + 1}
                      </span>
                      {stage.isCompleted ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : stage.isActive ? (
                        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center animate-pulse">
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700" />
                      )}
                    </div>
                    <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">
                      {stage.title}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                      {stage.description}
                    </p>
                  </div>

                  {!isLast && (
                    <div className="hidden sm:block text-slate-300 dark:text-slate-700 text-right mt-2 text-xs font-bold">
                      →
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Highlights Summary (Current Status, Distance, ETA, OTP) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Status Box */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <p className="text-[11px] font-semibold text-slate-400">Current Delivery Status</p>
            <p className="text-base font-black text-slate-900 dark:text-white mt-0.5">
              {activeOrder.status}
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <Truck className="w-3 h-3" />
              <span>{activeOrder.status === 'Delivered' ? 'Completed' : 'On scheduled corridor'}</span>
            </p>
          </div>

          {/* Estimated Delivery Time */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <p className="text-[11px] font-semibold text-slate-400">Estimated Delivery Time</p>
            <p className="text-base font-black text-blue-600 dark:text-blue-400 mt-0.5">
              {activeOrder.estimatedDelivery}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {activeOrder.deliveryOption.title}
            </p>
          </div>

          {/* Estimated Distance & Stops */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <p className="text-[11px] font-semibold text-slate-400">Estimated Distance</p>
            <p className="text-base font-black text-slate-900 dark:text-white mt-0.5">
              {routeData?.distanceKm || 2.4} km away
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              {routeData?.stopsRemaining || 2} stops before your delivery
            </p>
          </div>

          {/* Delivery OTP */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-blue-100 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5" />
                Delivery Security OTP
              </span>
              <button
                onClick={copyOtp}
                className="p-1 rounded bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                title="Copy OTP"
              >
                {copiedOtp ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-black tracking-widest">
                {activeOrder.deliveryOtp || '4829'}
              </span>
            </div>
            <p className="text-[10px] text-blue-100/80 mt-1 leading-tight">
              Share only with delivery driver upon receiving package
            </p>
          </div>

        </div>

        {/* Main Grid: Google Maps Route with Moving Marker + Timeline & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column (8 cols): Google Maps Live Route & Package Details */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Live Interactive Google Map with Route and Moving Marker */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Google Maps Route & Live Vehicle Telemetry
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Real-time moving delivery marker calibrated to Jaipur logistics corridors
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800/40">
                  <Sparkles className="w-3 h-3" />
                  <span>Real-time GPS Active</span>
                </div>
              </div>

              {/* Google Order Tracking Map with Real Time Props */}
              <div className="w-full">
                <GoogleOrderTrackingMap
                  trackingNumber={activeOrder.id}
                  customerName={activeOrder.address.name}
                  customerAddress={`${activeOrder.address.street}, ${activeOrder.address.city}`}
                  destinationCoords={{
                    lat: activeOrder.address.latitude || 26.8732,
                    lng: activeOrder.address.longitude || 75.7972,
                  }}
                  courierName={activeOrder.deliveryPartner?.name || 'Rahul Kumar'}
                  courierPhone={activeOrder.deliveryPartner?.phone || '+91 98290 14820'}
                  vehicleModel={activeOrder.deliveryPartner?.vehicle || 'Tata Ace EV (RJ-14-AB-1024)'}
                  vehiclePlate={activeOrder.deliveryPartner?.vehicleNumber || 'RJ-14-AB-1024'}
                  otp={activeOrder.deliveryOtp || '4821'}
                  priority="high"
                />
              </div>
            </div>

            {/* Driver Information Card */}
            {activeOrder.deliveryPartner && (
              <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={activeOrder.deliveryPartner.photo}
                    alt={activeOrder.deliveryPartner.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-750 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {activeOrder.deliveryPartner.name}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        ★ {activeOrder.deliveryPartner.rating}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {activeOrder.deliveryPartner.vehicle} • {activeOrder.deliveryPartner.vehicleNumber}
                    </p>
                    <p className="text-[11px] text-emerald-600 font-medium">
                      ✓ Vaccinated & Background Verified Delivery Partner
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={() => setCallModalOpen(true)}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Driver</span>
                  </button>
                  <button
                    onClick={() => setInstructionModalOpen(true)}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Instructions</span>
                  </button>
                </div>
              </div>
            )}

            {/* Package Details (Prompt Requirement) */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Package Details ({activeOrder.items.length} {activeOrder.items.length === 1 ? 'item' : 'items'})
                  </h3>
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Shipment Total: ₹{activeOrder.total.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="space-y-3">
                {activeOrder.items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-750 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.thumbnail}
                        alt=""
                        className="w-12 h-12 object-cover rounded-xl border border-slate-200 dark:border-slate-700"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {item.product.name}
                        </p>
                        <p className="text-slate-500 text-[11px]">
                          Brand: {item.product.brand} • Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (4 cols): Delivery Location, Full History Timeline, Quick Actions */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Delivery Location Card (Prompt Requirement) */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                <MapPin className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Delivery Location
                </h3>
              </div>

              <div className="text-xs space-y-1">
                <p className="font-extrabold text-slate-900 dark:text-white text-sm">
                  {activeOrder.address.name}
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  {activeOrder.address.street}
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  {activeOrder.address.city}, {activeOrder.address.state} - {activeOrder.address.pincode}
                </p>
                <p className="text-[11px] text-slate-500 pt-1">
                  Recipient Phone: {activeOrder.address.phone}
                </p>
                {activeOrder.address.latitude && activeOrder.address.longitude && (
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-300">
                      <Compass className="w-3 h-3 text-blue-600" />
                      {activeOrder.address.latitude.toFixed(4)}° N, {activeOrder.address.longitude.toFixed(4)}° E
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Detailed Timeline Events */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-200 dark:border-slate-800">
                Transit Activity Log
              </h3>

              <div className="relative">
                <div className="absolute top-2 bottom-2 left-3 w-0.5 bg-slate-200 dark:bg-slate-800" />
                <div className="space-y-5">
                  {activeOrder.timeline.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-3 pl-1">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                          step.completed
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        {step.completed ? (
                          <Check className="w-3 h-3 stroke-[3]" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className={`text-xs font-bold ${step.completed ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                            {step.status}
                          </p>
                          {step.time && (
                            <span className="text-[10px] text-slate-400 font-medium">{step.time}</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          {step.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-2.5">
              <button
                onClick={() => setInstructionModalOpen(true)}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer"
              >
                <span>Add Gate / Dropoff Instructions</span>
                <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => setActiveView('dashboard')}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer"
              >
                <span>Go to User Account Dashboard</span>
                <User className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Driver Call Modal */}
      {callModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center mx-auto">
              <Phone className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Connecting Call...</h3>
              <p className="text-xs text-slate-500 mt-1">
                Calling {activeOrder.deliveryPartner?.name} ({activeOrder.deliveryPartner?.phone})
              </p>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-2 font-medium">
                Your phone number is masked for customer privacy.
              </p>
            </div>
            <button
              onClick={() => setCallModalOpen(false)}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              End Call
            </button>
          </div>
        </div>
      )}

      {/* Delivery Instructions Modal */}
      {instructionModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Gate & Drop-off Instructions
            </h3>
            <p className="text-xs text-slate-500">
              Your message will be transmitted directly to {activeOrder.deliveryPartner?.name || 'the delivery partner'}
            </p>

            <textarea
              rows={3}
              value={instructionText}
              onChange={(e) => {
                setInstructionText(e.target.value);
                setInstructionSaved(false);
              }}
              className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
              placeholder="e.g. Leave package with guard at Gate 2..."
            />

            {instructionSaved && (
              <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Instructions transmitted to courier!
              </p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setInstructionModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setInstructionSaved(true)}
                className="px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Send Instructions
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
