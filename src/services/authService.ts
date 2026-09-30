import { UserAccount, RegisterFormData, LoginFormData, FormValidationErrors } from '../types/auth';
import { Address, CustomerProfile } from '../types/ecommerce';

const USERS_STORAGE_KEY = 'swiftcart_users_db';
const CURRENT_USER_STORAGE_KEY = 'swiftcart_current_user';
const SALT = 'swiftcart_secure_salt_v1_2026';

/**
 * Computes a salted SHA-256 cryptographic hash of a password using Web Crypto API.
 * Passwords are NEVER stored as plain text.
 */
export async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(`${SALT}:${password.trim()}:${SALT}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Initial pre-seeded user matching application context
const SEED_USER_RAW_PASSWORD = 'Password@123';
const SEED_USER_ID = 'usr-yash-01';

/**
 * Initializes default user account in storage if absent.
 */
export async function initializeAuthStore(): Promise<UserAccount[]> {
  const saved = localStorage.getItem(USERS_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // Fallback to initialize
    }
  }

  const defaultHash = await hashPassword(SEED_USER_RAW_PASSWORD);
  const defaultUser: UserAccount = {
    userId: SEED_USER_ID,
    fullName: 'Yash Pandey',
    email: 'pandeyyyash2025@gmail.com',
    mobile: '9829014820',
    passwordHash: defaultHash,
    address: 'Flat 402, Royal Palms Heights, VT Road, Mansarovar',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302020',
    createdAt: new Date().toISOString(),
    latitude: 26.8524,
    longitude: 75.7685,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
    membershipTier: 'Prime Member',
  };

  const initialList = [defaultUser];
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialList));

  // Also pre-authenticate if no user is currently signed in
  if (!localStorage.getItem(CURRENT_USER_STORAGE_KEY)) {
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(defaultUser));
  }

  return initialList;
}

export function getAllUsers(): UserAccount[] {
  try {
    const saved = localStorage.getItem(USERS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function getCurrentUser(): UserAccount | null {
  try {
    const saved = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (!saved) return null;
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: UserAccount | null): void {
  if (user) {
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  }
}

/**
 * Validates registration form inputs according to requirements:
 * - Full Name must not be empty (min 2 chars)
 * - Email must have a valid email format
 * - Mobile number must contain a valid number of digits (10 digits)
 * - Password must have minimum 8 characters
 * - Confirm Password must match Password
 * - Address, City, State and Pincode are required for delivery
 */
export function validateRegisterForm(data: RegisterFormData): FormValidationErrors {
  const errors: FormValidationErrors = {};

  // Full Name
  const trimmedName = (data.fullName || '').trim();
  if (!trimmedName) {
    errors.fullName = 'Full Name is required.';
  } else if (trimmedName.length < 2) {
    errors.fullName = 'Full Name must be at least 2 characters.';
  }

  // Email
  const trimmedEmail = (data.email || '').trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!trimmedEmail) {
    errors.email = 'Email Address is required.';
  } else if (!emailRegex.test(trimmedEmail)) {
    errors.email = 'Please enter a valid email address (e.g. name@example.com).';
  }

  // Mobile Number (strip any spaces, dashes, +91)
  const cleanMobile = (data.mobile || '').replace(/[\s\-+]/g, '').replace(/^91/, '');
  const mobileRegex = /^[6-9]\d{9}$/;
  if (!data.mobile || !data.mobile.trim()) {
    errors.mobile = 'Mobile number is required.';
  } else if (!mobileRegex.test(cleanMobile) && cleanMobile.length !== 10) {
    errors.mobile = 'Please enter a valid 10-digit mobile number.';
  }

  // Password
  if (!data.password) {
    errors.password = 'Password is required.';
  } else if (data.password.length < 8) {
    errors.password = 'Password must be at least 8 characters long.';
  }

  // Confirm Password
  if (!data.confirmPassword) {
    errors.confirmPassword = 'Confirm Password is required.';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  // Address
  if (!data.address || !data.address.trim()) {
    errors.address = 'Complete delivery address is required.';
  } else if (data.address.trim().length < 5) {
    errors.address = 'Please provide a complete street address.';
  }

  // City
  if (!data.city || !data.city.trim()) {
    errors.city = 'City is required for delivery.';
  }

  // State
  if (!data.state || !data.state.trim()) {
    errors.state = 'State is required for delivery.';
  }

  // Pincode / ZIP Code
  const cleanPincode = (data.pincode || '').trim();
  if (!cleanPincode) {
    errors.pincode = 'Pincode / ZIP code is required.';
  } else if (!/^\d{6}$/.test(cleanPincode) && !/^[A-Za-z0-9\- ]{3,10}$/.test(cleanPincode)) {
    errors.pincode = 'Please enter a valid 6-digit Pincode (e.g. 302020).';
  }

  return errors;
}

/**
 * Validates login inputs.
 */
export function validateLoginForm(data: LoginFormData): FormValidationErrors {
  const errors: FormValidationErrors = {};

  if (!data.identifier || !data.identifier.trim()) {
    errors.identifier = 'Email or Mobile Number is required.';
  }

  if (!data.password) {
    errors.password = 'Password is required.';
  }

  return errors;
}

/**
 * Register a new user account with cryptographic password hashing
 * and persistent storage.
 */
export async function registerUser(data: RegisterFormData): Promise<{
  success: boolean;
  user?: UserAccount;
  error?: string;
  fieldErrors?: FormValidationErrors;
}> {
  const errors = validateRegisterForm(data);
  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      error: 'Please fix the errors in the form before submitting.',
      fieldErrors: errors,
    };
  }

  const users = getAllUsers();
  const normalizedEmail = data.email.trim().toLowerCase();
  const cleanMobile = data.mobile.replace(/[\s\-+]/g, '').replace(/^91/, '');

  // Check uniqueness of email
  const emailExists = users.some(u => u.email.toLowerCase() === normalizedEmail);
  if (emailExists) {
    return {
      success: false,
      error: 'An account with this email address already exists. Please log in.',
      fieldErrors: { email: 'Email address already registered' },
    };
  }

  // Check uniqueness of mobile
  const mobileExists = users.some(u => u.mobile.replace(/[\s\-+]/g, '').replace(/^91/, '') === cleanMobile);
  if (mobileExists) {
    return {
      success: false,
      error: 'An account with this mobile number already exists. Please log in.',
      fieldErrors: { mobile: 'Mobile number already registered' },
    };
  }

  const passwordHash = await hashPassword(data.password);
  const userId = `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

  const newUser: UserAccount = {
    userId,
    fullName: data.fullName.trim(),
    email: normalizedEmail,
    mobile: cleanMobile,
    passwordHash,
    address: data.address.trim(),
    city: data.city.trim(),
    state: data.state.trim(),
    pincode: data.pincode.trim(),
    createdAt: new Date().toISOString(),
    latitude: data.latitude || 26.8524,
    longitude: data.longitude || 75.7685,
    membershipTier: 'Prime Member',
  };

  const updatedUsers = [...users, newUser];
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
  setCurrentUser(newUser);

  return {
    success: true,
    user: newUser,
  };
}

