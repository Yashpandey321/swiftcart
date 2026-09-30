import React from 'react';
import { DeliveryStatus, PriorityLevel, VehicleStatus, DriverStatus } from '../../types';
import { 
  Clock, 
  UserCheck, 
  PackageCheck, 
  Truck, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Zap,
  Flame,
  ShieldCheck
} from 'lucide-react';

export const StatusBadge: React.FC<{ status: DeliveryStatus; size?: 'sm' | 'md' }> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  switch (status) {
    case 'pending':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 whitespace-nowrap ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          Pending
        </span>
      );
    case 'assigned':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 whitespace-nowrap ${sizeClasses}`}>
          <UserCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          Assigned
        </span>
      );
    case 'picked_up':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 whitespace-nowrap ${sizeClasses}`}>
          <PackageCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          Picked Up
        </span>
      );
    case 'in_transit':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 whitespace-nowrap ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
          <Truck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          In Transit
        </span>
      );
    case 'out_for_delivery':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 whitespace-nowrap ${sizeClasses}`}>
          <Send className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          Out for Delivery
        </span>
      );
    case 'delivered':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 whitespace-nowrap ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          Delivered
        </span>
      );
    case 'delayed':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 whitespace-nowrap ${sizeClasses}`}>
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
          Delayed
        </span>
      );
    case 'cancelled':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border border-gray-300 dark:border-gray-700 whitespace-nowrap ${sizeClasses}`}>
          <XCircle className="w-3.5 h-3.5 text-gray-500" />
          Cancelled
        </span>
      );
    default:
      return null;
  }
};

export const PriorityBadge: React.FC<{ priority: PriorityLevel }> = ({ priority }) => {
  switch (priority) {
    case 'urgent':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 whitespace-nowrap">
          <Flame className="w-3 h-3 text-rose-600 dark:text-rose-400" />
          Urgent
        </span>
      );
    case 'express':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 whitespace-nowrap">
          <Zap className="w-3 h-3 text-blue-600 dark:text-blue-400" />
          Express
        </span>
      );
    case 'standard':
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap">
          <ShieldCheck className="w-3 h-3 text-slate-500" />
          Standard
        </span>
      );
  }
};

export const VehicleStatusBadge: React.FC<{ status: VehicleStatus }> = ({ status }) => {
  switch (status) {
    case 'on_route':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          On Route
        </span>
      );
    case 'available':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Available
        </span>
      );
    case 'maintenance':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          Maintenance
        </span>
      );
    case 'idle':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          Idle
        </span>
      );
  }
};

export const DriverStatusBadge: React.FC<{ status: DriverStatus }> = ({ status }) => {
  switch (status) {
    case 'on_route':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          On Route
        </span>
      );
    case 'available':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Available
        </span>
      );
    case 'break':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          On Break
        </span>
      );
    case 'offline':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          Offline
        </span>
      );
  }
};
