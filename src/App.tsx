import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/navbar/Navbar';
import { MobileBottomNav } from './components/navbar/MobileBottomNav';
import { SearchModal } from './components/navbar/SearchModal';
import { NotificationsDrawer } from './components/navbar/NotificationsDrawer';
import { HeroSection } from './components/home/HeroSection';
import { CategoryBar } from './components/home/CategoryBar';
import { DealsSection } from './components/home/DealsSection';
import { TrendingCarousel } from './components/home/TrendingCarousel';
import { FastDeliveryBanner } from './components/home/FastDeliveryBanner';
import { ProductListing } from './components/products/ProductListing';
import { ProductDetailsModal } from './components/products/ProductDetailsModal';
import { CartView } from './components/cart/CartView';
import { CheckoutView } from './components/checkout/CheckoutView';
import { OrderConfirmationView } from './components/orders/OrderConfirmationView';
import { OrderTrackingView } from './components/tracking/OrderTrackingView';
import { PreviousOrdersView } from './components/orders/PreviousOrdersView';
import { ProfileView } from './components/profile/ProfileView';
import { Footer } from './components/footer/Footer';
import { AddressPickerSheet } from './components/common/AddressPickerSheet';
import { CategoriesSheet } from './components/common/CategoriesSheet';

// Admin & Driver Portals
import { AdminPortal } from './components/admin/AdminPortal';
import { DriverPortal } from './components/driver/DriverPortal';
import { RoleSwitcherModal, UserRole } from './components/common/RoleSwitcherModal';
import { GoogleMapsWrapper, GoogleMapsKeyBanner } from './components/maps/GoogleMapsContext';

// DSA & Logistics Types & Data
import { 
  SAMPLE_PRODUCTS, 
  DEFAULT_ORDERS, 
  DEFAULT_PROFILE, 
  DEFAULT_ADDRESSES, 
  DEFAULT_NOTIFICATIONS 
} from './data/ecommerceData';
import { 
  DEFAULT_LOCATIONS, 
  DEFAULT_ROADS, 
  DEFAULT_VEHICLES, 
  DEFAULT_DRIVERS, 
  DEFAULT_CUSTOMERS, 
  DEFAULT_SHIPMENTS 
} from './data/defaultData';
import { 
  Product, 
  CartItem, 
  CustomerOrder, 
  CustomerProfile, 
  Address, 
  CustomerNotification, 
  ActiveView 
} from './types/ecommerce';
import { 
  Shipment, 
  DeliveryLocation, 
  Road, 
  Vehicle, 
  Driver, 
  Customer, 
  DeliveryStatus, 
  UndoAction 
} from './types';
import { WeightedGraph } from './dsa/Graph';
import { Stack } from './dsa/Stack';
import { optimizeDeliveryRoute } from './services/smartRouteEngine';

