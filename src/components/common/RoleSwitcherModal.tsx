import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShoppingBag, 
  Truck, 
  Check, 
  X, 
  LogIn, 
  UserCheck, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export type UserRole = 'customer' | 'admin' | 'driver';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectRole,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);

  if (!isOpen) return null;

  const rolesConfig: {
    id: UserRole;
    title: string;
    subtitle: string;
    name: string;
    email: string;
    badge: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    features: string[];
  }[] = [
    {
      id: 'customer',
      title: 'Customer Experience',
      subtitle: 'Browse products, order items, real-time live package tracking',
      name: 'Yash Pandey',
      email: 'pandeyyyash2025@gmail.com',
      badge: 'Prime Member',
      icon: ShoppingBag,
      accentColor: 'blue',
      features: [
        'Shop from 12+ categories & deals',
        'Smart cart & multi-step checkout',
        'Doorstep package tracking with live driver ETA',
        'Order history & profile management',
      ],
    },
    {
      id: 'admin',
      title: 'Admin / Delivery Manager',
      subtitle: 'Operations dashboard, fleet dispatch, Dijkstra route optimizer',
      name: 'Operations Chief',
      email: 'admin@swiftcart.internal',
      badge: 'HQ Dispatch Lead',
      icon: ShieldCheck,
      accentColor: 'indigo',
      features: [
        'Fleet & driver management with capacity bars',
        'Dijkstra & Greedy autonomous route optimization',
        'Live interactive map with vehicles & road corridors',
        'Multi-level Stack undo for admin actions',
      ],
    },
    {
      id: 'driver',
      title: 'Delivery Driver',
      subtitle: 'Route navigation, assigned drop-offs, OTP delivery verification',
      name: 'Rahul Kumar',
      email: 'rahul.driver@swiftcart.internal',
      badge: 'Vehicle: RJ-14-AB-1024',
      icon: Truck,
      accentColor: 'emerald',
      features: [
        'View daily assigned delivery packages',
        'Driver status switcher (Available, On Route, Break)',
        'Direct customer phone call & directions',
        '4-Digit OTP customer delivery confirmation',
      ],
    },
  ];

  const handleConfirm = () => {
    onSelectRole(selectedRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Switch Role / Switch Interface
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Experience SwiftCart from any stakeholder perspective
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Roles List */}
        <div className="p-6 space-y-3.5 max-h-[70vh] overflow-y-auto">
          {rolesConfig.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            const isCurrent = currentRole === role.id;

            return (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30 shadow-md shadow-blue-500/10'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/80'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        role.id === 'customer'
                          ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                          : role.id === 'admin'
                          ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                          : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {role.title}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full">
                          {role.badge}
                        </span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded-full">
                            Active Now
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {role.subtitle}
                      </p>

                      <div className="mt-2.5 flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                        <span>Account: <strong className="text-slate-900 dark:text-white">{role.name}</strong></span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500 text-[11px]">{role.email}</span>
                      </div>

                      <ul className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                        {role.features.map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="shrink-0 mt-1">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
          <div className="text-xs text-slate-500">
            Current Role: <strong className="text-slate-800 dark:text-slate-200 capitalize">{currentRole}</strong>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-md shadow-blue-500/25 cursor-pointer"
            >
              <span>Switch to {rolesConfig.find((r) => r.id === selectedRole)?.title}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
