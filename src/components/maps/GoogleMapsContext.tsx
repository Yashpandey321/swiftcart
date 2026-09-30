import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { APIProvider, APILoadingStatus } from '@vis.gl/react-google-maps';
import { MapPin, Key, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

interface GoogleMapsContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  isCustomKey: boolean;
  status: APILoadingStatus;
  setStatus: (status: APILoadingStatus) => void;
  hasValidKey: boolean;
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  apiKey: '',
  setApiKey: () => {},
  isCustomKey: false,
  status: APILoadingStatus.NOT_LOADED,
  setStatus: () => {},
  hasValidKey: false,
});

export const useGoogleMaps = () => useContext(GoogleMapsContext);

interface GoogleMapsWrapperProps {
  children: ReactNode;
}

export const GoogleMapsWrapper: React.FC<GoogleMapsWrapperProps> = ({ children }) => {
  // Read from env or local storage
  const envKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || '';
  const [apiKey, setApiKeyState] = useState<string>(() => {
    const saved = localStorage.getItem('swiftcart_gmaps_key');
    return saved || envKey || '';
  });

  const [status, setStatus] = useState<APILoadingStatus>(APILoadingStatus.NOT_LOADED);

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    if (key) {
      localStorage.setItem('swiftcart_gmaps_key', key);
    } else {
      localStorage.removeItem('swiftcart_gmaps_key');
    }
  };

  const isCustomKey = Boolean(apiKey && apiKey !== envKey);
  const hasValidKey = Boolean(apiKey && apiKey.trim().length > 10);

  return (
    <GoogleMapsContext.Provider
      value={{
        apiKey,
        setApiKey,
        isCustomKey,
        status,
        setStatus,
        hasValidKey,
      }}
    >
      {hasValidKey ? (
        <APIProvider
          apiKey={apiKey}
          libraries={['places', 'routes', 'geometry', 'marker', 'core']}
          onLoad={() => setStatus(APILoadingStatus.LOADED)}
          onError={() => setStatus(APILoadingStatus.FAILED)}
        >
          {children}
        </APIProvider>
      ) : (
        children
      )}
    </GoogleMapsContext.Provider>
  );
};

// Component for configuring or inspecting Google Maps Platform API Key
export const GoogleMapsKeyBanner: React.FC = () => {
  const { apiKey, setApiKey, status, hasValidKey } = useGoogleMaps();
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState(apiKey);

  const handleSave = () => {
    setApiKey(inputVal.trim());
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 text-slate-300 text-xs border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${hasValidKey ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${hasValidKey ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          </span>
          <span className="font-medium text-white">Google Maps Platform</span>
          <span className="text-slate-400 text-[11px] hidden sm:inline">
            {hasValidKey ? 'API Connected (Jaipur Routing & Places active)' : 'Prototyping Mode (API Key can be configured)'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium border border-slate-700 transition"
          >
            <Key className="w-3 h-3 text-amber-400" />
            <span>{hasValidKey ? 'Configured Key' : 'Configure Google Maps Key'}</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 bg-slate-950 border-b border-slate-800 text-slate-200 text-xs space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              Google Maps Platform Key Setup
            </h4>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <p className="text-slate-400 text-xs">
            Enter your Google Maps Platform API key (with Maps JavaScript API, Places API, and Routes API enabled) or configure <code className="text-amber-300">VITE_GOOGLE_MAPS_API_KEY</code> in environment variables.
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="AIzaSy..."
              className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500 font-mono"
            />
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg text-xs transition shrink-0"
            >
              Save Key
            </button>
            {apiKey && (
              <button
                onClick={() => {
                  setInputVal('');
                  setApiKey('');
                }}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
