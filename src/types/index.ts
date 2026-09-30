export type PriorityLevel = 'standard' | 'express' | 'urgent' | 'critical';

export type DeliveryStatus = 
  | 'pending'
  | 'in-queue'
  | 'assigned'
  | 'picked_up'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'delayed'
  | 'cancelled';

export interface TimelineEvent {
  step: 'created' | 'pickup_completed' | 'driver_assigned' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered';
  label: string;
  timestamp?: number;
  completed: boolean;
  active?: boolean;
  notes?: string;
}

export interface StatusLog {
  id?: string;
  status: DeliveryStatus;
  timestamp: string | number;
  location?: string;
  notes?: string;
  updatedBy?: string;
}

export interface Shipment {
  id: string;
  trackingCode?: string; // e.g. SR-10284
  trackingNumber?: string; // alias
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  recipient?: string;
  recipientName?: string;
  recipientPhone?: string;
  packageType?: string;
  weightKg: number;
  dimensions?: any;
  specialInstructions?: string;
  notes?: string;
  declaredValue?: number;
  deadlineMinutes?: number;
  
  // Origin / Pickup
  pickupLocationId?: string;
  pickupLocationName?: string;
  pickupAddress?: string;
  originLocationId?: string;
  sourceLocationId?: string;
  pickupDate?: string;
  pickupTime?: string;

  // Destination / Delivery
  deliveryLocationId?: string;
  deliveryLocationName?: string;
  destinationLocationId?: string;
  deliveryAddress?: string;
  preferredDeliveryDate?: string;
  deliveryTime?: string;

  priority: PriorityLevel;
  urgencyScore: number;
  status: DeliveryStatus;

  driverId?: string;
  driverName?: string;
  vehicleId?: string;
  vehicleCode?: string;

  eta?: string;
  estimatedDeliveryTime?: string;
  distanceRemainingKm?: number;
  totalDistanceKm?: number;
  estimatedTransitMin?: number;

  createdAt: number | string;
  deliveredAt?: number | string;
  timeline?: TimelineEvent[];
  statusLogs?: StatusLog[];
}

export type Package = Shipment;
export type PackagePriority = PriorityLevel;
export type PackageStatus = DeliveryStatus;
export type PackageType = string;
export type OptimizationGoal = 'fastest_time' | 'shortest_distance' | 'fuel_efficient';

export type LocationType = 'warehouse' | 'hub' | 'delivery_station' | 'dropoff' | 'distribution_center' | 'pickup_point';

export interface DeliveryLocation {
  id: string;
  name: string;
  code: string;
  type: LocationType;
  x: number;
  y: number;
  lat?: number;
  lng?: number;
  placeId?: string;
  formattedAddress?: string;
  address: string;
  city?: string;
  operatingHours?: string;
  contactPhone?: string;
  managerName?: string;
  activeShipmentsCount?: number;
  isHub?: boolean;
}

export interface Road {
  id: string;
  from: string; // locationId
  to: string; // locationId
  distanceKm: number;
  speedLimitKmH?: number;
  trafficMultiplier?: number;
  trafficFactor?: number;
  roadCondition?: 'optimal' | 'moderate' | 'congested';
  isBidirectional?: boolean;
  isActive?: boolean;
}

export type VehicleType = 'van' | 'truck' | 'bike' | 'electric_van' | 'drone';
export type VehicleStatus = 'available' | 'on_route' | 'maintenance' | 'idle';

export interface Vehicle {
  id: string;
  code?: string;
  name?: string;
  model?: string;
  plateNumber?: string;
  type?: VehicleType;
  driverId?: string;
  driverName?: string;
  assignedDriverId?: string;
  maxCapacityKg: number;
  currentPayloadKg?: number;
  currentLoadKg?: number;
  averageSpeedKmH?: number;
  currentLocationId: string;
  currentLocationName?: string;
  lat?: number;
  lng?: number;
  currentLatitude?: number;
  currentLongitude?: number;
  status: VehicleStatus;
  fuelType?: 'electric' | 'diesel' | 'hybrid';
  fuelLevelPercent?: number;
  lastServiceDate?: string;
  assignedShipmentIds?: string[];
  assignedPackageIds?: string[];
}

export type DriverStatus = 'available' | 'on_route' | 'break' | 'offline';

