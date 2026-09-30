export interface UserAccount {
  userId: string;
  fullName: string;
  email: string;
  mobile: string;
  passwordHash: string; // Salted cryptographic hash (never plain text)
  address: string;      // Complete Delivery Address
  city: string;
  state: string;
  pincode: string;
  createdAt: string;
  latitude?: number;
  longitude?: number;
  avatar?: string;
  membershipTier?: 'Prime Member' | 'Standard';
}

export interface RegisterFormData {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
}

export interface LoginFormData {
  identifier: string; // email or mobile
  password: string;
  rememberMe?: boolean;
}

export interface FormValidationErrors {
  identifier?: string;
  fullName?: string;
  email?: string;
  mobile?: string;
  password?: string;
  confirmPassword?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  general?: string;
}
