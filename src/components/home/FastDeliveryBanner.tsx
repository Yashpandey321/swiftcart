import React from 'react';
import { Truck, ArrowRight, Zap, Navigation, ShieldCheck } from 'lucide-react';
import { ActiveView } from '../../types/ecommerce';

interface FastDeliveryBannerProps {
  setActiveView: (view: ActiveView) => void;
}

export const FastDeliveryBanner: React.FC<FastDeliveryBannerProps> = ({
  setActiveView,
}) => {
  return (
    <section className="py-12 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white relative overflow-hidden">
      {/* Abstract background vector accents */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-bold">
              <Zap className="w-3.5 h-3.5" />
              <span>Smart Delivery Network</span>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-400/20 text-cyan-300 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                🚚
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Fast Delivery Guaranteed
              </h2>
            </div>

            <p className="text-sm sm:text-base text-blue-100/90 max-w-2xl leading-relaxed">
              Get your order delivered quickly with our optimized delivery network. Every shipment is dynamically routed through our city hubs to ensure minimum transit delay.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs font-medium text-cyan-200">
              <span className="flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-cyan-400" />
                Live GPS parcel tracking
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                Safe tamper-proof packaging
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <button
              onClick={() => setActiveView('products')}
              className="px-8 py-4 bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 text-blue-950 font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-cyan-500/20 flex items-center gap-2.5 transition-all transform hover:scale-105 cursor-pointer"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
