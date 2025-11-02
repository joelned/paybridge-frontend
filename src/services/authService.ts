// src/services/authService.ts
import { axiosInstance } from './api/axiosConfig';
import type { LoginRequest, LoginResponse, User } from '../types/auth';
import { normalizeUserType, normalizeUserRoles } from '../utils/helpers';
import { ApiError } from '../types/api';

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
    try {
      const loginRequest: LoginRequest = { email, password };

      const response = await axiosInstance.post<LoginResponse>('/auth/login', loginRequest);
      const data = response.data;

      // Create user from response data
      const userType = normalizeUserType(data.userType);
      const user: User = {
        id: data.email, // Using email as ID since token is not exposed
        email: data.email,
        username: data.email.split('@')[0],
        userType,
        roles: normalizeUserRoles(data.userType)
      };

      return { user };
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError('Login failed');
    }
  }

  /**
   * Store user data (no token needed with HTTP-only cookies)
   */
  storeUserData(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }



  /**
   * Get current user from backend using HTTP-only cookie
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await axiosInstance.get('/auth/me');
      const data = response.data;
      
      // Transform backend response to User format
      const userType = normalizeUserType(data.userType);
      const user: User = {
        id: data.id || data.email,
        email: data.email,
        username: data.username || data.email.split('@')[0],
        userType,
        roles: normalizeUserRoles(data.userType || data.roles),
        businessName: data.businessName
      };
      
      // Store user data locally for quick access
      this.storeUserData(user);
      return user;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }



  /**
   * Check if user is authenticated using HTTP-only cookie
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const response = await axiosInstance.get('/auth/me');
      return response.status === 200;
    } catch (error: any) {
      // Only return false for actual auth failures
      if (error.response?.status === 401 || error.response?.status === 403) {
        this.clearStoredData(); // Clear cached user data on auth failure
        return false;
      }
      // For network errors, don't clear data but return false
      console.warn('Auth check failed due to network/server error:', error.message);
      return false;
    }
  }

  /**
   * Get cached user data from localStorage (for quick access)
   */
  getCachedUser(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (!userJson) return null;

    try {
      return JSON.parse(userJson);
    } catch {
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