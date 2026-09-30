import React from 'react';
import { 
  Laptop, 
  Smartphone, 
  Headphones, 
  Shirt, 
  Home, 
  Sparkles, 
  Activity, 
  BookOpen, 
  Watch, 
  ShoppingBag,
  LayoutGrid,
  Flame
} from 'lucide-react';
import { POPULAR_CATEGORIES } from '../../data/ecommerceData';

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {

  const getCategoryTheme = (name: string) => {
    switch (name) {
      case 'Mobiles':
        return {
          icon: <Smartphone className="w-6 h-6 text-blue-600" />,
          bg: 'bg-blue-100 dark:bg-blue-950/80',
          label: 'Mobiles'
        };
      case 'Fashion':
        return {
          icon: <Shirt className="w-6 h-6 text-rose-600" />,
          bg: 'bg-rose-100 dark:bg-rose-950/80',
          label: 'Fashion'
        };
      case 'Electronics':
        return {
          icon: <Laptop className="w-6 h-6 text-indigo-600" />,
          bg: 'bg-indigo-100 dark:bg-indigo-950/80',
          label: 'Electronics'
        };
      case 'Audio':
        return {
          icon: <Headphones className="w-6 h-6 text-purple-600" />,
          bg: 'bg-purple-100 dark:bg-purple-950/80',
          label: 'Audio'
        };
      case 'Home & Kitchen':
        return {
          icon: <Home className="w-6 h-6 text-amber-600" />,
          bg: 'bg-amber-100 dark:bg-amber-950/80',
          label: 'Home'
        };
      case 'Beauty & Care':
        return {
          icon: <Sparkles className="w-6 h-6 text-pink-600" />,
          bg: 'bg-pink-100 dark:bg-pink-950/80',
          label: 'Beauty'
        };
      case 'Sports & Fitness':
        return {
          icon: <Activity className="w-6 h-6 text-emerald-600" />,
          bg: 'bg-emerald-100 dark:bg-emerald-950/80',
          label: 'Fitness'
        };
      case 'Books':
        return {
          icon: <BookOpen className="w-6 h-6 text-cyan-600" />,
          bg: 'bg-cyan-100 dark:bg-cyan-950/80',
          label: 'Books'
        };
      case 'Accessories':
        return {
          icon: <Watch className="w-6 h-6 text-teal-600" />,
          bg: 'bg-teal-100 dark:bg-teal-950/80',
          label: 'Watches'
        };
      case 'Grocery':
        return {
          icon: <ShoppingBag className="w-6 h-6 text-green-600" />,
          bg: 'bg-green-100 dark:bg-green-950/80',
          label: 'Grocery'
        };
      default:
        return {
          icon: <Flame className="w-6 h-6 text-orange-600" />,
          bg: 'bg-orange-100 dark:bg-orange-950/80',
          label: 'Top Deals'
        };
    }
  };

  return (
    <section className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 py-3 select-none">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        
        {/* Horizontal scrollable circular category bubbles (Stories pattern) */}
        <div className="flex items-center gap-3 sm:gap-5 overflow-x-auto pb-1 scrollbar-none px-1">
          {POPULAR_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            const meta = getCategoryTheme(cat.name);

            return (
              <button
                key={cat.name}
                onClick={() => onSelectCategory(cat.name)}
                className="flex flex-col items-center gap-1.5 min-w-[62px] sm:min-w-[76px] cursor-pointer group shrink-0 active:scale-95 transition-transform"
              >
                {/* Circular bubble icon */}
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-200 ${meta.bg} ${
                    isSelected
                      ? 'ring-3 ring-[#2874f0] shadow-md scale-105'
                      : 'border border-slate-200/80 dark:border-slate-700/80 group-hover:scale-105'
                  }`}
                >
                  <div className="group-hover:scale-110 transition-transform">
                    {meta.icon}
                  </div>
                </div>

                {/* Text Label */}
                <span className={`text-[11px] sm:text-xs tracking-tight text-center truncate max-w-[68px] sm:max-w-[80px] leading-tight ${
                  isSelected
                    ? 'font-extrabold text-[#2874f0] dark:text-blue-400'
                    : 'font-semibold text-slate-700 dark:text-slate-300'
                }`}>
                  {meta.label}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
