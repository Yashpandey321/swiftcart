import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Navigation, 
  Route, 
  Truck, 
  Users, 
  MapPin, 
  Building2, 
  BarChart3, 
  Bell, 
  Settings, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight,
  Send,
  X
} from 'lucide-react';
import { NavTab } from '../../types';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  activeShipmentsCount: number;
  unreadNotificationsCount: number;
  onOpenHelp: () => void;
}

interface NavItemConfig {
  id: NavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  activeShipmentsCount,
  unreadNotificationsCount,
  onOpenHelp,
}) => {
  const mainNavItems: NavItemConfig[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'shipments', label: 'Shipments', icon: Package, badge: activeShipmentsCount > 0 ? activeShipmentsCount : undefined, badgeColor: 'bg-blue-600 text-white' },
    { id: 'tracking', label: 'Live Tracking', icon: Navigation, badge: 'Live', badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
    { id: 'route-optimizer', label: 'Route Optimizer', icon: Route },
    { id: 'fleet', label: 'Fleet', icon: Truck },
    { id: 'drivers', label: 'Drivers', icon: Users },
    { id: 'locations', label: 'Locations', icon: MapPin },
    { id: 'customers', label: 'Customers', icon: Building2 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined, badgeColor: 'bg-rose-500 text-white' },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-slate-900 border-r border-slate-800/80 text-slate-300 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-[76px]' : 'w-[260px]'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/60">
          {!isCollapsed ? (
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 shrink-0">
                <Send className="w-4 h-4 text-white -rotate-12 translate-x-[-1px] translate-y-[1px]" />
                <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 font-bold tracking-tight text-white text-base">
                  <span>SwiftRoute</span>
                </div>
                <div className="text-[10px] text-blue-400 font-medium tracking-wide truncate">
                  Deliver Smarter. Faster.
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-auto">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Send className="w-4 h-4 text-white -rotate-12" />
              </div>
            </div>
          )}

          {/* Close mobile button */}
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
          {!isCollapsed && (
            <div className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Operations
            </div>
          )}

          {mainNavItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center rounded-xl transition-all duration-150 relative group ${
                  isCollapsed ? 'justify-center p-3' : 'px-3.5 py-2.5'
                } ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <Icon
                  className={`shrink-0 transition-transform ${
                    isCollapsed ? 'w-5 h-5' : 'w-4.5 h-4.5 mr-3'
                  } ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}
                />

                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left text-sm truncate font-medium">
                      {item.label}
                    </span>
                    {item.badge !== undefined && (
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                          item.badgeColor || 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}

                {/* Collapsed notification dot indicator */}
                {isCollapsed && item.badge !== undefined && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-slate-900" />
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer Section: Help & User Profile */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 space-y-2">
          {/* Help & Support Button */}
          <button
            onClick={onOpenHelp}
            className={`w-full flex items-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/70 transition-colors ${
              isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2'
            }`}
            title="Help & Support"
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            {!isCollapsed && (
              <span className="ml-3 text-xs font-medium text-slate-300">Help & Support</span>
            )}
          </button>

          {/* User Profile summary card */}
          {!isCollapsed ? (
            <div className="flex items-center space-x-3 p-2 rounded-xl bg-slate-800/40 border border-slate-800/60">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-xs text-white ring-2 ring-blue-500/30 shrink-0">
                YP
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-white truncate">Yash Pandey</div>
                <div className="text-[10px] text-slate-400 truncate">Dispatch Lead</div>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Online" />
            </div>
          ) : (
            <div className="flex justify-center py-1">
              <div 
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-xs text-white ring-2 ring-blue-500/30"
                title="Yash Pandey (Dispatch Lead)"
              >
                YP
              </div>
            </div>
          )}

          {/* Collapse / Expand Toggle Button for Desktop */}
          <div className="hidden lg:flex justify-end pt-1">
            <button
              onClick={onToggleCollapse}
              className="w-full flex items-center justify-center p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800/80 transition-colors text-xs"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <div className="flex items-center gap-1.5">
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-[11px]">Collapse menu</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
