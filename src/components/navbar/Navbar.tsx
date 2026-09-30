import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  MapPin, 
  User, 
  Heart, 
  Bell, 
  Package, 
  ChevronDown, 
  Truck,
  Sparkles,
  SlidersHorizontal,
  Moon,
  Sun,
  ShieldCheck,
  Mic,
  Camera,
  Coins,
  Flame,
  Zap
} from 'lucide-react';
import { ActiveView, Address, CartItem, CustomerNotification } from '../../types/ecommerce';

interface NavbarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  cartItems?: CartItem[];
  cartCount?: number;
  wishlistCount?: number;
  notifications?: CustomerNotification[];
  unreadNotificationCount?: number;
  selectedAddress?: Address;
  userPincode?: string;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  darkMode?: boolean;
  setDarkMode?: (val: boolean) => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onSelectCategory: (category: string) => void;
  onSwitchRole?: (role: 'customer' | 'admin' | 'driver') => void;
  onOpenRoleSwitcher?: () => void;
  onOpenAddressPicker?: () => void;
  onOpenCategoriesSheet?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  cartItems,
  cartCount,
  wishlistCount = 0,
  notifications,
  unreadNotificationCount,
  selectedAddress,
  userPincode,
  onOpenSearch,
  onOpenNotifications,
  darkMode,
  setDarkMode,
  isDarkMode,
  onToggleDarkMode,
  onSelectCategory,
  onSwitchRole,
  onOpenRoleSwitcher,
  onOpenAddressPicker,
  onOpenCategoriesSheet,
  searchQuery = '',
  onSearchChange,
}) => {
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);

  const searchSuggestions = [
    'Search for "iPhone 16 Pro"',
    'Search for "Noise Canceling Headphones"',
    'Search for "Running Shoes & Sneakers"',
    'Search for "MacBook Air M3"',
    'Search for "Smartwatches & Fit Bands"',
    'Search for "Daily Groceries & Snacks"'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % searchSuggestions.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [searchSuggestions.length]);

  const isDark = darkMode ?? isDarkMode ?? false;
  const handleToggleDarkMode = () => {
    if (onToggleDarkMode) {
      onToggleDarkMode();
    } else if (setDarkMode) {
      setDarkMode(!isDark);
    }
  };

  const cartTotalItems = cartCount !== undefined 
    ? cartCount 
    : (Array.isArray(cartItems) ? cartItems.reduce((sum, item) => sum + (item?.quantity || 0), 0) : 0);

  const unreadNotifications = unreadNotificationCount !== undefined
    ? unreadNotificationCount
    : (Array.isArray(notifications) ? notifications.filter(n => !n.read).length : 0);

  const currentAddress: Address = selectedAddress || {
    id: 'default-addr',
    name: 'Customer',
    phone: '+91 98290 14820',
    street: 'Tonk Road Commercial Center',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: userPincode || '302015',
    type: 'Home',
    isDefault: true,
  };

  const handleVoiceSearchClick = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      onOpenSearch();
    }, 1200);
  };

  return (
    <header className="sticky top-0 z-40 transition-colors shadow-md">
      
      {/* 1. SWIFTCART PRIMARY APP BAR (Flipkart Inspired Royal Blue) */}
      <div className="bg-[#2874f0] dark:bg-[#1f5ec2] text-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
            
            {/* Left: SwiftCart Brand Logo with SwiftPlus badge */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div 
                onClick={() => setActiveView('home')} 
                className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group select-none"
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 font-sans italic">
                    <span className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-xs">
                      Swift<span className="text-[#ffe500]">Cart</span>
                    </span>
                    <div className="w-5 h-5 rounded-sm bg-[#ffe500] text-[#2874f0] flex items-center justify-center font-black text-xs not-italic shadow-xs">
                      ✦
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-blue-100 font-semibold italic -mt-1">
                    <span>Explore</span>
                    <span className="text-[#ffe500] font-bold flex items-center">
                      SwiftPlus <span className="text-xs not-italic ml-0.5">✦</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Search Bar embedded in navbar */}
            <div 
              onClick={onOpenSearch}
              className="hidden md:flex flex-1 max-w-xl h-10 bg-white dark:bg-slate-800 rounded-lg items-center px-3 gap-2.5 shadow-inner cursor-pointer transition-all border border-transparent hover:border-yellow-400"
            >
              <Search className="w-4 h-4 text-[#2874f0]" />
              <div className="flex-1 text-xs text-slate-500 dark:text-slate-400 truncate select-none">
                {searchQuery ? (
                  <span className="text-slate-900 dark:text-white font-medium">{searchQuery}</span>
                ) : (
                  <span>{searchSuggestions[placeholderIndex]}</span>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={handleVoiceSearchClick}
                  className={`p-1 rounded transition ${
                    isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="Voice Search"
                >
                  <Mic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onOpenSearch}
                  className="p-1 text-slate-400 hover:text-slate-700 transition"
                  title="Image Search"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Action Icons (Phone + Desktop) */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              
              {/* Orders Tab */}
              <button
                onClick={() => setActiveView('orders')}
                className={`hidden md:flex flex-col items-start px-2 py-1 rounded hover:border hover:border-white/40 text-left transition ${
                  activeView === 'orders' ? 'border border-white/50 bg-white/10' : ''
                }`}
              >
                <span className="text-[10px] text-white/70 leading-none">Returns</span>
                <span className="text-xs font-bold leading-tight">& Orders</span>
              </button>

              {/* Wishlist */}
              <button
                onClick={() => setActiveView('wishlist')}
                className="relative p-2 text-white/90 hover:text-white rounded-lg transition cursor-pointer"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Notifications */}
              <button
                onClick={onOpenNotifications}
                className="relative p-2 text-white/90 hover:text-white rounded-lg transition cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#ffe500] text-[#2874f0] text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setActiveView('cart')}
                className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:border hover:border-white/40 transition cursor-pointer"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 sm:w-6 h-5 sm:h-6" />
                  {cartTotalItems > 0 && (
                    <span className="absolute -top-1.5 -right-2 w-4 sm:w-4.5 h-4 sm:h-4.5 text-[10px] font-black rounded-full flex items-center justify-center bg-[#ffe500] text-[#2874f0] shadow-xs">
                      {cartTotalItems}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline text-xs font-bold mt-1">Cart</span>
              </button>

              {/* User Avatar & Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-1 rounded-full hover:ring-2 hover:ring-white/40 transition cursor-pointer"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black bg-white text-[#2874f0] shadow-xs">
                    YP
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#2874f0] text-white flex items-center justify-center text-xs font-bold">
                          YP
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">Yash Pandey</p>
                          <p className="text-[10px] text-slate-500">pandeyyyash2025@gmail.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-black rounded-md bg-[#ffe500] text-blue-900">
                          ✦ SwiftPlus Member
                        </span>
                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                          240 SwiftCoins ★
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => { setActiveView('profile'); setShowUserMenu(false); }}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Your Account & Addresses
                    </button>
                    <button
                      onClick={() => { setActiveView('orders'); setShowUserMenu(false); }}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Package className="w-4 h-4 text-slate-400" />
                      Your Orders & Returns
                    </button>
                    <button
                      onClick={() => { setActiveView('order-tracking'); setShowUserMenu(false); }}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold"
                    >
                      <Truck className="w-4 h-4" />
                      Live Package Tracking
                    </button>

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1 pt-1">
                      <p className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Admin & Logistics
                      </p>
                      <button
                        onClick={() => { 
                          if (onSwitchRole) onSwitchRole('admin');
                          else setActiveView('admin-operations');
                          setShowUserMenu(false); 
                        }}
                        className="w-full text-left px-4 py-1.5 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-indigo-600 dark:text-indigo-400"
                      >
                        <SlidersHorizontal className="w-4 h-4" />
                        Dispatch Operations Hub
                      </button>
                      <button
                        onClick={() => { 
                          if (onSwitchRole) onSwitchRole('driver');
                          setShowUserMenu(false); 
                        }}
                        className="w-full text-left px-4 py-1.5 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-emerald-600 dark:text-emerald-400"
                      >
                        <Truck className="w-4 h-4" />
                        Driver Delivery App
                      </button>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-2 flex items-center justify-between">
                      <span className="text-xs text-slate-500">Dark Mode</span>
                      <button
                        onClick={handleToggleDarkMode}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-500"
                      >
                        {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* 2. PHONE STICKY SEARCH BAR (Flipkart Mobile Style with Mic & Camera) */}
      <div className="md:hidden px-3 py-2 bg-[#2874f0] dark:bg-[#1f5ec2] transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="relative flex items-center">
            
            {/* Search Input Box */}
            <div 
              onClick={onOpenSearch}
              className="w-full h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center px-3 gap-2.5 shadow-md cursor-pointer transition-all border border-transparent hover:border-yellow-400"
            >
              <Search className="w-4 h-4 text-[#2874f0] shrink-0" />
              
              <div className="flex-1 text-xs text-slate-500 dark:text-slate-400 truncate select-none">
                {searchQuery ? (
                  <span className="text-slate-900 dark:text-white font-medium">{searchQuery}</span>
                ) : (
                  <span className="transition-opacity duration-300">
                    {searchSuggestions[placeholderIndex]}
                  </span>
                )}
              </div>

              {/* Mic / Voice Search & Camera Buttons (Flipkart App-style) */}
              <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={handleVoiceSearchClick}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                  title="Voice Search"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onOpenSearch}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
                  title="Visual Search"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* 3. DELIVER TO ADDRESS STRIP (Flipkart Deliver-to Bar) */}
      <div 
        onClick={() => {
          if (onOpenAddressPicker) {
            onOpenAddressPicker();
          } else {
            setShowLocationPicker(true);
          }
        }}
        className="py-1.5 px-3 sm:px-6 cursor-pointer select-none transition-colors border-b bg-[#1e5ecc] text-white border-blue-600/30"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-[#ffe500]" />
            <span className="text-white/80 shrink-0">Deliver to</span>
            <span className="font-bold text-white truncate max-w-[200px] sm:max-w-md">
              {currentAddress.name} - {currentAddress.city} {currentAddress.pincode}
            </span>
            <ChevronDown className="w-3 h-3 text-white/70 shrink-0" />
          </div>

          <div className="hidden xs:flex items-center gap-1 text-[11px] font-semibold text-emerald-300">
            <Zap className="w-3 h-3 text-emerald-300 fill-emerald-300" />
            <span>Fast Express Delivery</span>
          </div>
        </div>
      </div>

      {/* 4. SWIFTCART QUICK PERKS & DEALS RIBBON */}
      <div className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 py-1.5 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-[11px] font-semibold">
          
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-900/50">
              <Coins className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>150 SwiftCoins</span>
            </div>
            <button 
              onClick={() => onOpenCategoriesSheet && onOpenCategoriesSheet()}
              className="flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-blue-600 transition cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>Top Deals</span>
            </button>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SwiftAssured Quality</span>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3 shrink-0 text-slate-500 dark:text-slate-400">
            <button
              onClick={() => setActiveView('admin-operations')}
              className="hover:text-blue-600 flex items-center gap-1 transition cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5 text-indigo-500" />
              <span>Smart Fulfillment Route</span>
            </button>
          </div>

        </div>
      </div>

    </header>
  );
};