/**
 * Authenticates user via email or mobile and salted SHA-256 hash.
 */
export async function loginUser(data: LoginFormData): Promise<{
  success: boolean;
  user?: UserAccount;
  error?: string;
  fieldErrors?: FormValidationErrors;
}> {
  const errors = validateLoginForm(data);
  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      error: 'Please fill in all required credentials.',
      fieldErrors: errors,
    };
  }

  const users = getAllUsers();
  const inputId = data.identifier.trim().toLowerCase();
  const cleanInputMobile = inputId.replace(/[\s\-+]/g, '').replace(/^91/, '');

  const user = users.find(u => {
    const emailMatch = u.email.toLowerCase() === inputId;
    const mobileMatch = u.mobile.replace(/[\s\-+]/g, '').replace(/^91/, '') === cleanInputMobile;
    return emailMatch || mobileMatch;
  });

  if (!user) {
    return {
      success: false,
      error: 'No account found with this email or mobile number.',
      fieldErrors: { identifier: 'Account not found' },
    };
  }

  const inputHash = await hashPassword(data.password);
  if (user.passwordHash !== inputHash) {
    return {
      success: false,
      error: 'Invalid password. Please try again or use "Forgot Password?".',
      fieldErrors: { password: 'Incorrect password' },
    };
  }

  setCurrentUser(user);
  return {
    success: true,
    user,
  };
}

