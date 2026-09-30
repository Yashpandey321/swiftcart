import React, { useState, useEffect, useRef } from 'react';
import { 
  Map, 
  AdvancedMarker, 
  Pin, 
  useMapsLibrary, 
  useMap 
} from '@vis.gl/react-google-maps';
import { 
  MapPin, 
  Search, 
  Crosshair, 
  CheckCircle2, 
  Compass
} from 'lucide-react';
import { useGoogleMaps } from './GoogleMapsContext';

export interface LocationCoordinates {
  lat: number;
  lng: number;
  formattedAddress?: string;
  placeId?: string;
}

interface GoogleAddressAutocompleteProps {
  initialLocation?: LocationCoordinates;
  onLocationSelect: (location: LocationCoordinates) => void;
  height?: string;
}

const JAIPUR_AREAS = [
  { name: 'Mansarovar', lat: 26.8524, lng: 75.7685, address: 'Near Mansarovar Metro Station, Jaipur' },
  { name: 'Vaishali Nagar', lat: 26.9066, lng: 75.7438, address: 'Amrapali Circle, Vaishali Nagar, Jaipur' },
  { name: 'C-Scheme', lat: 26.9124, lng: 75.8015, address: 'Statue Circle, C-Scheme, Jaipur' },
  { name: 'Malviya Nagar', lat: 26.8530, lng: 75.8052, address: 'Near Gaurav Tower, Malviya Nagar, Jaipur' },
  { name: 'Tonk Road', lat: 26.8732, lng: 75.7972, address: 'Gopalpura Flyover, Tonk Road, Jaipur' },
  { name: 'Jagatpura', lat: 26.8194, lng: 75.8526, address: 'Near Akshaya Patra, Mahal Road, Jagatpura, Jaipur' },
  { name: 'Raja Park', lat: 26.8975, lng: 75.8285, address: 'Govind Marg, Fashion Street, Raja Park, Jaipur' },
  { name: 'Civil Lines', lat: 26.9084, lng: 75.7877, address: 'Jacob Road, Near Raj Bhavan, Civil Lines, Jaipur' },
];

