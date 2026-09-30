import React from 'react';
import { 
  User, 
  Package, 
  Truck, 
  MapPin, 
  LogOut, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink,
  ShieldCheck,
  ShoppingBag,
  Plus
} from 'lucide-react';
import { UserAccount } from '../../types/auth';
import { CustomerOrder, Address, ActiveView } from '../../types/ecommerce';

interface UserDashboardViewProps {
  currentUser: UserAccount;
  orders: CustomerOrder[];
  savedAddresses: Address[];
  onSelectOrderToTrack: (orderId: string) => void;
  onLogout: () => void;
  setActiveView: (view: ActiveView) => void;
}

export const UserDashboardView: React.FC<UserDashboardViewProps> = ({
  currentUser,
  orders,
  savedAddresses,
  onSelectOrderToTrack,
  onLogout,
  setActiveView,
}) => {
  // Find active delivery (e.g. status !== 'delivered' && !== 'cancelled') or most recent order
  const activeOrder = orders.find(o => 
    o.status === 'out_for_delivery' || 
    o.status === 'shipped' || 
    o.status === 'processing' ||
    o.status === 'packed'
  ) || orders[0];

  const recentOrders = orders.slice(0, 4);

  return (
    <div className="py-8 bg-slate-50/50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Welcome Header Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center text-white font-black text-2xl shadow-inner shrink-0">
              {currentUser.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Welcome back, {currentUser.fullName.split(' ')[0]} 👋
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 font-extrabold text-[10px] tracking-wide">
                  ★ {currentUser.membershipTier || 'Prime Member'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-100 mt-1">
                Account ID: <code className="font-mono">{currentUser.userId}</code> • {currentUser.email} • {currentUser.mobile}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={() => setActiveView('profile')}
              className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition"
            >
              <User className="w-3.5 h-3.5" />
              <span>Profile & Settings</span>
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-rose-600/80 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-white/20 transition"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* ACTIVE DELIVERY CARD */}
        {activeOrder && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-blue-500/30 dark:border-blue-500/20 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Your Active Delivery
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
                  Order #{activeOrder.id}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50">
                  {activeOrder.status === 'out_for_delivery' ? '🚚 Out for Delivery' : activeOrder.status}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50">
                  ⏱ ETA: 18 minutes
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-750">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Package Contents</p>
                <p className="font-bold text-slate-900 dark:text-white text-sm mt-1 truncate">
                  {activeOrder.items[0]?.product?.name || 'SwiftCart Package'}
                </p>
                <p className="text-slate-500 text-[11px]">
                  {activeOrder.items.length} item(s) • Total: ₹{activeOrder.total.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-750">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Destination</p>
                <p className="font-bold text-slate-900 dark:text-white text-sm mt-1 truncate">
                  {activeOrder.address.street}
                </p>
                <p className="text-slate-500 text-[11px]">
                  {activeOrder.address.city}, {activeOrder.address.state} - {activeOrder.address.pincode}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-750">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Assigned Driver & Security</p>
                <p className="font-bold text-slate-900 dark:text-white text-sm mt-1">
                  {activeOrder.deliveryPartner?.name || 'Rahul Kumar (Tata Ace EV)'}
                </p>
                <p className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                  Delivery Security OTP: {activeOrder.deliveryOtp || '4821'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500">
                Live Google Maps telemetry active for doorstep drop-off.
              </span>
              <button
                onClick={() => {
                  onSelectOrderToTrack(activeOrder.id);
                  setActiveView('order-tracking');
                }}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer transition"
              >
                <Truck className="w-4 h-4" />
                <span>Track Active Order on Google Maps</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* 2-COLUMN GRID: SAVED DELIVERY ADDRESS & RECENT ORDERS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Saved Delivery Address */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Primary Delivery Address
                  </h3>
                </div>
                <button
                  onClick={() => setActiveView('profile')}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Edit in Profile
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-750 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {currentUser.fullName}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300">
                    Home (Default)
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 pt-1 leading-relaxed">
                  {currentUser.address}
                </p>
                <p className="text-slate-600 dark:text-slate-300 font-medium">
                  {currentUser.city}, {currentUser.state} - {currentUser.pincode}
                </p>
                <p className="text-slate-400 text-[11px] pt-1">
                  Mobile: {currentUser.mobile}
                </p>
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Google Maps Geocoded ({currentUser.latitude?.toFixed(4)}°, {currentUser.longitude?.toFixed(4)}°)</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setActiveView('products')}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Browse Products</span>
                </button>
                <button
                  onClick={() => setActiveView('cart')}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>View Cart</span>
                </button>
              </div>
            </div>

            {/* Quick stats banner */}
            <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-md flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-400 font-bold uppercase">Member Privileges</p>
                <p className="text-sm font-black mt-0.5">Priority Next-Day Dispatch</p>
                <p className="text-xs text-blue-300">Guaranteed corridor routing</p>
              </div>
              <ShieldCheck className="w-8 h-8 text-blue-400 shrink-0" />
            </div>
          </div>

          {/* Right: Recent Orders & Order History */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Recent Orders ({orders.length})
                  </h3>
                </div>
                <button
                  onClick={() => setActiveView('orders')}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  View All Orders
                </button>
              </div>

              {recentOrders.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <Package className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p className="text-xs font-semibold">No orders found.</p>
                  <button
                    onClick={() => setActiveView('products')}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                          {order.items[0]?.product?.thumbnail ? (
                            <img
                              src={order.items[0].product.thumbnail}
                              alt=""
                              className="w-12 h-12 rounded-xl object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <Package className="w-6 h-6 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                              #{order.id}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                              {order.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-1">
                            {order.items.map(i => i.product.name).join(', ')}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            ₹{order.total.toLocaleString('en-IN')} • {order.address.city}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            onSelectOrderToTrack(order.id);
                            setActiveView('order-tracking');
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-bold flex items-center gap-1 cursor-pointer transition"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Track</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
