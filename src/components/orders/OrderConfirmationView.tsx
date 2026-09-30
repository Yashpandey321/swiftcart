import React from 'react';
import { CheckCircle2, Truck, ShoppingBag, ArrowRight, MapPin, Sparkles, Copy, Check } from 'lucide-react';
import { CustomerOrder, ActiveView } from '../../types/ecommerce';

interface OrderConfirmationViewProps {
  order: CustomerOrder;
  onTrackOrder: (orderId: string) => void;
  setActiveView: (view: ActiveView) => void;
}

export const OrderConfirmationView: React.FC<OrderConfirmationViewProps> = ({
  order,
  onTrackOrder,
  setActiveView,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="py-12 bg-slate-50/50 dark:bg-slate-950 min-h-screen flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto px-4 sm:px-6">
        
        {/* Success Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
          
          {/* Animated Green Check icon */}
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-12 h-12 stroke-[2.2]" />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Dispatch Corridor Initialized</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Order Placed Successfully!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Thank you for shopping with SwiftCart. We've sent a detailed confirmation invoice to your email.
            </p>
          </div>

          {/* Order Details Pill */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-center sm:text-left">
              <p className="text-slate-400 font-semibold text-[11px]">Order Identifier</p>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                  #{order.id}
                </span>
                <button
                  onClick={handleCopyId}
                  className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
                  title="Copy Order ID"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <p className="text-slate-400 font-semibold text-[11px]">Estimated Doorstep Arrival</p>
              <p className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                {order.estimatedDelivery}
              </p>
            </div>
          </div>

          {/* Destination & Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-xs">
            {/* Delivery Address */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
              <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                Shipping Destination
              </p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{order.address.name}</p>
              <p className="text-slate-500 mt-0.5">{order.address.street}</p>
              <p className="text-slate-500">{order.address.city}, {order.address.state} - {order.address.pincode}</p>
              <p className="text-slate-400 mt-1">Phone: {order.address.phone}</p>
            </div>

            {/* Total Paid & Payment method */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
              <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1.5">
                <Truck className="w-3.5 h-3.5 text-blue-600" />
                Fulfillment Summary
              </p>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Method:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{order.deliveryOption.title}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Payment:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase">{order.paymentDetails.method}</span>
              </div>
              <div className="flex justify-between py-1 border-t border-slate-100 dark:border-slate-800 mt-1 font-bold text-slate-900 dark:text-white">
                <span>Total Paid:</span>
                <span className="text-blue-600 dark:text-blue-400">₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Items Preview */}
          <div className="text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Items Ordered ({order.items.length})
            </h4>
            <div className="space-y-2 max-h-36 overflow-y-auto">
              {order.items.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={item.product.thumbnail} alt="" className="w-9 h-9 object-cover rounded-lg" referrerPolicy="no-referrer" />
                    <div className="truncate">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{item.product.name}</p>
                      <p className="text-[11px] text-slate-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => {
                onTrackOrder(order.id);
                setActiveView('order-tracking');
              }}
              className="py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Track Live Package</span>
            </button>

            <button
              onClick={() => setActiveView('products')}
              className="py-3.5 px-6 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Continue Shopping</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
