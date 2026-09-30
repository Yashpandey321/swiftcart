import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Warehouse, 
  MapPin, 
  Plus, 
  Truck, 
  Package, 
  Search, 
  Filter, 
  Navigation, 
  Layers, 
  X, 
  RotateCcw,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { DeliveryLocation, Road, Vehicle, Shipment } from '../../types';
import { WeightedGraph } from '../../dsa/Graph';
import { LiveDeliveryMap } from '../common/LiveDeliveryMap';
import { useToast } from '../common/Toast';

interface LocationsViewProps {
  locations: DeliveryLocation[];
  roads: Road[];
  vehicles: Vehicle[];
  shipments: Shipment[];
  graph: WeightedGraph;
  onAddLocation: (loc: Omit<DeliveryLocation, 'id'>) => void;
  onDeleteLocation: (id: string) => void;
  onAddRoad: (road: Omit<Road, 'id'>) => void;
  onDeleteRoad: (roadId: string) => void;
}

export const LocationsView: React.FC<LocationsViewProps> = ({
  locations,
  roads,
  vehicles,
  shipments,
  graph,
  onAddLocation,
  onDeleteLocation,
  onAddRoad,
  onDeleteRoad,
}) => {
  const { showToast } = useToast();

  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocId, setSelectedLocId] = useState<string | null>(locations[0]?.id || null);

  // Add Facility Modal
  const [showAddFacilityModal, setShowAddFacilityModal] = useState(false);
  const [facilityName, setFacilityName] = useState('');
  const [facilityCode, setFacilityCode] = useState('');
  const [facilityAddress, setFacilityAddress] = useState('');
  const [facilityType, setFacilityType] = useState<DeliveryLocation['type']>('distribution_center');

  // Add Corridor Modal
  const [showAddCorridorModal, setShowAddCorridorModal] = useState(false);
  const [corridorFrom, setCorridorFrom] = useState(locations[0]?.id || '');
  const [corridorTo, setCorridorTo] = useState(locations[1]?.id || '');
  const [corridorDist, setCorridorDist] = useState(8.5);

  const filteredLocations = useMemo(() => {
    return locations.filter(l => {
      if (typeFilter !== 'all' && l.type !== typeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          l.name.toLowerCase().includes(q) ||
          l.code.toLowerCase().includes(q) ||
          l.address.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [locations, typeFilter, searchQuery]);

  const handleCreateFacility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facilityName.trim()) {
      showToast('error', 'Validation Error', 'Facility name is required.');
      return;
    }

    // Auto calculate coordinates in canvas
    const x = Math.round(200 + Math.random() * 550);
    const y = Math.round(120 + Math.random() * 320);

    onAddLocation({
      name: facilityName,
      code: facilityCode || facilityName.slice(0, 3).toUpperCase(),
      address: facilityAddress || 'Logistics Zone, Main Highway',
      type: facilityType,
      x,
      y,
    });

    showToast('success', 'Facility Added', `${facilityName} registered in the logistics network.`);
    setShowAddFacilityModal(false);
    setFacilityName('');
    setFacilityCode('');
    setFacilityAddress('');
  };

  const handleCreateCorridor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!corridorFrom || !corridorTo || corridorFrom === corridorTo) {
      showToast('error', 'Corridor Error', 'Please select two distinct facilities.');
      return;
    }

    onAddRoad({
      from: corridorFrom,
      to: corridorTo,
      distanceKm: corridorDist,
      speedLimitKmH: 60,
      trafficMultiplier: 1.0,
      isActive: true,
    });

    showToast('success', 'Corridor Connected', 'New transport corridor added.');
    setShowAddCorridorModal(false);
  };

  return (
    <div className="space-y-5 animate-in fade-in-50 duration-200">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Logistics Facilities & Corridors</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              {locations.length} Facilities • {roads.length} Corridors
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage warehouses, distribution centers, delivery hubs, and transit route corridors
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddCorridorModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
          >
            <Plus className="w-3.5 h-3.5 text-blue-600" />
            <span>Add Corridor</span>
          </button>

          <button
            onClick={() => setShowAddFacilityModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition shadow-md shadow-blue-600/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Facility</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Map Overview */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-sm text-slate-900 dark:text-white">Facility Network Topography</span>
          <span className="text-xs text-slate-400">Click any facility or drag map to inspect</span>
        </div>

        <LiveDeliveryMap
          locations={locations}
          roads={roads}
          vehicles={vehicles}
          selectedLocationId={selectedLocId}
          onSelectLocation={loc => setSelectedLocId(loc.id)}
          height="420px"
        />
      </div>

      {/* 3. Filters & Facility Cards Grid */}
      <div className="space-y-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search facility name, code, or address..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="w-full sm:w-60">
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">All Facility Types</option>
              <option value="warehouse">Warehouses</option>
              <option value="distribution_center">Distribution Centers</option>
              <option value="hub">Delivery Hubs</option>
              <option value="pickup_point">Customer Pickup Points</option>
            </select>
          </div>
        </div>

        {/* Facility Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredLocations.map(location => {
            const isSelected = selectedLocId === location.id;
            const assignedVehiclesCount = vehicles.filter(v => v.currentLocationId === location.id).length;
            const activeShipmentsCount = shipments.filter(
              s => s.destinationLocationId === location.id || s.originLocationId === location.id
            ).length;

            return (
              <div
                key={location.id}
                onClick={() => setSelectedLocId(location.id)}
                className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 shadow-xs flex flex-col justify-between space-y-3 cursor-pointer transition ${
                  isSelected
                    ? 'border-blue-600 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                        {location.type === 'warehouse' ? (
                          <Warehouse className="w-4 h-4" />
                        ) : (
                          <Building2 className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white">{location.name}</div>
                        <span className="text-[10px] font-mono text-slate-400">{location.code}</span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize">
                      {location.type.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <span>{location.address}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Shipments</span>
                    <span className="font-bold text-slate-900 dark:text-white">{activeShipmentsCount} active</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Vehicles</span>
                    <span className="font-bold text-slate-900 dark:text-white">{assignedVehiclesCount} on site</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Facility Modal */}
      {showAddFacilityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in-50 duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Add Logistics Facility</h3>
              <button onClick={() => setShowAddFacilityModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFacility} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Facility Name *</label>
                <input
                  type="text"
                  required
                  value={facilityName}
                  onChange={e => setFacilityName(e.target.value)}
                  placeholder="e.g. South Corridor Transit Hub"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Facility Code</label>
                <input
                  type="text"
                  value={facilityCode}
                  onChange={e => setFacilityCode(e.target.value)}
                  placeholder="e.g. SCH-09"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white uppercase"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Facility Type</label>
                <select
                  value={facilityType}
                  onChange={e => setFacilityType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                >
                  <option value="warehouse">Warehouse</option>
                  <option value="distribution_center">Distribution Center</option>
                  <option value="hub">Delivery Hub</option>
                  <option value="pickup_point">Customer Pickup Point</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Street Address</label>
                <input
                  type="text"
                  value={facilityAddress}
                  onChange={e => setFacilityAddress(e.target.value)}
                  placeholder="e.g. 500 Freight Highway, Logistics Park"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddFacilityModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                >
                  Save Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Corridor Modal */}
      {showAddCorridorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in-50 duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Connect Transport Corridor</h3>
              <button onClick={() => setShowAddCorridorModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCorridor} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">From Facility</label>
                <select
                  value={corridorFrom}
                  onChange={e => setCorridorFrom(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                >
                  {locations.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">To Facility</label>
                <select
                  value={corridorTo}
                  onChange={e => setCorridorTo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                >
                  {locations.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Distance (km)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  value={corridorDist}
                  onChange={e => setCorridorDist(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCorridorModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                >
                  Create Corridor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
