export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string | null; // HTTP-only cookie auth - may be null
  email: string;
  userType?: string;
  user_type?: string; // Alternative field name
  type?: string; // Another alternative field name
  expiresIn: string;
  // Optional fields that may be present
  id?: string;
  username?: string;
  name?: string;
  businessName?: string;
  business_name?: string; // Alternative field name
  roles?: string[];
}

export interface User {
  id: string;
  email: string;
  username: string;
  userType: 'MERCHANT' | 'ADMIN';
  roles?: string[];
  businessName?: string;
}