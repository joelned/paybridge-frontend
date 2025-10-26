export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string; // Optional since backend sends null
  email: string;
  userType: string;
  expiresIn: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  userType: 'MERCHANT' | 'ADMIN';
  roles?: string[];
  businessName?: string;
}