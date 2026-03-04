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

  private mapAuthPayloadToUser(data: Partial<LoginResponse>): User {
    if (!data.email) {
      throw new ApiError('Invalid auth response: missing email');
    }

    const userType = normalizeUserType(data.userType || data.user_type || data.type);
    return {
      id: data.id || data.email,
      email: data.email,
      username: data.username || data.name || data.email.split('@')[0],
      userType,
      roles: normalizeUserRoles(data.userType || data.user_type || data.roles || data.type),
      businessName: data.businessName || data.business_name,
    };
  }

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
    const response = await axiosInstance.post<string>('/auth/verify-email', {
      email,
      code
    });
    return { message: response.data };
  }

  /**
   * Resend verification code
   */
  async resendVerificationCode(email: string): Promise<{ message: string }> {
    const response = await axiosInstance.post<{ message?: string }>('/auth/resend-verification', {
      email
    });
    return { message: response.data?.message || 'Verification code sent successfully' };
  }

  /**
   * Request password reset code (logged out flow)
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await axiosInstance.post<string>('/auth/forgot-password', { email });
    return { message: response.data };
  }

  /**
   * Complete password reset with emailed code
   */
  async resetPassword(payload: {
    email: string;
    code: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<{ message: string }> {
    const response = await axiosInstance.post<string>('/auth/reset-password', payload);
    return { message: response.data };
  }

  /**
   * Login user - uses login response data directly
   */
  async login(email: string, password: string): Promise<{ user: User }> {
    const loginRequest: LoginRequest = { email, password };
    const response = await axiosInstance.post<LoginResponse>('/auth/login', loginRequest);
    const user = this.mapAuthPayloadToUser(response.data);

    this.storeUserData(user);
    return { user };
  }

  /**
   * Fetch authenticated user from backend cookie session.
   */
  async getMe(): Promise<User> {
    const response = await axiosInstance.get<Partial<LoginResponse>>('/auth/me');
    const user = this.mapAuthPayloadToUser(response.data);
    this.storeUserData(user);
    return user;
  }

  /**
   * Validate that backend still considers this browser authenticated.
   */
  async validateSession(): Promise<boolean> {
    try {
      await this.getMe();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Store user data (no token needed with HTTP-only cookies)
   */
  storeUserData(user: User): void {
    try {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to store user data:', error);
    }
  }

  /**
   * Get current user from backend session, fallback to cache if valid session cannot be verified.
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      return await this.getMe();
    } catch {
      this.clearStoredData();
      return null;
    }
  }

  /**
   * Check if user is authenticated by checking backend session
   */
  async isAuthenticated(): Promise<boolean> {
    return (await this.getCurrentUser()) !== null;
  }

  /**
   * Get cached user data from localStorage (for quick access)
   */
  getCachedUser(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (!userJson) return null;

    try {
      return JSON.parse(userJson) as User;
    } catch {
      this.clearStoredData(); // Clear invalid data
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
   * Logout user and clear server-side JWT cookie + local state
   */
  async logout(): Promise<void> {
    try {
      await axiosInstance.post('/auth/logout');
    } finally {
      this.clearStoredData();
    }
  }
}

export const authService = new AuthService();
