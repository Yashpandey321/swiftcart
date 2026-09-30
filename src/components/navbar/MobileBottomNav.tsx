import React from 'react';
import { Home, LayoutGrid, Flame, ShoppingBag, User } from 'lucide-react';
import { ActiveView, CartItem } from '../../types/ecommerce';

interface MobileBottomNavProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  cartItems?: CartItem[];
  cartCount?: number;
  onOpenCategories?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeView,
  setActiveView,
  cartItems,
  cartCount,
  onOpenCategories,
}) => {
  const totalCartCount = cartCount !== undefined
    ? cartCount
    : (Array.isArray(cartItems) ? cartItems.reduce((acc, item) => acc + (item?.quantity || 0), 0) : 0);

  const navItems = [
    { 
      id: 'home' as ActiveView, 
      label: 'Home', 
      icon: Home 
    },
    { 
      id: 'categories' as any, 
      label: 'Categories', 
      icon: LayoutGrid,
      action: () => {
        if (onOpenCategories) onOpenCategories();
        else setActiveView('products');
      }
    },
    { 
      id: 'products' as ActiveView, 
      label: 'Top Deals', 
      icon: Flame 
    },
    { 
      id: 'profile' as ActiveView, 
      label: 'Account', 
      icon: User 
    },
    { 
      id: 'cart' as ActiveView, 
      label: 'Cart', 
      icon: ShoppingBag, 
      badge: totalCartCount 
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-safe shadow-2xl transition-colors">
      <div className="max-w-md sm:max-w-xl mx-auto grid grid-cols-5 h-14 sm:h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = 
            (item.id === 'home' && activeView === 'home') ||
            (item.id === 'products' && activeView === 'products') ||
            (item.id === 'profile' && (activeView === 'profile' || activeView === 'wishlist' || activeView === 'addresses' || activeView === 'orders' || activeView === 'previous-orders')) ||
            (item.id === 'cart' && (activeView === 'cart' || activeView === 'checkout'));

          const handleClick = () => {
            if (item.action) {
              item.action();
            } else {
              setActiveView(item.id as ActiveView);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          };

          return (
            <button
              key={item.label}
              onClick={handleClick}
              className={`flex flex-col items-center justify-center relative py-1 text-center transition-all cursor-pointer select-none active:scale-95 ${
                isActive 
                  ? 'text-[#2874f0] dark:text-blue-400 font-bold' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${
                  isActive ? 'scale-115 stroke-[2.5]' : 'stroke-[1.75]'
                }`} />
                
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md bg-rose-600 animate-in zoom-in">
                    {item.badge}
                  </span>
                )}
              </div>

              <span className={`text-[10px] mt-1 tracking-tight leading-none ${
                isActive ? 'font-bold' : 'font-medium'
              }`}>
                {item.label}
              </span>

              {/* Active Dot / Underline indicator */}
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 rounded-full bg-[#2874f0]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
