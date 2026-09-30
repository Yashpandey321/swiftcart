import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Check, Zap, Eye, ShieldCheck } from 'lucide-react';
import { Product } from '../../types/ecommerce';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onToggleWishlist: (productId: string, e: React.MouseEvent) => void;
  isWishlisted: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}) => {
  const [justAdded, setJustAdded] = useState(false);

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, e);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer select-none active:scale-[0.98]"
    >
      {/* 1. TOP IMAGE & BADGES */}
      <div className="relative aspect-square w-full bg-slate-50 dark:bg-slate-950 p-2 sm:p-3 overflow-hidden flex items-center justify-center">
        <img
          src={product.thumbnail}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Discount & Promo Badges (Top Left) */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10">
          {product.discountPercent > 0 && (
            <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-black bg-emerald-600 text-white rounded shadow-2xs">
              {product.discountPercent}% OFF
            </span>
          )}
          {product.badge && (
            <span className={`px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded shadow-2xs ${
              product.badge === 'Deal of the Day' || product.badge === 'Limited Deal'
                ? 'bg-rose-600 text-white'
                : 'bg-blue-600 text-white'
            }`}>
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist Heart Button (Top Right) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id, e);
          }}
          className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-transform active:scale-75 cursor-pointer shadow-xs z-10 ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400'
              : 'bg-white/80 dark:bg-slate-850 text-slate-400 hover:text-rose-500'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Quick View hint on desktop hover */}
        <div className="absolute inset-x-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex justify-center z-10">
          <span className="px-2.5 py-0.5 bg-slate-900/80 text-white text-[10px] font-bold rounded-full backdrop-blur-xs flex items-center gap-1">
            <Eye className="w-3 h-3" />
            Quick View
          </span>
        </div>
      </div>

      {/* 2. PRODUCT DETAILS & PRICING */}
      <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between bg-white dark:bg-slate-900">
        <div>
          {/* Brand & Stock warning */}
          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-0.5">
            <span className="font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              {product.brand}
            </span>
            {product.stockCount <= 4 && (
              <span className="text-amber-600 dark:text-amber-400 font-bold">
                {product.stockCount} left
              </span>
            )}
          </div>

          {/* Title (2 lines clamp, phone-friendly) */}
          <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {product.name}
          </h3>

          {/* Ratings & Flipkart Assured / Amazon Prime badge */}
          <div className="flex items-center justify-between gap-1 mt-1.5">
            <div className="flex items-center gap-1">
              {/* Flipkart Signature Green Rating Pill */}
              <div className="flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-emerald-600 text-white text-[10px] font-black">
                <span>{product.rating}</span>
                <Star className="w-2.5 h-2.5 fill-white" />
              </div>
              <span className="text-[10px] text-slate-400 font-medium">
                ({product.reviewsCount > 999 ? `${(product.reviewsCount / 1000).toFixed(1)}k` : product.reviewsCount})
              </span>
            </div>

            {/* SwiftAssured verification pill */}
            <div className="flex items-center gap-0.5 text-[10px] font-black text-[#2874f0] dark:text-blue-400">
              <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>Swift</span>
              <span className="bg-[#ffe500] text-[#2874f0] px-1 rounded-xs text-[9px] font-black">
                Assured
              </span>
            </div>
          </div>

          {/* Price Strip */}
          <div className="mt-2 flex items-baseline flex-wrap gap-1.5">
            <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              ₹{product.price.toLocaleString('en-IN')}
            </span>

            {product.originalPrice > product.price && (
              <>
                <span className="text-[11px] text-slate-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  {product.discountPercent}% off
                </span>
              </>
            )}
          </div>

          {/* Delivery Promise Tag */}
          <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
            <Zap className="w-3 h-3 text-emerald-500 fill-emerald-500 shrink-0" />
            <span className="truncate">{product.deliveryEstimate}</span>
          </div>
        </div>

        {/* 3. FLIPKART STYLE HIGH-CONTRAST ONE-TAP ADD BUTTON */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleAddClick}
            disabled={justAdded}
            className={`w-full py-1.5 sm:py-2 px-2 rounded-lg sm:rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#ffe500] hover:bg-yellow-400 text-[#2874f0] border border-yellow-300'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Added ✓</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