/**
 * Logout the current user session.
 */
export function logoutUser(): void {
  setCurrentUser(null);
}

/**
 * Update user account profile and sync with persistent storage.
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<Omit<UserAccount, 'userId' | 'passwordHash' | 'createdAt'>>
): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
  const users = getAllUsers();
  const index = users.findIndex(u => u.userId === userId);

  if (index === -1) {
    return { success: false, error: 'User not found in database.' };
  }

  const currentUser = users[index];
  const updatedUser: UserAccount = {
    ...currentUser,
    ...updates,
    fullName: updates.fullName !== undefined ? updates.fullName.trim() : currentUser.fullName,
    email: updates.email !== undefined ? updates.email.trim().toLowerCase() : currentUser.email,
    mobile: updates.mobile !== undefined ? updates.mobile.replace(/[\s\-+]/g, '').replace(/^91/, '') : currentUser.mobile,
    address: updates.address !== undefined ? updates.address.trim() : currentUser.address,
    city: updates.city !== undefined ? updates.city.trim() : currentUser.city,
    state: updates.state !== undefined ? updates.state.trim() : currentUser.state,
    pincode: updates.pincode !== undefined ? updates.pincode.trim() : currentUser.pincode,
  };

  users[index] = updatedUser;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

  const active = getCurrentUser();
  if (active && active.userId === userId) {
    setCurrentUser(updatedUser);
  }

  return {
    success: true,
    user: updatedUser,
  };
}

/**
 * Password reset utility for "Forgot Password?" flow.
 */
export async function resetPassword(
  identifier: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  if (!identifier || !identifier.trim()) {
    return { success: false, error: 'Email or Mobile is required.' };
  }

  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: 'New password must be at least 8 characters long.' };
  }

  const users = getAllUsers();
  const inputId = identifier.trim().toLowerCase();
  const cleanInputMobile = inputId.replace(/[\s\-+]/g, '').replace(/^91/, '');

  const index = users.findIndex(u => {
    return u.email.toLowerCase() === inputId || 
           u.mobile.replace(/[\s\-+]/g, '').replace(/^91/, '') === cleanInputMobile;
  });

  if (index === -1) {
    return { success: false, error: 'No account registered with this email or mobile.' };
  }

  const newHash = await hashPassword(newPassword);
  users[index].passwordHash = newHash;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

  return { success: true };
}

/**
 * Converts a UserAccount into an Address model for checkout and ordering.
 */
export function userToAddress(user: UserAccount, isDefault = true): Address {
  return {
    id: `addr-${user.userId}`,
    name: user.fullName,
    phone: user.mobile.startsWith('+91') ? user.mobile : `+91 ${user.mobile}`,
    street: user.address,
    city: user.city,
    state: user.state,
    pincode: user.pincode,
    country: 'India',
    type: 'Home',
    isDefault,
    latitude: user.latitude || 26.8524,
    longitude: user.longitude || 75.7685,
    formattedAddress: `${user.address}, ${user.city}, ${user.state} - ${user.pincode}`,
  };
}

/**
 * Converts a UserAccount into a CustomerProfile model.
 */
export function userToCustomerProfile(user: UserAccount, addresses: Address[] = []): CustomerProfile {
  const primaryAddr = userToAddress(user);
  const allAddrs = addresses.length > 0 ? addresses : [primaryAddr];

  return {
    id: user.userId,
    name: user.fullName,
    email: user.email,
    phone: user.mobile.startsWith('+91') ? user.mobile : `+91 ${user.mobile}`,
    avatar: user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.fullName)}`,
    addresses: allAddrs,
    membershipTier: user.membershipTier || 'Prime Member',
    joinedDate: new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    savedCardsCount: 2,
    totalOrdersCount: 4,
  };
}
