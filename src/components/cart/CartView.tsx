import React, { useState } from 'react';
import { 
  Trash2, 
  ArrowRight, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  Tag, 
  Check, 
  Sparkles,
  Zap,
  BookmarkPlus,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { CartItem, ActiveView, Address } from '../../types/ecommerce';

interface CartViewProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onSaveForLater?: (productId: string) => void;
  onProceedToCheckout: () => void;
  setActiveView: (view: ActiveView) => void;
  selectedAddress?: Address;
  onOpenAddressPicker?: () => void;
}

export const CartView: React.FC<CartViewProps> = ({
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onSaveForLater,
  onProceedToCheckout,
  setActiveView,
  selectedAddress,
  onOpenAddressPicker,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const originalTotal = cartItems.reduce(
    (sum, item) => sum + item.product.originalPrice * item.quantity,
    0
  );

  const totalItemsCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const productSavings = originalTotal - subtotal;
  const finalTotal = Math.max(0, subtotal - couponDiscount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'SWIFT500') {
      setCouponDiscount(500);
      setCouponApplied(true);
    } else if (couponCode.toUpperCase() === 'WELCOME') {
      setCouponDiscount(300);
      setCouponApplied(true);
    } else {
      setCouponDiscount(Math.min(1000, Math.round(subtotal * 0.05)));
      setCouponApplied(true);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="py-16 bg-slate-50/50 dark:bg-slate-950 min-h-[70vh] flex items-center justify-center select-none">
        <div className="max-w-md w-full mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Your cart is empty!
          </h2>
          <p className="text-xs text-slate-500 mt-2 mb-6">
            Explore SwiftCart top deals, mobiles, and trending electronics.
          </p>
          <button
            onClick={() => setActiveView('products')}
            className="px-6 py-3 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md inline-flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 bg-blue-600 hover:bg-blue-700"
          >
            <span>Shop Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 dark:bg-slate-950 min-h-screen pb-28 sm:pb-16 select-none">
      
      {/* 1. DELIVER-TO ADDRESS STRIP AT TOP (Flipkart Mobile Style) */}
      {selectedAddress && (
        <div 
          onClick={onOpenAddressPicker}
          className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-6 py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="w-4 h-4 shrink-0 text-[#2874f0]" />
            <div className="text-xs truncate">
              <span className="text-slate-500">Deliver to: </span>
              <strong className="text-slate-900 dark:text-white">{selectedAddress.name}, {selectedAddress.pincode}</strong>
            </div>
          </div>
          <button className="text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 px-2.5 py-1 rounded-lg shrink-0">
            Change
          </button>
        </div>
      )}

      {/* 2. FREE DELIVERY PROGRESS METER */}
      <div className="bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-900/40 px-3 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
          <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Yay! Your order qualifies for <strong>FREE Express Delivery</strong>.</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 pt-3 sm:pt-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          
          {/* Left: Cart Items List */}
          <div className="lg:col-span-8 space-y-2.5 sm:space-y-4">
            
            {cartItems.map((item) => {
              const product = item.product;
              return (
                <div
                  key={product.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 sm:p-4 shadow-2xs"
                >
                  <div className="flex gap-3 items-start">
                    
                    {/* Thumbnail */}
                    <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl bg-slate-50 dark:bg-slate-950 p-1.5 shrink-0 border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                      <img
                        src={product.thumbnail}
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 leading-tight">
                          {product.name}
                        </h3>
                        <button
                          onClick={() => onRemoveItem(product.id)}
                          className="text-slate-400 hover:text-rose-500 p-1 transition cursor-pointer shrink-0"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-500 mt-0.5">{product.brand}</p>

                      {/* Price Strip */}
                      <div className="flex items-baseline gap-1.5 mt-1.5">
                        <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                          ₹{(product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice > product.price && (
                          <>
                            <span className="text-[11px] text-slate-400 line-through">
                              ₹{(product.originalPrice * item.quantity).toLocaleString('en-IN')}
                            </span>
                            <span className="text-[11px] font-bold text-emerald-600">
                              {product.discountPercent}% off
                            </span>
                          </>
                        )}
                      </div>

                      {/* Delivery promise */}
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-current" />
                        <span>Delivery by Tomorrow, 11 AM</span>
                      </p>

                      {/* Stepper & Action buttons */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800">
                          <button
                            onClick={() => onUpdateQuantity(product.id, item.quantity - 1)}
                            className="px-2.5 py-0.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                          >
                            −
                          </button>
                          <span className="px-2 text-xs font-black text-slate-900 dark:text-white min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(product.id, item.quantity + 1)}
                            className="px-2.5 py-0.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center gap-3 text-xs">
                          {onSaveForLater && (
                            <button
                              onClick={() => onSaveForLater(product.id)}
                              className="text-slate-500 hover:text-blue-600 cursor-pointer text-[11px] font-semibold"
                            >
                              Save for later
                            </button>
                          )}
                          <button
                            onClick={() => onRemoveItem(product.id)}
                            className="text-rose-500 hover:text-rose-600 cursor-pointer text-[11px] font-semibold"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}

          </div>

          {/* Right: Price Details Card */}
          <div className="lg:col-span-4 space-y-3">
            
            {/* Coupon Box */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 shadow-2xs">
              <p className="text-xs font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-blue-600" />
                <span>Apply Coupons & Promo Code</span>
              </p>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="e.g. SWIFT500"
                  disabled={couponApplied}
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 uppercase font-bold text-slate-900 dark:text-white outline-hidden"
                />
                <button
                  type="submit"
                  disabled={couponApplied || !couponCode.trim()}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl cursor-pointer text-white bg-blue-600 hover:bg-blue-700 transition"
                >
                  {couponApplied ? 'Applied' : 'Apply'}
                </button>
              </form>
              {couponApplied && (
                <p className="text-[11px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Coupon active! Saved ₹{couponDiscount.toLocaleString('en-IN')}</span>
                </p>
              )}
            </div>

            {/* Price Details Breakdown */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100 dark:border-slate-800">
                Price Details ({totalItemsCount} Items)
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Total MRP</span>
                  <span>₹{originalTotal.toLocaleString('en-IN')}</span>
                </div>

                {productSavings > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount on MRP</span>
                    <span>−₹{productSavings.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Delivery Charges</span>
                  <span className="text-emerald-600 font-bold">FREE</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupon Discount</span>
                    <span>−₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between text-sm font-black text-slate-900 dark:text-white">
                  <span>Total Amount</span>
                  <span className="text-base text-slate-900 dark:text-white">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {productSavings + couponDiscount > 0 && (
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-center">
                  <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                    You will save ₹{(productSavings + couponDiscount).toLocaleString('en-IN')} on this order
                  </p>
                </div>
              )}

              {/* Desktop Checkout CTA */}
              <button
                onClick={onProceedToCheckout}
                className="hidden sm:flex w-full py-3 rounded-xl font-black text-xs sm:text-sm items-center justify-center gap-2 shadow-md cursor-pointer transition active:scale-95 text-white bg-[#fb641b] hover:bg-[#e05412]"
              >
                <span>Place Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Safe and Secure Payments • 100% Authentic Products
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* 3. FLIPKART STYLE SIGNATURE MOBILE STICKY BOTTOM CHECKOUT BAR */}
      <div className="sm:hidden fixed bottom-14 left-0 right-0 z-30 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-3 px-4 flex items-center justify-between shadow-2xl">
        <div>
          <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Price</p>
          <p className="text-base font-black text-slate-900 dark:text-white">
            ₹{finalTotal.toLocaleString('en-IN')}
          </p>
        </div>

        <button
          onClick={onProceedToCheckout}
          className="py-2.5 px-6 rounded-xl font-black text-xs shadow-md cursor-pointer active:scale-95 flex items-center gap-1.5 text-white bg-[#fb641b] hover:bg-[#e05412]"
        >
          <span>Place Order</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
