import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Package, 
  Plus, 
  X, 
  ExternalLink,
  Calendar,
  CheckCircle2,
  Clock,
  User
} from 'lucide-react';
import { Customer, Shipment } from '../../types';
import { useToast } from '../common/Toast';

interface CustomersViewProps {
  customers: Customer[];
  shipments: Shipment[];
  onCreateShipmentForCustomer?: (customer: Customer) => void;
  onSelectShipment?: (shipment: Shipment) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  shipments,
  onCreateShipmentForCustomer,
  onSelectShipment,
}) => {
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          (c.company && c.company.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [customers, searchQuery]);

  return (
    <div className="space-y-5 animate-in fade-in-50 duration-200">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Customer Directory</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              {customers.length} Enterprise Accounts
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage corporate shippers, addresses, contract tiers, and order histories
          </p>
        </div>
      </div>

      {/* 2. Search Filter */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search customer name, email, phone, or company..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* 3. Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCustomers.map(customer => {
          const customerShipments = shipments.filter(
            s => s.customerId === customer.id || s.customerName.toLowerCase() === customer.name.toLowerCase()
          );
          const activeCount = customerShipments.filter(
            s => s.status !== 'delivered' && s.status !== 'cancelled'
          ).length;

          return (
            <div
              key={customer.id}
              onClick={() => setSelectedCustomer(customer)}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-500/50 cursor-pointer transition"
            >
              <div>
                {/* Avatar and Name */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-sm text-white shadow-sm ring-2 ring-blue-500/20 shrink-0">
                    {customer.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {customer.name}
                    </div>
                    {customer.company && (
                      <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium truncate">
                        {customer.company}
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact info */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5 truncate">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{customer.address}</span>
                  </div>
                </div>

                {/* Orders Metrics */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Orders</span>
                    <span className="font-bold text-slate-900 dark:text-white">{customer.totalOrders}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Now</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{activeCount || customer.activeShipmentsCount}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center gap-2" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => setSelectedCustomer(customer)}
                  className="flex-1 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
                >
                  View History
                </button>
                <button
                  onClick={() => {
                    if (onCreateShipmentForCustomer) {
                      onCreateShipmentForCustomer(customer);
                    } else {
                      showToast('info', 'New Shipment', `Prefilled sender info for ${customer.name}.`);
                    }
                  }}
                  className="py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition"
                  title="Create Shipment"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Customer Profile & History Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-2xs animate-in fade-in-50 duration-150 flex justify-end">
          <div onClick={() => setSelectedCustomer(null)} className="flex-1" />

          <div className="w-full max-w-lg bg-white dark:bg-slate-900 h-full border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right-8 duration-200">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-lg text-white shadow-md">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{selectedCustomer.name}</h3>
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">{selectedCustomer.company || 'Direct Account'}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{selectedCustomer.email} • {selectedCustomer.phone}</div>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs text-slate-600 dark:text-slate-300">
              {/* Summary stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Lifetime Orders</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{selectedCustomer.totalOrders}</span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Default Address</span>
                  <span className="text-xs font-medium text-slate-900 dark:text-white line-clamp-2">
                    {selectedCustomer.address}
                  </span>
                </div>
              </div>

              {/* Order History */}
              <div className="space-y-3">
                <div className="font-bold text-slate-900 dark:text-white text-sm">Shipment History</div>
                <div className="space-y-2">
                  {shipments
                    .filter(
                      s => s.customerId === selectedCustomer.id || s.customerName.toLowerCase() === selectedCustomer.name.toLowerCase()
                    )
                    .map(s => (
                      <div
                        key={s.id}
                        onClick={() => {
                          if (onSelectShipment) onSelectShipment(s);
                          setSelectedCustomer(null);
                        }}
                        className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition flex items-center justify-between"
                      >
                        <div>
                          <div className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400">
                            {s.trackingNumber || s.id}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{s.deliveryAddress}</div>
                          <div className="text-[10px] text-slate-400">
                            {new Date(s.createdAt).toLocaleDateString()} • {s.weightKg} kg
                          </div>
                        </div>

                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${
                          s.status === 'delivered' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        }`}>
                          {s.status.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-slate-50 dark:bg-slate-950/40">
              <button
                onClick={() => {
                  if (onCreateShipmentForCustomer) onCreateShipmentForCustomer(selectedCustomer);
                  setSelectedCustomer(null);
                }}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Shipment for {selectedCustomer.name}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