export function App() {
  // Active User Role
  const [userRole, setUserRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('swiftcart_user_role');
    return (saved === 'admin' || saved === 'driver') ? (saved as UserRole) : 'customer';
  });
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  // Navigation
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Drawers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddressSheetOpen, setIsAddressSheetOpen] = useState(false);
  const [isCategoriesSheetOpen, setIsCategoriesSheetOpen] = useState(false);

  // Dark Mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('swiftcart_dark') === 'true';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('swiftcart_dark', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('swiftcart_dark', 'false');
    }
  }, [isDarkMode]);

  // Toast message state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  const handleSwitchRole = (newRole: UserRole) => {
    setUserRole(newRole);
    localStorage.setItem('swiftcart_user_role', newRole);
    const label = newRole === 'customer' ? 'Customer Store' : newRole === 'admin' ? 'Admin Operations Hub' : 'Delivery Driver App';
    showToast(`Switched interface: ${label}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Logistics & Fleet State
  const [locations, setLocations] = useState<DeliveryLocation[]>(DEFAULT_LOCATIONS);
  const [roads, setRoads] = useState<Road[]>(DEFAULT_ROADS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(DEFAULT_VEHICLES);
  const [drivers, setDrivers] = useState<Driver[]>(DEFAULT_DRIVERS);
  const [customersList, setCustomersList] = useState<Customer[]>(DEFAULT_CUSTOMERS);
  
  const [shipments, setShipments] = useState<Shipment[]>(() => {
    const saved = localStorage.getItem('swiftcart_shipments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return DEFAULT_SHIPMENTS;
  });

  useEffect(() => {
    localStorage.setItem('swiftcart_shipments', JSON.stringify(shipments));
  }, [shipments]);

  // Graph representation of logistics network
  const graph = useMemo(() => {
    return new WeightedGraph(locations, roads);
  }, [locations, roads]);

  // Undo Stack (LIFO)
  const [undoStack] = useState<Stack<UndoAction>>(() => new Stack<UndoAction>(50));
  const [, setUndoTicker] = useState<number>(0);
  const triggerUndoUpdate = () => setUndoTicker(t => t + 1);

  // Products
  const [products] = useState<Product[]>(SAMPLE_PRODUCTS);

  // Cart
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('swiftcart_cart');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((item: any) => item && item.product && typeof item.quantity === 'number');
        }
      } catch (e) {
        // fallback
      }
    }
    // Seed initial cart with 1 popular item
    return [{ product: SAMPLE_PRODUCTS[0], quantity: 1 }];
  });

  useEffect(() => {
    localStorage.setItem('swiftcart_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Wishlist
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('swiftcart_wishlist');
    if (saved) {
      try {
        return new Set(JSON.parse(saved));
      } catch (e) {
        // fallback
      }
    }
    return new Set([SAMPLE_PRODUCTS[1].id, SAMPLE_PRODUCTS[4].id]);
  });

  useEffect(() => {
    localStorage.setItem('swiftcart_wishlist', JSON.stringify(Array.from(wishlistIds)));
  }, [wishlistIds]);

  // Orders
  const [orders, setOrders] = useState<CustomerOrder[]>(() => {
    const saved = localStorage.getItem('swiftcart_orders');
    return saved ? JSON.parse(saved) : DEFAULT_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('swiftcart_orders', JSON.stringify(orders));
  }, [orders]);

  // Customer Profile & Addresses
  const [profile, setProfile] = useState<CustomerProfile>(() => {
    const saved = localStorage.getItem('swiftcart_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem('swiftcart_addresses');
    return saved ? JSON.parse(saved) : DEFAULT_ADDRESSES;
  });

  const [selectedAddress, setSelectedAddress] = useState<Address>(() => {
    return addresses[0] || DEFAULT_ADDRESSES[0];
  });
  const [userPincode, setUserPincode] = useState<string>('302015');

  // Notifications
  const [notifications, setNotifications] = useState<CustomerNotification[]>(() => {
    const saved = localStorage.getItem('swiftcart_notifs');
    return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
  });

  // Active tracking order & newly placed order
  const [trackingOrderId, setTrackingOrderId] = useState<string>('SC-102849');
  const [lastPlacedOrder, setLastPlacedOrder] = useState<CustomerOrder | null>(null);

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added "${product.name.slice(0, 24)}..." to cart ✓`);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart');
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
        showToast('Removed from wishlist');
      } else {
        next.add(productId);
        showToast('Saved to wishlist ❤️');
      }
      return next;
    });
  };

  const handleBuyNow = (product: Product, quantity = 1) => {
    // Add product to cart if not present
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity } : item
        );
      }
      return [{ product, quantity }, ...prev];
    });
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Checkout and Order Placement
  const handlePlaceOrder = (orderData: Partial<CustomerOrder>) => {
    // Generate unique order ID
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const newOrderId = `SC-${randomSuffix}`;

    const newOrder: CustomerOrder = {
      id: newOrderId,
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      items: orderData.items || cartItems,
      subtotal: orderData.subtotal || 0,
      deliveryFee: orderData.deliveryFee || 0,
      discount: orderData.discount || 0,
      total: orderData.total || 0,
      status: 'Confirmed',
      estimatedDelivery: 'Tomorrow by 5:00 PM',
      address: orderData.address || addresses[0],
      deliveryOption: orderData.deliveryOption || {
        id: 'standard',
        title: 'FREE Standard Delivery',
        price: 0,
        estimatedTime: 'Tomorrow by 5:00 PM',
        description: 'Eco-routed dispatch',
      },
      paymentDetails: orderData.paymentDetails || { method: 'upi', upiId: 'user@okhdfc' },
      deliveryOtp: String(Math.floor(1000 + Math.random() * 9000)),
      deliveryPartner: {
        id: 'dp-102',
        name: 'Ramesh Kumar',
        phone: '+91 98291 55220',
        rating: 4.8,
        vehicle: 'Electric Delivery Van',
        vehicleNumber: 'RJ 14 EV 2049',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
      },
      timeline: [
        {
          status: 'Order Placed',
          time: 'Just now',
          completed: true,
          detail: 'Order received and verified via automated checkout engine',
        },
        {
          status: 'Order Confirmed',
          time: 'Just now',
          completed: true,
          detail: 'Assigned to Jaipur Central Fulfillment Hub for express packaging',
        },
        {
          status: 'Packed at Warehouse',
          time: 'Pending',
          completed: false,
          detail: 'Security seals applied and barcode scanned for sorting',
        },
        {
          status: 'Shipped from Hub',
          time: 'Pending',
          completed: false,
          detail: 'Handed to suburban transit corridor',
        },
        {
          status: 'Out for Delivery',
          time: 'Pending',
          completed: false,
          detail: 'Courier will verify 4-digit OTP at doorstep',
        },
        {
          status: 'Delivered',
          time: 'Pending',
          completed: false,
          detail: 'Package handed to recipient safely',
        },
      ],
    };

    // Calculate smart logistics path
    optimizeDeliveryRoute(newOrder);

    // Synchronize into Logistics / Fulfillment engine as a real tracked package
    const newShipment: Shipment = {
      id: newOrderId,
      trackingCode: newOrderId,
      customerName: newOrder.address?.name || profile.name,
      customerPhone: newOrder.address?.phone || profile.phone,
      recipient: newOrder.address?.name || profile.name,
      recipientPhone: newOrder.address?.phone || profile.phone,
      deliveryAddress: `${newOrder.address?.street || '124 Vaishali Nagar'}, ${newOrder.address?.city || 'Jaipur'}, PIN ${newOrder.address?.pincode || '302021'}`,
      originLocationId: 'loc-1', // Central Fulfillment Terminal
      destinationLocationId: 'loc-2', // Regional Hub
      weightKg: Number((newOrder.items.reduce((acc, i) => acc + (i.product.weightKg || 0.8) * i.quantity, 0)).toFixed(1)) || 2.4,
      priority: newOrder.deliveryOption?.id === 'express' ? 'urgent' : 'standard',
      urgencyScore: newOrder.deliveryOption?.id === 'express' ? 95 : 55,
      status: 'pending',
      driverId: 'D-101', // Rahul Kumar
      driverName: 'Rahul Kumar',
      vehicleId: 'V-101', // Tata Ace EV
      vehicleCode: 'RJ-14-AB-1024',
      declaredValue: newOrder.total,
      createdAt: Date.now(),
      statusLogs: [
        {
          id: 'log-' + Date.now(),
          status: 'pending',
          timestamp: Date.now(),
          location: 'Jaipur Central Fulfillment Hub',
          notes: `Customer order placed online via SwiftCart (Method: ${newOrder.paymentDetails.method.toUpperCase()})`,
          updatedBy: 'Order Processing Engine'
        }
      ]
    };
    setShipments((prev) => [newShipment, ...prev]);

    // Save order
    setOrders([newOrder, ...orders]);
    setLastPlacedOrder(newOrder);
    setTrackingOrderId(newOrderId);

    // Empty cart
    setCartItems([]);

    // Add confirmation notification
    const newNotif: CustomerNotification = {
      id: 'notif-' + Date.now(),
      title: `Order #${newOrderId} Confirmed!`,
      message: `Your shipment has entered the autonomous fulfillment corridor. Expected arrival tomorrow.`,
      timestamp: 'Just now',
      read: false,
      type: 'order',
      orderId: newOrderId,
    };
    setNotifications([newNotif, ...notifications]);

    // Navigate to confirmation
    setActiveView('order-confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Logistics Handlers
  const handleUpdateShipmentStatus = (shipmentId: string, newStatus: DeliveryStatus) => {
    const target = shipments.find((s) => s.id === shipmentId || s.trackingCode === shipmentId);
    if (!target) return;

    // Push to Undo Stack
    undoStack.push({
      type: 'UPDATE_STATUS',
      shipmentId: target.id,
      previousState: { ...target },
      description: `Status for #${target.trackingCode || target.id} changed to ${newStatus.replace('_', ' ')}`,
      timestamp: Date.now()
    });
    triggerUndoUpdate();

    // Update shipments
    setShipments((prev) =>
      prev.map((s) => {
        if (s.id === shipmentId || s.trackingCode === shipmentId) {
          const updatedLogs = [
            ...(s.statusLogs || []),
            {
              id: 'log-' + Date.now(),
              status: newStatus,
              timestamp: Date.now(),
              location: newStatus === 'delivered' ? s.deliveryAddress : 'Jaipur Transit Corridor',
              notes: `Status transitioned to ${newStatus.replace('_', ' ')}`,
              updatedBy: userRole === 'driver' ? 'Driver Rahul Kumar' : 'Dispatch Lead'
            }
          ];
          return { ...s, status: newStatus, statusLogs: updatedLogs };
        }
        return s;
      })
    );

    // Bidirectional sync to customer order status & timeline
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === shipmentId || order.trackingNumber === target.trackingCode || order.id === target.trackingCode) {
          let mappedCustomerStatus: CustomerOrder['status'] = 'Confirmed';
          if (newStatus === 'picked_up' || newStatus === 'in_transit') mappedCustomerStatus = 'Shipped';
          else if (newStatus === 'out_for_delivery') mappedCustomerStatus = 'Out for Delivery';
          else if (newStatus === 'delivered') mappedCustomerStatus = 'Delivered';
          else if (newStatus === 'cancelled') mappedCustomerStatus = 'Cancelled';

          const updatedTimeline = order.timeline.map((step) => {
            if (newStatus === 'picked_up' && step.status === 'Packed at Warehouse') return { ...step, completed: true, time: 'Just now' };
            if (newStatus === 'in_transit' && (step.status === 'Shipped from Hub' || step.status === 'Packed at Warehouse')) return { ...step, completed: true, time: 'Just now' };
            if (newStatus === 'out_for_delivery' && (step.status === 'Out for Delivery' || step.status === 'Shipped from Hub')) return { ...step, completed: true, time: 'Just now' };
            if (newStatus === 'delivered') return { ...step, completed: true, time: 'Just now' };
            return step;
          });

          return {
            ...order,
            status: mappedCustomerStatus,
            timeline: updatedTimeline
          };
        }
        return order;
      })
    );
  };

  const handleAssignDriver = (shipmentId: string, driverId: string) => {
    const target = shipments.find((s) => s.id === shipmentId);
    const driver = drivers.find((d) => d.id === driverId);
    if (!target || !driver) return;

    undoStack.push({
      type: 'ASSIGN_DRIVER',
      shipmentId: target.id,
      previousState: { ...target },
      description: `Reassign #${target.trackingCode} to ${driver.name}`,
      timestamp: Date.now()
    });
    triggerUndoUpdate();

    setShipments((prev) =>
      prev.map((s) => (s.id === shipmentId ? { ...s, driverId: driver.id, driverName: driver.name } : s))
    );
    showToast(`Driver ${driver.name} assigned to #${target.trackingCode || target.id}`);
  };

  const handleAssignVehicle = (shipmentId: string, vehicleId: string) => {
    const target = shipments.find((s) => s.id === shipmentId);
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (!target || !vehicle) return;

    if (vehicle.currentPayloadKg + target.weightKg > vehicle.maxCapacityKg) {
      showToast(`⚠️ Vehicle Overloaded! Max capacity: ${vehicle.maxCapacityKg}kg, currently at ${vehicle.currentPayloadKg}kg`);
      return;
    }

    undoStack.push({
      type: 'ASSIGN_VEHICLE',
      shipmentId: target.id,
      previousState: { ...target },
      description: `Assign #${target.trackingCode} to ${vehicle.name}`,
      timestamp: Date.now()
    });
    triggerUndoUpdate();

    setShipments((prev) =>
      prev.map((s) => (s.id === shipmentId ? { ...s, vehicleId: vehicle.id, vehicleCode: vehicle.plateNumber } : s))
    );
    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, currentPayloadKg: Number((v.currentPayloadKg + target.weightKg).toFixed(1)) } : v))
    );
    showToast(`Vehicle ${vehicle.plateNumber} assigned`);
  };

  const handleDeleteShipment = (shipmentId: string) => {
    const target = shipments.find((s) => s.id === shipmentId);
    if (!target) return;

    undoStack.push({
      type: 'DELETE_SHIPMENT',
      shipmentId: target.id,
      previousState: { ...target },
      description: `Deleted #${target.trackingCode || target.id}`,
      timestamp: Date.now()
    });
    triggerUndoUpdate();

    setShipments((prev) => prev.filter((s) => s.id !== shipmentId));
    showToast(`Deleted #${target.trackingCode || target.id} (Undo available)`);
  };

  const handleCreateShipment = (newShipmentData: Omit<Shipment, 'id' | 'createdAt' | 'statusLogs'>) => {
    const newId = `SC-${Math.floor(100000 + Math.random() * 900000)}`;
    const created: Shipment = {
      ...newShipmentData,
      id: newId,
      trackingCode: newShipmentData.trackingCode || newId,
      createdAt: Date.now(),
      statusLogs: [
        {
          id: 'log-' + Date.now(),
          status: newShipmentData.status,
          timestamp: Date.now(),
          location: 'Central Logistics Terminal',
          notes: 'Shipment created manually by dispatch operator',
          updatedBy: 'Operations Dispatch'
        }
      ]
    };
    setShipments((prev) => [created, ...prev]);
  };

  const handleUndoLastAction = () => {
    if (undoStack.isEmpty()) {
      showToast('No actions to undo');
      return;
    }

    const action = undoStack.pop();
    triggerUndoUpdate();
    if (!action) return;

    if (action.type === 'UPDATE_STATUS' && action.previousState) {
      setShipments((prev) => prev.map((s) => (s.id === action.shipmentId ? { ...action.previousState } : s)));
      showToast(`Reverted status for #${action.previousState.trackingCode || action.shipmentId}`);
    } else if (action.type === 'ASSIGN_DRIVER' && action.previousState) {
      setShipments((prev) =>
        prev.map((s) =>
          s.id === action.shipmentId
            ? { ...s, driverId: action.previousState.driverId, driverName: action.previousState.driverName }
            : s
        )
      );
      showToast(`Reverted driver assignment`);
    } else if (action.type === 'DELETE_SHIPMENT' && action.previousState) {
      setShipments((prev) => [action.previousState, ...prev]);
      showToast(`Restored shipment #${action.previousState.trackingCode || action.shipmentId}`);
    } else if (action.type === 'ASSIGN_VEHICLE' && action.previousState) {
      setShipments((prev) =>
        prev.map((s) =>
          s.id === action.shipmentId
            ? { ...s, vehicleId: action.previousState.vehicleId, vehicleCode: action.previousState.vehicleCode }
            : s
        )
      );
      showToast(`Reverted vehicle assignment`);
    }
  };

  const handleAddLocation = (loc: Omit<DeliveryLocation, 'id'>) => {
    const newLoc: DeliveryLocation = {
      ...loc,
      id: `loc-${Date.now()}`
    };
    setLocations((prev) => [...prev, newLoc]);
    showToast(`Added location "${loc.name}"`);
  };

  const handleDeleteLocation = (id: string) => {
    setLocations((prev) => prev.filter((l) => l.id !== id));
    showToast('Location deleted');
  };

  const handleAddRoad = (road: Omit<Road, 'id'>) => {
    const newRoad: Road = {
      ...road,
      id: `road-${Date.now()}`
    };
    setRoads((prev) => [...prev, newRoad]);
    showToast('Corridor added');
  };

  const handleDeleteRoad = (roadId: string) => {
    setRoads((prev) => prev.filter((r) => r.id !== roadId));
    showToast('Corridor removed');
  };

  // Total cart quantity badge
  const cartCount = Array.isArray(cartItems) 
    ? cartItems.reduce((acc, item) => acc + (item?.quantity || 0), 0)
    : 0;

  // Wishlist products
  const wishlistProducts = products.filter((p) => wishlistIds.has(p.id));

  // IF ROLE IS ADMIN / OPERATIONS HUB
  if (userRole === 'admin' || activeView === 'admin-operations') {
    return (
      <GoogleMapsWrapper>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
          {toastMessage && (
            <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-900 dark:bg-blue-600 text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-750">
              <span>{toastMessage}</span>
            </div>
          )}

          <div className="max-w-7xl mx-auto px-4 pt-3">
            <GoogleMapsKeyBanner />
          </div>

          <AdminPortal
            shipments={shipments}
            locations={locations}
            roads={roads}
            vehicles={vehicles}
            drivers={drivers}
            customers={customersList}
            graph={graph}
            undoStack={undoStack}
            onUpdateShipmentStatus={handleUpdateShipmentStatus}
            onAssignDriver={handleAssignDriver}
            onAssignVehicleToShipment={handleAssignVehicle}
            onDeleteShipment={handleDeleteShipment}
            onCreateShipment={handleCreateShipment}
            onAddLocation={handleAddLocation}
            onDeleteLocation={handleDeleteLocation}
            onAddRoad={handleAddRoad}
            onDeleteRoad={handleDeleteRoad}
            onUndoLastAction={handleUndoLastAction}
            onSwitchRole={(role) => {
              if (activeView === 'admin-operations') setActiveView('home');
              handleSwitchRole(role);
            }}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            onShowToast={showToast}
          />

          <RoleSwitcherModal
            isOpen={isRoleModalOpen}
            onClose={() => setIsRoleModalOpen(false)}
            currentRole={userRole}
            onSelectRole={handleSwitchRole}
          />
        </div>
      </GoogleMapsWrapper>
    );
  }

  // IF ROLE IS DELIVERY DRIVER
  if (userRole === 'driver') {
    const activeDriver = drivers.find((d) => d.id === 'D-101') || drivers[0];
    const assignedVehicle = vehicles.find((v) => v.id === activeDriver?.assignedVehicleId || v.id === 'V-101') || vehicles[0];

    return (
      <GoogleMapsWrapper>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
          {toastMessage && (
            <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-900 dark:bg-emerald-600 text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-750">
              <span>{toastMessage}</span>
            </div>
          )}

          <div className="max-w-7xl mx-auto px-4 pt-3">
            <GoogleMapsKeyBanner />
          </div>

          <DriverPortal
            driver={activeDriver}
            vehicle={assignedVehicle}
            shipments={shipments}
            orders={orders}
            onUpdateShipmentStatus={handleUpdateShipmentStatus}
            onSwitchRole={handleSwitchRole}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            onShowToast={showToast}
          />

          <RoleSwitcherModal
            isOpen={isRoleModalOpen}
            onClose={() => setIsRoleModalOpen(false)}
            currentRole={userRole}
            onSelectRole={handleSwitchRole}
          />
        </div>
      </GoogleMapsWrapper>
    );
  }

  return (
    <GoogleMapsWrapper>
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 selection:bg-blue-600 selection:text-white">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-20 sm:bottom-6 right-6 z-50 px-4 py-3 bg-slate-900 dark:bg-blue-600 text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-5 border border-slate-750">
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Main Desktop & Tablet Header */}
        <Navbar
          activeView={activeView}
          setActiveView={(view) => {
            setActiveView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          cartItems={cartItems}
          cartCount={cartCount}
          wishlistCount={wishlistIds.size}
          notifications={notifications}
          unreadNotificationCount={notifications.filter((n) => !n.read).length}
          selectedAddress={selectedAddress}
          onOpenAddressPicker={() => setIsAddressSheetOpen(true)}
          onOpenCategoriesSheet={() => setIsCategoriesSheetOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          darkMode={isDarkMode}
          setDarkMode={setIsDarkMode}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          userPincode={userPincode}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setSearchQuery('');
            setActiveView('products');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSwitchRole={handleSwitchRole}
          onOpenRoleSwitcher={() => setIsRoleModalOpen(true)}
        />

        <div className="max-w-7xl mx-auto px-4 pt-2">
          <GoogleMapsKeyBanner />
        </div>

        {/* Main Dynamic View Content */}
        <main className="flex-1">
          
          {/* VIEW 1: HOME */}
          {activeView === 'home' && (
            <div className="space-y-0">
              <HeroSection
                setActiveView={setActiveView}
                onTrackOrderClick={(orderId) => {
                  if (orderId) setTrackingOrderId(orderId);
                  setActiveView('order-tracking');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />

              <CategoryBar
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  setSearchQuery('');
                  setActiveView('products');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />

              <DealsSection
                products={products}
                onSelectProduct={(p) => setSelectedProduct(p)}
                onAddToCart={(p) => handleAddToCart(p, 1)}
                onToggleWishlist={(id) => handleToggleWishlist(id)}
                wishlistIds={wishlistIds}
                onViewAllDeals={() => {
                  setSelectedCategory('All');
                  setActiveView('products');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />

              <TrendingCarousel
                products={products}
                onSelectProduct={(p) => setSelectedProduct(p)}
                onAddToCart={(p) => handleAddToCart(p, 1)}
                onToggleWishlist={(id) => handleToggleWishlist(id)}
                wishlistIds={wishlistIds}
              />

              <FastDeliveryBanner setActiveView={setActiveView} />
            </div>
          )}

        {/* VIEW 2: PRODUCTS CATALOG */}
        {activeView === 'products' && (
          <ProductListing
            products={products}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onToggleWishlist={(id) => handleToggleWishlist(id)}
            wishlistIds={wishlistIds}
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery('')}
          />
        )}

        {/* VIEW 3: CART */}
        {activeView === 'cart' && (
          <CartView
            cartItems={cartItems}
            selectedAddress={selectedAddress}
            onOpenAddressPicker={() => setIsAddressSheetOpen(true)}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onSaveForLater={(id) => {
              handleToggleWishlist(id);
              handleRemoveCartItem(id);
            }}
            onProceedToCheckout={() => {
              setActiveView('checkout');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            setActiveView={setActiveView}
          />
        )}

        {/* VIEW 4: CHECKOUT */}
        {activeView === 'checkout' && (
          <CheckoutView
            cartItems={cartItems}
            savedAddresses={addresses}
            onPlaceOrder={handlePlaceOrder}
            onBackToCart={() => setActiveView('cart')}
            setActiveView={setActiveView}
          />
        )}

        {/* VIEW 5: ORDER CONFIRMATION */}
        {activeView === 'order-confirmation' && lastPlacedOrder && (
          <OrderConfirmationView
            order={lastPlacedOrder}
            onTrackOrder={(id) => {
              setTrackingOrderId(id);
              setActiveView('order-tracking');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            setActiveView={setActiveView}
          />
        )}

        {/* VIEW 6: ORDER TRACKING */}
        {activeView === 'order-tracking' && (
          <OrderTrackingView
            orders={orders}
            selectedOrderId={trackingOrderId}
            onSelectOrder={(id) => setTrackingOrderId(id)}
            setActiveView={setActiveView}
          />
        )}

        {/* VIEW 7: PREVIOUS ORDERS */}
        {(activeView === 'previous-orders' || activeView === 'orders') && (
          <PreviousOrdersView
            orders={orders}
            onTrackOrder={(id) => {
              setTrackingOrderId(id);
              setActiveView('order-tracking');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBuyAgain={(p) => {
              handleAddToCart(p, 1);
              setActiveView('cart');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            setActiveView={setActiveView}
          />
        )}

        {/* VIEW 8: CUSTOMER PROFILE */}
        {(activeView === 'profile' || activeView === 'wishlist' || activeView === 'addresses') && (
          <ProfileView
            profile={profile}
            initialTab={activeView === 'wishlist' ? 'wishlist' : (activeView === 'addresses' ? 'addresses' : 'profile')}
            onUpdateProfile={(updated) => setProfile({ ...profile, ...updated })}
            savedAddresses={addresses}
            onAddAddress={(newAddr) => setAddresses([newAddr, ...addresses])}
            onDeleteAddress={(id) => setAddresses(addresses.filter((a) => a.id !== id))}
            wishlistProducts={wishlistProducts}
            onRemoveFromWishlist={(id) => handleToggleWishlist(id)}
            onSelectProduct={(p) => setSelectedProduct(p)}
            setActiveView={setActiveView}
          />
        )}

      </main>

      {/* Global Product Details Quick-View Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(product, qty) => {
            handleAddToCart(product, qty);
          }}
          onBuyNow={(product, qty) => {
            handleBuyNow(product, qty);
          }}
          onToggleWishlist={(id) => handleToggleWishlist(id)}
          isWishlisted={wishlistIds.has(selectedProduct.id)}
          userPincode={userPincode}
        />
      )}

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => {
          setSelectedProduct(p);
          setIsSearchOpen(false);
        }}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSearchQuery('');
          setActiveView('products');
          setIsSearchOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSearchSubmit={(q) => {
          setSearchQuery(q);
          setSelectedCategory('All');
          setActiveView('products');
          setIsSearchOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Global Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => {
          setNotifications(notifications.map((n) => ({ ...n, read: true })));
          showToast('All notifications marked as read');
        }}
        onSelectOrderToTrack={(orderId) => {
          setTrackingOrderId(orderId);
          setActiveView('order-tracking');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        setActiveView={setActiveView}
      />

      {/* Footer */}
      <Footer
        setActiveView={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSearchQuery('');
          setActiveView('products');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Mobile Bottom Fixed Navigation */}
      <MobileBottomNav
        activeView={activeView}
        setActiveView={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartItems={cartItems}
        cartCount={cartCount}
        onOpenCategories={() => setIsCategoriesSheetOpen(true)}
      />

      {/* Mobile Address Picker Sheet (Flipkart Mobile Style) */}
      <AddressPickerSheet
        isOpen={isAddressSheetOpen}
        onClose={() => setIsAddressSheetOpen(false)}
        addresses={addresses}
        selectedAddress={selectedAddress}
        onSelectAddress={(addr) => {
          setSelectedAddress(addr);
          setUserPincode(addr.pincode);
          showToast(`Delivering to ${addr.city} (${addr.pincode})`);
        }}
        onAddNewAddress={() => {
          setActiveView('addresses');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        userPincode={userPincode}
        onUpdatePincode={(pin) => {
          setUserPincode(pin);
          showToast(`Updated location pincode to ${pin}`);
        }}
      />

      {/* Mobile Categories Fullscreen / Bottom Sheet */}
      <CategoriesSheet
        isOpen={isCategoriesSheetOpen}
        onClose={() => setIsCategoriesSheetOpen(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSearchQuery('');
          setActiveView('products');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Role Switcher Modal */}
      <RoleSwitcherModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        currentRole={userRole}
        onSelectRole={handleSwitchRole}
      />

      </div>
    </GoogleMapsWrapper>
  );
}

export default App;
