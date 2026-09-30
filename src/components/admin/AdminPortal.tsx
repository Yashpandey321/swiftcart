import React, { useState } from 'react';
import { 
  Sidebar 
} from '../layout/Sidebar';
import { 
  TopNavbar 
} from '../layout/TopNavbar';
import { 
  DashboardView 
} from '../views/DashboardView';
import { 
  ShipmentsView 
} from '../views/ShipmentsView';
import { 
  LiveTrackingView 
} from '../views/LiveTrackingView';
import { 
  RouteOptimizerView 
} from '../views/RouteOptimizerView';
import { 
  FleetView 
} from '../views/FleetView';
import { 
  DriversView 
} from '../views/DriversView';
import { 
  LocationsView 
} from '../views/LocationsView';
import { 
  CustomersView 
} from '../views/CustomersView';
import { 
  AnalyticsView 
} from '../views/AnalyticsView';
import { 
  SettingsView 
} from '../views/SettingsView';

import { 
  CreateShipmentModal 
} from '../common/CreateShipmentModal';
import { 
  GlobalSearchModal 
} from '../common/GlobalSearchModal';
import { 
  ShipmentDetailsDrawer 
} from '../common/ShipmentDetailsDrawer';

import { 
  Shipment, 
  DeliveryLocation, 
  Road, 
  Vehicle, 
  Driver, 
  Customer, 
  NavTab, 
  DeliveryStatus, 
  DeliveryNotification,
  UndoAction
} from '../../types';
import { WeightedGraph } from '../../dsa/Graph';
import { Stack } from '../../dsa/Stack';
import { 
  RotateCcw, 
  ShoppingBag, 
  Truck, 
  Sparkles,
  HelpCircle,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface AdminPortalProps {
  shipments: Shipment[];
  locations: DeliveryLocation[];
  roads: Road[];
  vehicles: Vehicle[];
  drivers: Driver[];
  customers: Customer[];
  graph: WeightedGraph;
  undoStack: Stack<UndoAction>;
  onUpdateShipmentStatus: (shipmentId: string, status: DeliveryStatus) => void;
  onAssignDriver: (shipmentId: string, driverId: string) => void;
  onAssignVehicleToShipment?: (shipmentId: string, vehicleId: string) => void;
  onDeleteShipment: (shipmentId: string) => void;
  onCreateShipment: (shipment: Omit<Shipment, 'id' | 'createdAt' | 'statusLogs'>) => void;
  onAddLocation: (loc: Omit<DeliveryLocation, 'id'>) => void;
  onDeleteLocation: (id: string) => void;
  onAddRoad: (road: Omit<Road, 'id'>) => void;
  onDeleteRoad: (roadId: string) => void;
  onUndoLastAction: () => void;
  onSwitchRole: (role: 'customer' | 'admin' | 'driver') => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onShowToast: (msg: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  shipments,
  locations,
  roads,
  vehicles,
  drivers,
  customers,
  graph,
  undoStack,
  onUpdateShipmentStatus,
  onAssignDriver,
  onAssignVehicleToShipment,
  onDeleteShipment,
  onCreateShipment,
  onAddLocation,
  onDeleteLocation,
  onAddRoad,
  onDeleteRoad,
  onUndoLastAction,
  onSwitchRole,
  isDarkMode,
  onToggleDarkMode,
  onShowToast,
}) => {
  // Navigation
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Modals & Drawers
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isCreateShipmentOpen, setIsCreateShipmentOpen] = useState<boolean>(false);
  const [selectedShipmentForDetails, setSelectedShipmentForDetails] = useState<Shipment | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // Admin Notifications
  const [notifications, setNotifications] = useState<DeliveryNotification[]>([
    {
      id: 'notif-1',
      type: 'urgent',
      title: 'Urgent Order Dispatched',
      message: 'Package #SC-102849 marked express priority for Jaipur North corridor.',
      timestamp: Date.now() - 1000 * 60 * 15,
      read: false,
      linkTab: 'shipments',
    },
    {
      id: 'notif-2',
      type: 'capacity',
      title: 'Vehicle Capacity Alert',
      message: 'Vehicle Tata Ace EV (V-101) payload is at 84% maximum rating.',
      timestamp: Date.now() - 1000 * 60 * 45,
      read: false,
      linkTab: 'fleet',
    },
    {
      id: 'notif-3',
      type: 'route',
      title: 'Autonomous Route Optimized',
      message: 'Dijkstra shortest path algorithm computed 18.2% mileage savings.',
      timestamp: Date.now() - 1000 * 60 * 120,
      read: true,
      linkTab: 'route-optimizer',
    },
  ]);

  const activeShipmentsCount = shipments.filter(s => s.status !== 'delivered' && s.status !== 'cancelled').length;
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const undoAvailable = !undoStack.isEmpty();
  const lastUndoAction = undoStack.peek();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        activeShipmentsCount={activeShipmentsCount}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'lg:pl-[76px]' : 'lg:pl-[260px]'
        }`}
      >
        {/* Top Navbar */}
        <TopNavbar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={onToggleDarkMode}
          notifications={notifications}
          onMarkNotificationAsRead={(id) => {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
          }}
          onClearNotifications={() => {
            setNotifications([]);
            onShowToast('All notifications cleared');
          }}
          sidebarCollapsed={sidebarCollapsed}
          onOpenHelp={() => setIsHelpOpen(true)}
        />

        {/* Global Action Bar: Role Switcher & Undo Stack Button */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 flex-wrap">
          
          {/* Left: Role Switcher pills */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
              Mode:
            </span>
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => onSwitchRole('customer')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-blue-600 transition cursor-pointer"
                title="Switch to Customer E-Commerce Experience"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-blue-500" />
                <span>Customer Store</span>
              </button>
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs cursor-default"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Admin Operations</span>
              </button>
              <button
                onClick={() => onSwitchRole('driver')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-emerald-600 transition cursor-pointer"
                title="Switch to Delivery Driver App"
              >
                <Truck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Driver App</span>
              </button>
            </div>
          </div>

          {/* Right: Multi-Level Undo Stack Button */}
          <div className="flex items-center gap-3">
            {undoAvailable && (
              <button
                onClick={onUndoLastAction}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition shadow-xs cursor-pointer animate-in fade-in"
                title={`Undo: ${lastUndoAction?.description || 'Last action'}`}
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                <span>Undo: {lastUndoAction?.description?.slice(0, 24) || 'Revert Action'}...</span>
              </button>
            )}

            <button
              onClick={() => setIsCreateShipmentOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm shadow-blue-500/20 cursor-pointer"
            >
              + New Shipment
            </button>
          </div>

        </div>

        {/* View Component Render */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          
          {activeTab === 'dashboard' && (
            <DashboardView
              shipments={shipments}
              locations={locations}
              roads={roads}
              vehicles={vehicles}
              drivers={drivers}
              customers={customers}
              onNavigateTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectShipment={(s) => setSelectedShipmentForDetails(s)}
              onCreateShipmentClick={() => setIsCreateShipmentOpen(true)}
              onOptimizeRouteClick={() => setActiveTab('route-optimizer')}
            />
          )}

          {activeTab === 'shipments' && (
            <ShipmentsView
              shipments={shipments}
              locations={locations}
              drivers={drivers}
              vehicles={vehicles}
              onSelectShipment={(s) => setSelectedShipmentForDetails(s)}
              onCreateShipmentClick={() => setIsCreateShipmentOpen(true)}
              onUpdateShipmentStatus={onUpdateShipmentStatus}
              onAssignDriver={onAssignDriver}
              onDeleteShipment={onDeleteShipment}
              onOptimizeSelected={() => setActiveTab('route-optimizer')}
            />
          )}

          {activeTab === 'tracking' && (
            <LiveTrackingView
              shipments={shipments}
              vehicles={vehicles}
              drivers={drivers}
              locations={locations}
              roads={roads}
              onSelectShipment={(s) => setSelectedShipmentForDetails(s)}
            />
          )}

          {activeTab === 'route-optimizer' && (
            <RouteOptimizerView
              locations={locations}
              roads={roads}
              vehicles={vehicles}
              drivers={drivers}
              shipments={shipments}
              graph={graph}
              onDispatchRoute={(vehicleId, shipmentIds) => {
                onShowToast(`Route dispatched for vehicle #${vehicleId} with ${shipmentIds.length} stops!`);
                setActiveTab('tracking');
              }}
            />
          )}

          {activeTab === 'fleet' && (
            <FleetView
              vehicles={vehicles}
              drivers={drivers}
              locations={locations}
              onSelectVehicle={() => setActiveTab('tracking')}
              onAssignDriverToVehicle={() => onShowToast('Driver assigned to vehicle')}
              onNavigateToRoutes={() => setActiveTab('route-optimizer')}
            />
          )}

          {activeTab === 'drivers' && (
            <DriversView
              drivers={drivers}
              vehicles={vehicles}
              shipments={shipments}
              onNavigateToShipments={() => setActiveTab('shipments')}
            />
          )}

          {activeTab === 'locations' && (
            <LocationsView
              locations={locations}
              roads={roads}
              vehicles={vehicles}
              shipments={shipments}
              graph={graph}
              onAddLocation={onAddLocation}
              onDeleteLocation={onDeleteLocation}
              onAddRoad={onAddRoad}
              onDeleteRoad={onDeleteRoad}
            />
          )}

          {activeTab === 'customers' && (
            <CustomersView
              customers={customers}
              shipments={shipments}
              onCreateShipmentForCustomer={() => setIsCreateShipmentOpen(true)}
              onSelectShipment={(s) => setSelectedShipmentForDetails(s)}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              shipments={shipments}
              vehicles={vehicles}
              drivers={drivers}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView />
          )}

          {activeTab === 'notifications' && (
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">System Notifications</h2>
                  <p className="text-xs text-slate-500">Autonomous telemetry, dispatch alerts, and SLA triggers</p>
                </div>
                <button
                  onClick={() => {
                    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                    onShowToast('Marked all as read');
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/60"
                >
                  Mark All Read
                </button>
              </div>

              <div className="space-y-3">
                {notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-xl border transition flex items-start gap-3.5 ${
                      notif.read
                        ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-80'
                        : 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{notif.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{notif.message}</p>
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        {new Date(notif.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setIsSearchOpen(false);
        }}
        shipments={shipments}
        locations={locations}
        vehicles={vehicles}
        drivers={drivers}
        onSelectShipment={(s) => {
          setSelectedShipmentForDetails(s);
          setIsSearchOpen(false);
        }}
      />

      {/* Create Shipment Modal */}
      <CreateShipmentModal
        isOpen={isCreateShipmentOpen}
        onClose={() => setIsCreateShipmentOpen(false)}
        locations={locations}
        vehicles={vehicles}
        drivers={drivers}
        onCreateShipment={(newShipmentData) => {
          onCreateShipment(newShipmentData);
          setIsCreateShipmentOpen(false);
          onShowToast('Shipment created and scheduled for dispatch!');
        }}
      />

      {/* Shipment Details Drawer */}
      <ShipmentDetailsDrawer
        shipment={selectedShipmentForDetails}
        onClose={() => setSelectedShipmentForDetails(null)}
        locations={locations}
        vehicles={vehicles}
        drivers={drivers}
        onUpdateStatus={(id, status) => {
          onUpdateShipmentStatus(id, status);
          if (selectedShipmentForDetails) {
            setSelectedShipmentForDetails({ ...selectedShipmentForDetails, status });
          }
        }}
        onAssignDriver={(id, driverId) => {
          onAssignDriver(id, driverId);
        }}
      />

      {/* Help & Support Modal */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  SwiftCart Logistics Support
                </h3>
              </div>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Welcome to the SwiftCart Operations Control Center. Here is a quick overview of capabilities:
            </p>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
                <strong className="text-slate-900 dark:text-white block mb-0.5">Autonomous Dijkstra Routing:</strong>
                Computes the shortest and most fuel-efficient sequence through warehouse corridors using live road traffic multipliers.
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
                <strong className="text-slate-900 dark:text-white block mb-0.5">Multi-Level Undo (Stack):</strong>
                Every status update, driver assignment, or package deletion is tracked in an internal LIFO Stack, enabling safe single-click rollback.
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
                <strong className="text-slate-900 dark:text-white block mb-0.5">Capacity Enforcement:</strong>
                Fleet vehicles track real-time payload. Overloading a vehicle beyond its maximum rating is blocked by the dispatch engine.
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsHelpOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
