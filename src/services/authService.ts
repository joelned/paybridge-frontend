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
  async login(email: string, password: string): Promise<{ user: User }> {
    const loginRequest: LoginRequest = { email, password };

    const response = await axiosInstance.post<LoginResponse>('/auth/login', loginRequest);
    const data = response.data;

    // Create user from response data
    const userType = data.userType.replace('[ROLE_', '').replace(']', '') as 'MERCHANT' | 'ADMIN';
    const user: User = {
      id: data.email, // Using email as ID since token is not exposed
      email: data.email,
      username: data.email.split('@')[0],
      userType,
      roles: [userType]
    };

    return { user };
  }

  /**
   * Store auth data (only used in dev mode with fallback)
   */
  storeAuthData(token: string, user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
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
   * Check if user is authenticated by making a test request
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const response = await axiosInstance.get('/auth/me');
      return response.status === 200;
    } catch (error: any) {
      // Only return false for actual auth failures, not network errors
      if (error.response?.status === 401 || error.response?.status === 403) {
        return false;
      }
      // For network errors or other issues, assume still authenticated
      // This prevents logout on temporary network issues
      console.warn('Auth check failed due to network/server error:', error.message);
      return true;
    }
  }

  /**
   * Get current user data from backend
   */
  async getCurrentUserFromBackend(): Promise<User | null> {
    try {
      const response = await axiosInstance.get('/auth/me');
      const data = response.data;
      
      // Transform backend response to User format
      const userType = data.userType?.replace('[ROLE_', '').replace(']', '') as 'MERCHANT' | 'ADMIN' || 'MERCHANT';
      const user: User = {
        id: data.id || data.email,
        email: data.email,
        username: data.username || data.email.split('@')[0],
        userType,
        roles: [userType],
        businessName: data.businessName
      };
      
      // Store the updated user data
      this.storeAuthData('', user);
      return user;
    } catch (error) {
      console.error('Failed to get user from backend:', error);
      return null;
    }
  }

  /**
   * Clear stored authentication data
   */
  clearStoredData(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    this.clearStoredData();
  }
}

export const authService = new AuthService();