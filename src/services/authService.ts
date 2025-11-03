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
  private authCheckInProgress = false;

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
   * Login user - uses login response data directly
   */
  async login(email: string, password: string): Promise<{ user: User }> {
    try {
      const loginRequest: LoginRequest = { email, password };
      const response = await axiosInstance.post<LoginResponse>('/auth/login', loginRequest);
      const data = response.data;

      // Validate required fields
      if (!data.email) {
        throw new ApiError('Invalid login response: missing email');
      }

      // Create user from login response with field name variations
      const userType = normalizeUserType(data.userType || data.user_type || data.type);
      const user: User = {
        id: data.id || data.email,
        email: data.email,
        username: data.username || data.name || data.email.split('@')[0],
        userType,
        roles: normalizeUserRoles(data.userType || data.user_type || data.roles || data.type),
        businessName: data.businessName || data.business_name
      };

      // Store user data locally
      this.storeUserData(user);
      return { user };
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Handle axios errors
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'Login failed';
        throw new ApiError(message, error.response.data?.errors, undefined, status);
      }
      
      throw new ApiError('Login failed: Network error');
    }
  }

  /**
   * Store user data (no token needed with HTTP-only cookies)
   */
  storeUserData(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Get current user from local storage (no backend call)
   */
  async getCurrentUser(): Promise<User | null> {
    return this.getCachedUser();
  }

  /**
   * Check if user is authenticated by checking cached user data
   */
  async isAuthenticated(): Promise<boolean> {
    const cachedUser = this.getCachedUser();
    return cachedUser !== null;
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
   * Logout user - clears local data and optionally calls backend
   */
  async logout(): Promise<void> {
    try {
      // Try to call backend logout if endpoint exists
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      // Ignore logout endpoint errors - may not exist
      console.warn('Backend logout call failed (endpoint may not exist):', error);
    } finally {
      // Always clear local data
      this.clearStoredData();
      this.authCheckInProgress = false;
    }
  }
}

export const authService = new AuthService();