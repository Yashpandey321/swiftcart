import React from 'react';
import { Truck, ShieldCheck, Heart, Sparkles, MapPin, Phone, Mail, ArrowUp } from 'lucide-react';
import { ActiveView } from '../../types/ecommerce';

interface FooterProps {
  setActiveView: (view: ActiveView) => void;
  onSelectCategory: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  setActiveView,
  onSelectCategory,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-24 md:pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-blue-500/30">
                ⚡
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  Swift<span className="text-cyan-400">Cart</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                  Shop Fast. Delivered Smarter.
                </span>
              </div>
            </div>

            <p className="text-slate-400 max-w-sm leading-relaxed text-xs">
              Next-generation consumer e-commerce powered by smart logistics routing. Experience verified authentic electronics, fashion, and home essentials with guaranteed same-day delivery.
            </p>

            <div className="pt-1 flex items-center gap-3 text-slate-400">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                100% Buyer Protection
              </span>
              <span className="inline-flex items-center gap-1">
                <Truck className="w-4 h-4 text-cyan-400" />
                Autonomous Delivery Fleet
              </span>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Top Categories
            </h4>
            <ul className="space-y-2 text-slate-400">
              {['Electronics', 'Audio', 'Mobiles', 'Fashion', 'Home & Kitchen', 'Beauty & Care'].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat);
                      setActiveView('products');
                      scrollToTop();
                    }}
                    className="hover:text-cyan-400 transition-colors cursor-pointer"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Help & Support
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => {
                    setActiveView('order-tracking');
                    scrollToTop();
                  }}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Track Package
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('previous-orders');
                    scrollToTop();
                  }}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Returns & Refunds
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('profile');
                    scrollToTop();
                  }}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Customer Care & FAQs
                </button>
              </li>
              <li>
                <span className="text-slate-400">24/7 Helpline: 1800-209-9000</span>
              </li>
              <li>
                <span className="text-slate-400">support@swiftcart.in</span>
              </li>
            </ul>
          </div>

          {/* Logistics Network Hubs */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Logistics Hubs
            </h4>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                Jaipur Central Hub (302015)
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                Delhi NCR Fulfillment Center
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                Mumbai Western Air Cargo
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                Bengaluru Tech Hub Depot
              </li>
            </ul>

            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                Accepted Payment Methods
              </span>
              <div className="flex flex-wrap gap-1.5 text-[10px] text-slate-300 font-semibold">
                <span className="px-2 py-0.5 bg-slate-800 rounded">UPI</span>
                <span className="px-2 py-0.5 bg-slate-800 rounded">RuPay</span>
                <span className="px-2 py-0.5 bg-slate-800 rounded">Visa</span>
                <span className="px-2 py-0.5 bg-slate-800 rounded">Mastercard</span>
                <span className="px-2 py-0.5 bg-slate-800 rounded">COD</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-xs">
          <p>© 2026 SwiftCart Logistics Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
