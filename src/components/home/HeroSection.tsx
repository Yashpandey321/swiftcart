import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Truck, 
  Zap, 
  ChevronLeft, 
  ChevronRight, 
  Tag, 
  ShieldCheck, 
  CreditCard,
  Flame,
  Clock
} from 'lucide-react';
import { ActiveView } from '../../types/ecommerce';

interface HeroSectionProps {
  setActiveView: (view: ActiveView) => void;
  onTrackOrderClick: (orderId?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  setActiveView,
  onTrackOrderClick,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quickTrackInput, setQuickTrackInput] = useState('');

  const slides = [
    {
      title: 'SwiftCart Mega Savings',
      highlight: 'Up to 80% Off',
      subtitle: 'Smartphones, Audio & Smart Gadgets',
      badge: '✦ SwiftPlus Early Access',
      badgeColor: 'bg-[#ffe500] text-[#2874f0]',
      gradient: 'from-[#0d47a1] via-[#1976d2] to-[#2874f0]',
      cta: 'Shop Now',
      category: 'Mobiles',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
    },
    {
      title: 'SwiftExpress Delivery Promise',
      highlight: 'Delivered in 24 Hours',
      subtitle: 'Autonomous routing & live GPS tracking',
      badge: '⚡ Express Logistics',
      badgeColor: 'bg-emerald-500 text-white',
      gradient: 'from-blue-900 via-indigo-800 to-blue-700',
      cta: 'Explore All',
      category: 'All',
      image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&q=80',
    },
    {
      title: 'Electronics Carnival',
      highlight: 'Min 40% Off',
      subtitle: 'Premium Laptops, Tablets & Headphones',
      badge: '✦ SwiftAssured Quality',
      badgeColor: 'bg-[#ffe500] text-[#2874f0]',
      gradient: 'from-purple-900 via-indigo-900 to-blue-900',
      cta: 'View Deals',
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    }
  ];

  // Auto carousel rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTrackInput.trim()) {
      onTrackOrderClick(quickTrackInput.trim());
      setActiveView('order-tracking');
    } else {
      setActiveView('order-tracking');
    }
  };

  const activeSlide = slides[currentSlide];

  return (
    <div className="bg-slate-100 dark:bg-slate-950 py-2 sm:py-4">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 space-y-3">
        
        {/* MOBILE PROMOTIONAL BANNER CAROUSEL */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-md text-white">
          
          {/* Banner container */}
          <div className={`bg-gradient-to-r ${activeSlide.gradient} min-h-[170px] sm:min-h-[220px] p-4 sm:p-7 flex items-center justify-between transition-all duration-500 relative overflow-hidden`}>
            
            {/* Background image overlay */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 sm:w-2/5 overflow-hidden opacity-30 sm:opacity-40 mix-blend-luminosity pointer-events-none">
              <img 
                src={activeSlide.image} 
                alt="" 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer" 
              />
            </div>

            {/* Banner Text Content */}
            <div className="relative z-10 max-w-sm sm:max-w-md space-y-1.5 sm:space-y-2">
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider ${activeSlide.badgeColor}`}>
                {activeSlide.badge}
              </span>

              <h2 className="text-xl sm:text-3xl font-black tracking-tight leading-tight">
                {activeSlide.title}
              </h2>

              <p className="text-base sm:text-xl font-extrabold text-[#ffe500] dark:text-amber-300">
                {activeSlide.highlight}
              </p>

              <p className="text-xs sm:text-sm text-white/80 line-clamp-1">
                {activeSlide.subtitle}
              </p>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setActiveView('products');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5 bg-[#ffe500] text-[#2874f0] hover:bg-yellow-300"
                >
                  <span>{activeSlide.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Next / Prev Carousel Buttons */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-xs transition cursor-pointer hidden sm:block"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-xs transition cursor-pointer hidden sm:block"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>

        </div>

        {/* FLIPKART / AMAZON APP QUICK WIDGETS STRIP */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          
          {/* Quick Track active order bar */}
          <form 
            onSubmit={handleQuickTrack} 
            className="p-2.5 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Live Parcel Tracking</p>
              <input
                type="text"
                value={quickTrackInput}
                onChange={(e) => setQuickTrackInput(e.target.value)}
                placeholder="Track ID e.g. SC-102849"
                className="w-full bg-transparent text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-1.5 text-xs font-bold rounded-lg shrink-0 cursor-pointer shadow-xs bg-[#2874f0] hover:bg-blue-700 text-white transition-colors"
            >
              Track
            </button>
          </form>

          {/* Bank Offer / SuperCoin Strip */}
          <div className="p-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent dark:from-slate-900 dark:to-slate-850 border border-amber-200/70 dark:border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  Bank Offer: 10% Instant Discount
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  On HDFC, SBI & ICICI Bank Cards • Min order ₹2,500
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 shrink-0">
              Apply in Cart
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
