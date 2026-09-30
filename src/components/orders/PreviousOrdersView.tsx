import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  RotateCcw, 
  Download, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Search,
  ArrowRight,
  ShoppingBag,
  FileText
} from 'lucide-react';
import { CustomerOrder, ActiveView, Product } from '../../types/ecommerce';

interface PreviousOrdersViewProps {
  orders: CustomerOrder[];
  onTrackOrder: (orderId: string) => void;
  onBuyAgain: (product: Product) => void;
  setActiveView: (view: ActiveView) => void;
}

export const PreviousOrdersView: React.FC<PreviousOrdersViewProps> = ({
  orders,
  onTrackOrder,
  onBuyAgain,
  setActiveView,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [invoiceDownloadedId, setInvoiceDownloadedId] = useState<string | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.status.toLowerCase().includes(q) ||
      o.items.some((i) => i.product.name.toLowerCase().includes(q))
    );
  });

  const handleDownloadInvoice = (orderId: string) => {
    setInvoiceDownloadedId(orderId);
    setTimeout(() => setInvoiceDownloadedId(null), 2000);
  };

  return (
    <div className="py-8 bg-slate-50/50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              My Orders ({orders.length})
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review history, track ongoing deliveries, or repurchase favorite items
            </p>
          </div>

          {/* Search in orders */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search by product or Order ID..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden shadow-2xs"
            />
          </div>
        </div>

        {/* Orders List */}
        <div className="mt-6 space-y-5">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const isDelivered = order.status === 'Delivered';
              return (
                <div
                  key={order.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden"
                >
                  {/* Top Bar of Card */}
                  <div className="p-4 sm:p-5 bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Order ID</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                          #{order.id}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Date Placed</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {order.date}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Amount</span>
                        <span className="font-extrabold text-blue-600 dark:text-blue-400">
                          ₹{order.total.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                          isDelivered
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 animate-pulse'
                        }`}
                      >
                        {isDelivered ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Truck className="w-3.5 h-3.5" />}
                        <span>{order.status}</span>
                      </span>
                    </div>
                  </div>

                  {/* Body: Items & Actions */}
                  <div className="p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    
                    {/* Items List in this Order */}
                    <div className="space-y-3 flex-1">
                      {order.items.map((item) => (
                        <div key={item.product.id} className="flex items-center gap-4">
                          <img
                            src={item.product.thumbnail}
                            alt={item.product.name}
                            className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">
                              {item.product.brand}
                            </span>
                            <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                              {item.product.name}
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Qty: {item.quantity} • ₹{item.product.price.toLocaleString('en-IN')} each
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons Column */}
                    <div className="flex flex-wrap lg:flex-col gap-2 shrink-0 lg:w-48">
                      <button
                        onClick={() => {
                          onTrackOrder(order.id);
                          setActiveView('order-tracking');
                        }}
                        className="flex-1 lg:flex-initial py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track Package</span>
                      </button>

                      {order.items[0] && (
                        <button
                          onClick={() => onBuyAgain(order.items[0].product)}
                          className="flex-1 lg:flex-initial py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Buy Again</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDownloadInvoice(order.id)}
                        className="flex-1 lg:flex-initial py-2 px-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>
                          {invoiceDownloadedId === order.id ? 'Downloaded ✓' : 'Invoice (PDF)'}
                        </span>
                      </button>
                    </div>

                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
              <Package className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No orders found</h3>
              <p className="text-xs text-slate-500 mt-1 mb-5">
                We couldn't find any orders matching your search query.
              </p>
              <button
                onClick={() => setActiveView('products')}
                className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Browse All Products
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
