export type ProductCategory = 
  | 'Electronics'
  | 'Mobiles'
  | 'Fashion'
  | 'Home & Kitchen'
  | 'Beauty & Care'
  | 'Grocery'
  | 'Sports & Fitness'
  | 'Books'
  | 'Accessories'
  | 'Audio';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  description: string;
  price: number; // in ₹ INR
  originalPrice: number;
  discountPercent: number;
  rating: number; // 1 to 5
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  images: string[];
  thumbnail: string;
  badge?: 'Best Seller' | 'Trending' | 'Deal of the Day' | 'Fast Delivery' | 'Limited Deal';
  deliveryEstimate: string; // e.g. "FREE Delivery Tomorrow"
  fastDeliveryHours?: number; // e.g. 24 for tomorrow
  specifications: Record<string, string>;
  features: string[];
  warranty?: string;
  boxContents?: string[];
  weightKg?: number;
  isWishlisted?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  type: 'Home' | 'Office' | 'Other';
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
  placeId?: string;
  formattedAddress?: string;
}

export interface DeliveryOption {
  id: 'standard' | 'express' | 'scheduled';
  title: string;
  description: string;
  estimatedTime: string;
  price: number;
  badge?: string;
}

export type PaymentType = 'upi' | 'card' | 'netbanking' | 'cod';

export interface PaymentDetails {
  method: PaymentType;
  upiId?: string;
  cardNumber?: string;
  cardName?: string;
  bankName?: string;
}

export type OrderStatus = 
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'hub_arrival'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderTimelineStep {
  status: OrderStatus | string;
  title?: string;
  description?: string;
  detail?: string;
  timestamp?: string;
  time?: string;
  completed: boolean;
  active?: boolean;
  location?: string;
}

export interface OrderCourier {
  name: string;
  phone: string;
  rating: number;
  vehicleModel: string;
  vehicleNumber: string;
  vehicleType: 'Electric Van' | 'Delivery Van' | 'Motorbike' | 'Cargo Truck';
  photoUrl: string;
}

export interface CustomerOrder {
  id: string; // e.g. "SC-102849"
  userId?: string; // ID of the registered user who placed this order
  trackingNumber?: string; // e.g. "SWIFT-9482-IND"
  createdAt?: string;
  date?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  address: Address;
  deliveryOption: DeliveryOption;
  paymentDetails: PaymentDetails;
  status: OrderStatus | string;
  timeline: OrderTimelineStep[];
  expectedDelivery?: string;
  estimatedDelivery?: string;
  courier?: OrderCourier;
  deliveryPartner?: {
    id?: string;
    name: string;
    phone: string;
    rating: number;
    vehicle: string;
    vehicleNumber: string;
    photo: string;
  };
  deliveryOtp: string; // 4-digit security code for delivery
  currentLocation?: {
    lat: number;
    lng: number;
    description: string;
    distanceRemainingKm: number;
    etaMinutes: number;
  };
  optimizedRouteInfo?: {
    hubName: string;
    distanceKm: number;
    savingsMinutes: number;
    routeEfficiency: string;
  };
}

export interface CustomerNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'order' | 'delivery' | 'offer' | 'security';
  orderId?: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  addresses: Address[];
  membershipTier: 'Prime Member' | 'Standard';
  joinedDate: string;
  savedCardsCount: number;
  totalOrdersCount: number;
}

export type ActiveView = 
  | 'home'
  | 'dashboard'
  | 'products'
  | 'product-details'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'order-tracking'
  | 'orders'
  | 'previous-orders'
  | 'wishlist'
  | 'profile'
  | 'addresses'
  | 'login'
  | 'register'
  | 'admin-operations';
