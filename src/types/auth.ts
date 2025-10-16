export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
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
}