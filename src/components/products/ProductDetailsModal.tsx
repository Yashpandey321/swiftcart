import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Heart, 
  ShoppingBag, 
  Zap, 
  ShieldCheck, 
  RotateCcw, 
  MapPin, 
  Check, 
  Truck, 
  CreditCard,
  Package,
  Layers,
  Sparkles,
  Share2,
  Tag
} from 'lucide-react';
import { Product } from '../../types/ecommerce';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  onToggleWishlist: (productId: string) => void;
  isWishlisted: boolean;
  userPincode?: string;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  isWishlisted,
  userPincode = '302015',
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'box' | 'warranty'>('description');
  const [pincodeInput, setPincodeInput] = useState(userPincode);
  const [pincodeVerified, setPincodeVerified] = useState(true);
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleBuyNow = () => {
    onBuyNow(product, quantity);
    onClose();
  };

  const images = product.images.length > 0 ? product.images : [product.thumbnail];
  const activeImage = images[selectedImageIndex] || product.thumbnail;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div 
        className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mt-3 sm:hidden" />

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {product.brand}
            </span>
            <span className="text-[10px] font-black text-[#2874f0] flex items-center gap-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              SwiftAssured
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 pb-24 sm:pb-6 flex-1 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Left: Gallery */}
            <div className="md:col-span-5 space-y-3">
              <div className="relative aspect-square w-full rounded-2xl bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200/80 dark:border-slate-800 flex items-center justify-center">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                  referrerPolicy="no-referrer"
                />

                {product.discountPercent > 0 && (
                  <span className="absolute top-3 left-3 px-2 py-0.5 text-xs font-black bg-emerald-600 text-white rounded">
                    {product.discountPercent}% OFF
                  </span>
                )}

                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-slate-850 text-slate-400 hover:text-rose-500 shadow-md transition-transform active:scale-90 cursor-pointer"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer p-1 bg-slate-50 dark:bg-slate-950 ${
                        selectedImageIndex === idx
                          ? 'border-[#2874f0] ring-2 ring-blue-500/20'
                          : 'border-slate-200 dark:border-slate-700 opacity-70'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Details */}
            <div className="md:col-span-7 space-y-4">
              
              <div>
                <h1 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                  {product.name}
                </h1>

                {/* Rating line */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-600 text-white text-xs font-black">
                    <span>{product.rating}</span>
                    <Star className="w-3 h-3 fill-white" />
                  </div>
                  <span className="text-xs text-slate-500">
                    {product.reviewsCount.toLocaleString('en-IN')} Ratings & Reviews
                  </span>
                </div>
              </div>

              {/* Price Block */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice > product.price && (
                    <>
                      <span className="text-sm text-slate-400 line-through">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {product.discountPercent}% off
                      </span>
                    </>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Inclusive of all taxes</p>
              </div>

              {/* Flipkart / Amazon Available Offers */}
              <div className="space-y-1.5 text-xs">
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Available Offers & Deals:</span>
                </p>
                <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-[11px] space-y-1">
                  <p className="text-emerald-900 dark:text-emerald-300 font-semibold">
                    • <strong>Bank Offer:</strong> 10% Instant Discount up to ₹1,500 on HDFC & ICICI Cards
                  </p>
                  <p className="text-emerald-900 dark:text-emerald-300 font-semibold">
                    • <strong>Special Price:</strong> Get extra ₹2,000 off (price inclusive of cashback)
                  </p>
                  <p className="text-emerald-900 dark:text-emerald-300 font-semibold">
                    • <strong>No Cost EMI:</strong> Available on leading bank credit cards from ₹1,290/month
                  </p>
                </div>
              </div>

              {/* Delivery & Pincode Checker */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>Deliver to: {pincodeInput}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">FREE Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Delivery by <strong>Tomorrow, 5 PM</strong> via Swift Express</span>
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Qty:</span>
                <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold cursor-pointer"
                  >
                    −
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-slate-900 dark:text-white min-w-[28px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
                {product.stockCount <= 5 && (
                  <span className="text-[11px] font-bold text-amber-600">
                    Only {product.stockCount} left in stock!
                  </span>
                )}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <ShieldCheck className="w-4 h-4 mx-auto text-blue-600 mb-0.5" />
                  <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200">100% Genuine</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <RotateCcw className="w-4 h-4 mx-auto text-emerald-600 mb-0.5" />
                  <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200">7 Days Return</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <CreditCard className="w-4 h-4 mx-auto text-amber-600 mb-0.5" />
                  <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Pay on Delivery</p>
                </div>
              </div>

            </div>

          </div>

          {/* Description & Specifications Tabs */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none">
              {[
                { id: 'description', label: 'Highlights' },
                { id: 'specs', label: 'Specifications' },
                { id: 'box', label: "In the Box" },
                { id: 'warranty', label: 'Warranty' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-[#2874f0] text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="py-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeTab === 'description' && (
                <div className="space-y-2">
                  <p>{product.description}</p>
                  {product.features && product.features.length > 0 && (
                    <ul className="list-disc pl-5 space-y-1 mt-2 text-slate-700 dark:text-slate-300">
                      {product.features.map((feat, i) => (
                        <li key={i}>{feat}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(product.specifications || {}).map(([k, v]) => (
                    <div key={k} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 flex justify-between">
                      <span className="text-slate-500 font-medium">{k}</span>
                      <span className="font-bold text-slate-900 dark:text-white">{v}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'box' && (
                <ul className="list-disc pl-5 space-y-1">
                  {product.boxContents?.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}

              {activeTab === 'warranty' && (
                <p>{product.warranty || '1 Year Brand Manufacturer Warranty across India.'}</p>
              )}
            </div>
          </div>

        </div>

        {/* FLIPKART STYLE SIGNATURE STICKY BOTTOM ACTION BAR (PHONE-FIRST) */}
        <div className="fixed sm:static bottom-0 left-0 right-0 z-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-3 sm:p-4 grid grid-cols-2 gap-2.5 shadow-2xl">
          
          {/* Add to Cart: Flipkart Yellow `#ff9f00` */}
          <button
            onClick={handleAddToCart}
            className={`py-3 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer ${
              addedAnimation
                ? 'bg-emerald-600 text-white'
                : 'bg-[#ff9f00] hover:bg-[#e89000] text-white'
            }`}
          >
            {addedAnimation ? <Check className="w-4 h-4 stroke-[3]" /> : <ShoppingBag className="w-4 h-4" />}
            <span>{addedAnimation ? 'Added to Cart ✓' : 'Add to Cart'}</span>
          </button>

          {/* Buy Now: Flipkart Orange `#fb641b` */}
          <button
            onClick={handleBuyNow}
            className="py-3 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer text-white bg-[#fb641b] hover:bg-[#e05412]"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Buy Now</span>
          </button>

        </div>

      </div>
    </div>
  );
};
