import React from 'react';
import { Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { MapPin, Clock, CheckCircle2, ShieldCheck, Compass } from 'lucide-react';
import { useGoogleMaps } from './GoogleMapsContext';
import { Address } from '../../types/ecommerce';

interface GoogleCheckoutSummaryMapProps {
  address: Address;
  estimatedDelivery?: string;
}

export const GoogleCheckoutSummaryMap: React.FC<GoogleCheckoutSummaryMapProps> = ({
  address,
  estimatedDelivery = 'Tomorrow by 5:00 PM'
}) => {
  const { hasValidKey } = useGoogleMaps();

  const lat = address.latitude || 26.8732;
  const lng = address.longitude || 75.7972;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Deliver To</span>
          </div>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            Verified Address
          </span>
        </div>

        <div className="mt-2">
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
            {address.name}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            {address.street}, {address.landmark && `${address.landmark}, `}{address.city}, {address.state} - {address.pincode}
          </p>
        </div>
      </div>

      {/* Map Preview */}
      <div className="w-full h-44 relative bg-slate-950">
        {hasValidKey ? (
          <Map
            defaultCenter={{ lat, lng }}
            defaultZoom={15}
            mapId="DEMO_MAP_ID"
            className="w-full h-full"
            gestureHandling="none"
            disableDefaultUI={true}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          >
            <AdvancedMarker position={{ lat, lng }}>
              <Pin background="#2563eb" borderColor="#1e40af" glyphColor="#ffffff" scale={1.1} />
            </AdvancedMarker>
          </Map>
        ) : (
          <div className="w-full h-full bg-slate-900 relative flex flex-col items-center justify-center p-4">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:20px_20px] opacity-40"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg border-2 border-white ring-4 ring-blue-500/20">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="mt-2 px-2.5 py-0.5 rounded-full bg-slate-950/90 border border-slate-700 text-white text-[11px] font-bold shadow">
                📍 {address.city || 'Jaipur'} ({lat.toFixed(3)}°, {lng.toFixed(3)}°)
              </div>
            </div>
          </div>
        )}

        <div className="absolute bottom-2 left-2 z-10 bg-slate-950/85 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] text-white font-medium border border-slate-800 flex items-center gap-1.5">
          <Compass className="w-3 h-3 text-blue-400" />
          <span>Doorstep Pinpoint Set</span>
        </div>
      </div>

      {/* Estimated Delivery Ribbon */}
      <div className="p-3 bg-blue-50/70 dark:bg-blue-950/30 border-t border-blue-100 dark:border-blue-900/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Estimated Delivery:
          </span>
        </div>
        <span className="text-xs font-extrabold text-blue-700 dark:text-blue-300">
          {estimatedDelivery}
        </span>
      </div>
    </div>
  );
};
