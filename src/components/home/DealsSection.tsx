import React, { useState, useEffect } from 'react';
import { Flame, Clock, ArrowRight, Zap, Sparkles } from 'lucide-react';
import { Product } from '../../types/ecommerce';
import { ProductCard } from '../products/ProductCard';

interface DealsSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onToggleWishlist: (productId: string, e: React.MouseEvent) => void;
  wishlistIds: Set<string>;
  onViewAllDeals: () => void;
}

export const DealsSection: React.FC<DealsSectionProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onViewAllDeals,
}) => {
  // Flash sale countdown timer
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 24, seconds: 38 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 8, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter deals (discount >= 20% or badge)
  const dealProducts = products
    .filter((p) => p.discountPercent >= 15 || p.badge === 'Deal of the Day' || p.badge === 'Limited Deal')
    .slice(0, 6);

  return (
    <section className="py-4 sm:py-8 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 select-none">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        
        {/* Deal Header with Live Timer and View All */}
        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2.5 bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-slate-800 dark:to-slate-850 border border-blue-100 dark:border-slate-750">
          
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-rose-500 text-white shadow-xs">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Deal of the Day
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded bg-rose-600 text-white">
                  Live Sale
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Unbeatable prices on electronics, mobiles & accessories</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end xs:self-center">
            {/* Live Clock */}
            <div className="flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-900/50 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span>Ends in:</span>
              <span className="font-mono font-black">
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>

            <button
              onClick={onViewAllDeals}
              className="text-xs font-bold flex items-center gap-0.5 cursor-pointer hover:underline transition text-[#2874f0]"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* 2-Column on Mobile, 3 on Tablet, 6 on Desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 sm:gap-4">
          {dealProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlistIds.has(product.id)}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
