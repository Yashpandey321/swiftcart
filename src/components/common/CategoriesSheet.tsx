import React from 'react';
import { 
  X, 
  ChevronRight, 
  Sparkles, 
  Smartphone, 
  Laptop, 
  Headphones, 
  Shirt, 
  Home, 
  Sparkle, 
  Activity, 
  BookOpen, 
  Watch, 
  ShoppingBag,
  Zap,
  Flame,
  ArrowRight
} from 'lucide-react';
import { POPULAR_CATEGORIES } from '../../data/ecommerceData';

interface CategoriesSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoriesSheet: React.FC<CategoriesSheetProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
}) => {
  if (!isOpen) return null;

  const getIcon = (name: string) => {
    switch (name) {
      case 'Electronics': return <Laptop className="w-5 h-5" />;
      case 'Mobiles': return <Smartphone className="w-5 h-5" />;
      case 'Audio': return <Headphones className="w-5 h-5" />;
      case 'Fashion': return <Shirt className="w-5 h-5" />;
      case 'Home & Kitchen': return <Home className="w-5 h-5" />;
      case 'Beauty & Care': return <Sparkle className="w-5 h-5" />;
      case 'Sports & Fitness': return <Activity className="w-5 h-5" />;
      case 'Books': return <BookOpen className="w-5 h-5" />;
      case 'Accessories': return <Watch className="w-5 h-5" />;
      case 'Grocery': return <ShoppingBag className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const trendingOffers = [
    { title: 'Top Deals on Mobiles', desc: 'Up to ₹10,000 Off on Exchange', tag: 'Hot Deal', category: 'Mobiles' },
    { title: 'Audio & Wearables', desc: 'Starting at just ₹799', tag: 'Trending', category: 'Audio' },
    { title: 'Laptops & Computing', desc: 'Intel i7 & Apple M3 deals', tag: 'Fast Delivery', category: 'Electronics' },
    { title: 'Fashion Clearance', desc: 'Min 60% Off on Top Brands', tag: 'Mega Sale', category: 'Fashion' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Sheet Content */}
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 overflow-hidden max-h-[90vh] flex flex-col z-10 animate-in slide-in-from-bottom duration-300">
        
        {/* Mobile handle */}
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-3 sm:hidden" />

        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-600 text-white">
                SwiftCart Categories
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
              Shop by Category
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto py-3 space-y-5 flex-1 pr-1">
          
          {/* Quick Category Grid */}
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
              All Departments
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {POPULAR_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => {
                      onSelectCategory(cat.name);
                      onClose();
                    }}
                    className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-bold shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 hover:bg-slate-100 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected 
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-slate-750 text-blue-600 dark:text-blue-400 shadow-2xs'
                    }`}>
                      {getIcon(cat.name)}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold truncate leading-tight">{cat.name}</p>
                      <p className="text-[10px] text-slate-500">{cat.count || 4} items</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Featured Deals & Hubs */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
              Featured Super Saver Hubs
            </p>
            <div className="space-y-2">
              {trendingOffers.map((offer, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    onSelectCategory(offer.category);
                    onClose();
                  }}
                  className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent dark:from-slate-800 dark:to-slate-800/50 border border-amber-200/60 dark:border-slate-750 flex items-center justify-between cursor-pointer hover:border-amber-400 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {offer.title}
                        </span>
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-rose-600 text-white">
                          {offer.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{offer.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* View All Button */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => {
              onSelectCategory('All');
              onClose();
            }}
            className="w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-xs bg-blue-600 hover:bg-blue-700 text-white"
          >
            <span>Browse Complete Store (All Items)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