export interface Driver {
  id: string;
  driverIdCode?: string;
  name: string;
  phone: string;
  email?: string;
  licenseNumber?: string;
  vehicleId?: string;
  assignedVehicleId?: string;
  assignedVehicleCode?: string;
  currentLocationId?: string;
  currentLocationName?: string;
  lat?: number;
  lng?: number;
  currentLatitude?: number;
  currentLongitude?: number;
  status: DriverStatus;
  deliveriesToday?: number;
  completedToday?: number;
  pendingToday?: number;
  completedDeliveriesCount?: number;
  activeDeliveriesCount?: number;
  onTimeRatePercent?: number;
  successRate?: number;
  avgDeliveryTimeMin?: number;
  performanceScore?: number;
  rating: number;
  joinedDate?: string;
}

export interface Customer {
  id: string;
  customerIdCode?: string;
  name: string;
  company?: string;
  phone: string;
  email: string;
  address?: string;
  defaultAddress?: string;
  city?: string;
  lat?: number;
  lng?: number;
  placeId?: string;
  totalOrders?: number;
  totalShipments?: number;
  deliveredShipments?: number;
  pendingShipments?: number;
  activeShipmentsCount?: number;
  joinedDate?: string;
}

export interface DeliveryNotification {
  id: string;
  type: 'urgent' | 'delivered' | 'capacity' | 'route' | 'delayed' | 'info';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  linkTab?: NavTab;
  shipmentId?: string;
}

export type NavTab = 
  | 'dashboard'
  | 'shipments'
  | 'tracking'
  | 'route-optimizer'
  | 'fleet'
  | 'drivers'
  | 'locations'
  | 'customers'
  | 'analytics'
  | 'notifications'
  | 'settings';

export interface RouteOptimizationPlan {
  id: string;
  startingLocationId: string;
  vehicleId: string;
  shipmentIds: string[];
  totalDistanceKm: number;
  estimatedTimeMin: number;
  stopsCount: number;
  fuelEstimateLiters: number;
  distanceSavedKm: number;
  timeSavedMin: number;
  savingsPercentage: number;
  stops: {
    sequence: number;
    locationId: string;
    locationName: string;
    action: 'pickup' | 'delivery' | 'origin' | 'return';
    shipmentCode?: string;
    recipient?: string;
    distanceFromPrevKm: number;
    cumulativeDistanceKm: number;
    eta: string;
  }[];
}

export interface UndoAction {
  id: string;
  type: string;
  timestamp: number;
  description: string;
  payload: any;
}

export interface DijkstraStep {
  step: number;
  currentNode: string;
  currentNodeName: string;
  tentativeDistances: Record<string, number>;
  visitedNodes: string[];
  unvisitedNodes: string[];
  relaxedEdges: { from: string; to: string; newDist: number }[];
  description: string;
}

export interface DijkstraResult {
  distances: Record<string, number>;
  previous: Record<string, string | null>;
  path: string[];
  totalDistanceKm: number;
  estimatedTimeMin: number;
  steps: DijkstraStep[];
  visitedOrder: string[];
}

export interface TraversalStep {
  step?: number;
  stepNumber?: number;
  currentNode?: string;
  currentNodeId?: string;
  currentNodeName?: string;
  frontier?: string[];
  queueOrStackState?: string[];
  visitedNodes?: string[];
  visited?: string[];
  description: string;
}

export interface GreedyStep {
  step: number;
  action?: string;
  vehicleId?: string;
  packageId?: string;
  selectedPackageId?: string;
  selectedPackageRecipient?: string;
  candidatePackages?: any[];
  locationId?: string;
  currentHub?: string;
  distanceKm?: number;
  cumulativeDistance?: number;
  payloadKg?: number;
  reason?: string;
  description?: string;
}

export interface MergeSortStep {
  step: number;
  phase: string;
  leftArray?: any[];
  rightArray?: any[];
  mergedArray?: any[];
  arraySnapshot?: any[];
  leftSlice?: any;
  rightSlice?: any;
  mergedSlice?: any;
  description: string;
}

export interface DeliveryHistoryItem {
  id: string;
  packageId: string;
  trackingCode: string;
  recipient: string;
  sourceLocationId: string;
  destinationLocationId: string;
  vehicleId: string;
  totalDistanceKm: number;
  totalTimeMinutes: number;
  deliveredAt: number;
}

export interface DeliveryRecord {
  id: string;
  packageId: string;
  trackingCode: string;
  recipient: string;
  sourceLocationId: string;
  destinationLocationId: string;
  vehicleId: string;
  totalDistanceKm: number;
  totalTimeMinutes: number;
  timestamp: number;
}