// LIVE GOOGLE MAPS IMPLEMENTATION (Rendered ONLY when API key is valid & APIProvider is active)
const GoogleAddressAutocompleteLive: React.FC<GoogleAddressAutocompleteProps> = ({
  initialLocation = { lat: 26.8732, lng: 75.7972, formattedAddress: 'Tonk Road, Jaipur, Rajasthan' },
  onLocationSelect,
  height = '320px'
}) => {
  const [currentCoords, setCurrentCoords] = useState<LocationCoordinates>(initialLocation);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const placesLib = useMapsLibrary('places');
  const geocodingLib = useMapsLibrary('geocoding');
  const map = useMap();
  const inputRef = useRef<HTMLInputElement>(null);

  // Setup Google Places Autocomplete if library is ready
  useEffect(() => {
    if (!placesLib || !inputRef.current || !map) return;

    try {
      const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 'in' },
        fields: ['geometry', 'formatted_address', 'name', 'place_id'],
      });

      const listener = autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          const newLat = place.geometry.location.lat();
          const newLng = place.geometry.location.lng();
          const newCoords: LocationCoordinates = {
            lat: newLat,
            lng: newLng,
            formattedAddress: place.formatted_address || place.name || searchQuery,
            placeId: place.place_id,
          };
          setCurrentCoords(newCoords);
          onLocationSelect(newCoords);
          map.panTo({ lat: newLat, lng: newLng });
          map.setZoom(16);
        }
      });

      return () => {
        google.maps.event.removeListener(listener);
      };
    } catch (e) {
      console.warn('Autocomplete init error:', e);
    }
  }, [placesLib, map, searchQuery, onLocationSelect]);

  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    if (geocodingLib) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        let addr = `${lat.toFixed(4)}, ${lng.toFixed(4)}, Jaipur, Rajasthan`;
        let placeId: string | undefined;
        if (status === 'OK' && results && results[0]) {
          addr = results[0].formatted_address;
          placeId = results[0].place_id;
        }
        const updated = { lat, lng, formattedAddress: addr, placeId };
        setCurrentCoords(updated);
        onLocationSelect(updated);
      });
    } else {
      const updated = {
        lat,
        lng,
        formattedAddress: `Pinpoint entrance @ ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E, Jaipur`,
      };
      setCurrentCoords(updated);
      onLocationSelect(updated);
    }
  };

  const handleSelectPreset = (area: typeof JAIPUR_AREAS[0]) => {
    const updated: LocationCoordinates = {
      lat: area.lat,
      lng: area.lng,
      formattedAddress: area.address,
    };
    setCurrentCoords(updated);
    setSearchQuery(area.name);
    onLocationSelect(updated);
    if (map) {
      map.panTo({ lat: area.lat, lng: area.lng });
      map.setZoom(15);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newCoords: LocationCoordinates = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          formattedAddress: `Live GPS Location (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`,
        };
        setCurrentCoords(newCoords);
        onLocationSelect(newCoords);
        if (map) {
          map.panTo({ lat: newCoords.lat, lng: newCoords.lng });
          map.setZoom(16);
        }
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      }
    );
  };

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Exact Delivery Pinpoint
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Drag marker or search to position your doorstep entrance
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 transition"
        >
          <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Locating...' : 'Use My GPS'}</span>
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search locality, building, or landmark in Jaipur..."
          className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
        />
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
        <span className="text-slate-400 text-[10px] uppercase font-semibold shrink-0">Jaipur Hubs:</span>
        {JAIPUR_AREAS.slice(0, 6).map((area) => (
          <button
            key={area.name}
            type="button"
            onClick={() => handleSelectPreset(area)}
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition shrink-0 font-medium"
          >
            {area.name}
          </button>
        ))}
      </div>

      <div 
        className="w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 relative"
        style={{ height }}
      >
        <Map
          defaultCenter={{ lat: currentCoords.lat, lng: currentCoords.lng }}
          defaultZoom={14}
          mapId="DEMO_MAP_ID"
          className="w-full h-full"
          gestureHandling="greedy"
          disableDefaultUI={false}
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          onClick={(e) => {
            if (e.detail.latLng) {
              const lat = e.detail.latLng.lat;
              const lng = e.detail.latLng.lng;
              const updated = {
                lat,
                lng,
                formattedAddress: `Entrance pinpoint @ ${lat.toFixed(4)}, ${lng.toFixed(4)}, Jaipur`,
              };
              setCurrentCoords(updated);
              onLocationSelect(updated);
            }
          }}
        >
          <AdvancedMarker
            position={{ lat: currentCoords.lat, lng: currentCoords.lng }}
            gmpDraggable={true}
            onDragEnd={handleMarkerDragEnd}
            title="Your exact delivery entrance"
          >
            <Pin
              background="#2563eb"
              borderColor="#1e40af"
              glyphColor="#ffffff"
              scale={1.2}
            />
          </AdvancedMarker>
        </Map>

        <div className="absolute top-3 left-3 z-10 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-white text-xs shadow-lg flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="font-semibold text-[11px]">
            {currentCoords.lat.toFixed(4)}° N, {currentCoords.lng.toFixed(4)}° E
          </span>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mt-0.5">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              Selected Entrance Location
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1">
              {currentCoords.formattedAddress || `${currentCoords.lat.toFixed(4)}, ${currentCoords.lng.toFixed(4)}, Jaipur`}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setConfirmed(true);
            setTimeout(() => setConfirmed(false), 2000);
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
            confirmed
              ? 'bg-emerald-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
          }`}
        >
          {confirmed ? 'Location Saved!' : 'Confirm Pinpoint'}
        </button>
      </div>
    </div>
  );
};

// FALLBACK COMPONENT (Rendered when no Google Maps key is active - NO useMap or useMapsLibrary calls)
const GoogleAddressAutocompleteFallback: React.FC<GoogleAddressAutocompleteProps> = ({
  initialLocation = { lat: 26.8732, lng: 75.7972, formattedAddress: 'Tonk Road, Jaipur, Rajasthan' },
  onLocationSelect,
  height = '320px'
}) => {
  const [currentCoords, setCurrentCoords] = useState<LocationCoordinates>(initialLocation);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleSelectPreset = (area: typeof JAIPUR_AREAS[0]) => {
    const updated: LocationCoordinates = {
      lat: area.lat,
      lng: area.lng,
      formattedAddress: area.address,
    };
    setCurrentCoords(updated);
    setSearchQuery(area.name);
    onLocationSelect(updated);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newCoords: LocationCoordinates = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          formattedAddress: `Live GPS Location (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`,
        };
        setCurrentCoords(newCoords);
        onLocationSelect(newCoords);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      }
    );
  };

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Exact Delivery Pinpoint
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Select Jaipur locality or enter coordinates for doorstep delivery
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 transition"
        >
          <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Locating...' : 'Use My GPS'}</span>
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            const matched = JAIPUR_AREAS.find(a => a.name.toLowerCase().includes(e.target.value.toLowerCase()));
            if (matched) {
              const updated = { lat: matched.lat, lng: matched.lng, formattedAddress: matched.address };
              setCurrentCoords(updated);
              onLocationSelect(updated);
            }
          }}
          placeholder="Type Jaipur locality (e.g. Mansarovar, C-Scheme, Vaishali Nagar)..."
          className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
        />
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
        <span className="text-slate-400 text-[10px] uppercase font-semibold shrink-0">Jaipur Hubs:</span>
        {JAIPUR_AREAS.slice(0, 6).map((area) => (
          <button
            key={area.name}
            type="button"
            onClick={() => handleSelectPreset(area)}
            className={`px-2.5 py-1 rounded-full text-[11px] transition shrink-0 font-medium ${
              Math.abs(currentCoords.lat - area.lat) < 0.005
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {area.name}
          </button>
        ))}
      </div>

      {/* Interactive Vector Grid with Jaipur Hotspots */}
      <div 
        className="w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 relative bg-slate-900 flex flex-col items-center justify-center p-4 select-none"
        style={{ height }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-60"></div>
        <div className="absolute w-64 h-64 rounded-full bg-blue-500/10 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2 w-full max-w-lg">
          {JAIPUR_AREAS.map((area) => {
            const isSelected = Math.abs(currentCoords.lat - area.lat) < 0.005;
            return (
              <button
                key={area.name}
                type="button"
                onClick={() => handleSelectPreset(area)}
                className={`p-2 rounded-xl text-left border transition ${
                  isSelected
                    ? 'bg-blue-600/30 border-blue-500 text-white ring-2 ring-blue-500/50 shadow-md'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">{area.name}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {area.lat.toFixed(2)}°, {area.lng.toFixed(2)}°
                </div>
              </button>
            );
          })}
        </div>

        <div className="absolute top-3 left-3 z-10 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-white text-xs shadow-lg flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-[11px]">
            {currentCoords.lat.toFixed(4)}° N, {currentCoords.lng.toFixed(4)}° E
          </span>
        </div>

        <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950/85 backdrop-blur border border-slate-800 text-[11px] text-slate-400">
          <Compass className="w-3.5 h-3.5 text-blue-400" />
          <span>Jaipur Metro Delivery Zone • Click any hub to reposition pin</span>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mt-0.5">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              Selected Entrance Location
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1">
              {currentCoords.formattedAddress || `${currentCoords.lat.toFixed(4)}, ${currentCoords.lng.toFixed(4)}, Jaipur`}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setConfirmed(true);
            setTimeout(() => setConfirmed(false), 2000);
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
            confirmed
              ? 'bg-emerald-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
          }`}
        >
          {confirmed ? 'Location Saved!' : 'Confirm Pinpoint'}
        </button>
      </div>
    </div>
  );
};

// EXPORTED CONTAINER: Automatically switches between Live Google Maps and Fallback based on API key availability
export const GoogleAddressAutocomplete: React.FC<GoogleAddressAutocompleteProps> = (props) => {
  const { hasValidKey } = useGoogleMaps();
  if (hasValidKey) {
    return <GoogleAddressAutocompleteLive {...props} />;
  }
  return <GoogleAddressAutocompleteFallback {...props} />;
};
