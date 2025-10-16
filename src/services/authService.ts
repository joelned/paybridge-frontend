// src/services/authService.ts
import { axiosInstance } from './api/axiosConfig';
import type { LoginRequest, LoginResponse, User } from '../types/auth';

interface RegisterRequest {
  businessName: string;
  email: string;
  password: string;
  businessType: string;
  businessCountry: string;
  websiteUrl?: string;
}

interface RegisterResponse {
  message: string;
  user?: User;
  token?: string;
}

class AuthService {
  private readonly AUTH_TOKEN_KEY = 'authToken';
  private readonly USER_KEY = 'user';

  /**
   * Register new user
   */
  async register(registerData: RegisterRequest): Promise<RegisterResponse> {
    const response = await axiosInstance.post<RegisterResponse>('/merchants', registerData);
    const data = response.data;

    // Don't store token yet - user needs to verify email first
    return data;
  }

  /**
   * Verify email with code
   */
  async verifyEmail(email: string, code: string): Promise<{ message: string }> {
    const response = await axiosInstance.post('/auth/verify-email', { 
      email, 
      code 
    });
    return response.data;
  }

  /**
   * Resend verification code
   */
  async resendVerificationCode(email: string): Promise<{ message: string }> {
    const response = await axiosInstance.post('/auth/resend-verification', { 
      email 
    });
    return response.data;
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const loginRequest: LoginRequest = { email, password };

    const response = await axiosInstance.post<LoginResponse>('/auth/login', loginRequest);
    const data = response.data;

    // Store token
    localStorage.setItem(this.AUTH_TOKEN_KEY, data.token);

    // Parse JWT to extract user info
    const user = this.parseJwtToken(data.token);
    
    // Store user data
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));

    return { user, token: data.token };
  }

  /**
   * Parse JWT token to extract user information
   */
  private parseJwtToken(token: string): User {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      const roles = payload.scope ? payload.scope.split(' ') : [];
      const userType = roles.includes('ADMIN') ? 'ADMIN' : 'MERCHANT';

      return {
        id: payload.sub || payload.userId || '1',
        email: payload.sub || '',
        username: payload.sub ? payload.sub.split('@')[0] : '',
        userType,
        roles
      };
    } catch (error) {
      throw new Error('Invalid token format');
    }
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (!userJson) return null;

    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }

  /**
   * Get auth token
   */
  getToken(): string | null {
    return localStorage.getItem(this.AUTH_TOKEN_KEY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      return Date.now() < expirationTime;
    } catch {
      return false;
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}

export const authService = new AuthService();