import axios from 'axios';
import { env } from '../../config/env';
import { handleApiError } from '../../utils/errorHandler';
import type { ApiResponse } from '../../types/api';

let onAuthError: (() => void) | null = null;
let isLoggingOut = false;

export const setAuthErrorHandler = (authErrorHandler: () => void) => {
  onAuthError = () => {
    // Prevent multiple simultaneous logout calls
    if (!isLoggingOut) {
      isLoggingOut = true;
      authErrorHandler();
      // Reset flag after a delay
      setTimeout(() => {
        isLoggingOut = false;
      }, 1000);
    }
  };
};

export const axiosInstance = axios.create({
  baseURL: env.apiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Essential for HTTP-only cookies
});

// Request interceptor - add CSRF token and handle AbortController
axiosInstance.interceptors.request.use(
  (config) => {
    // Add CSRF token from meta tag if available
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
    
    // Ensure signal is properly handled
    if (config.signal?.aborted) {
      throw new Error('Request was aborted');
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors and transform responses
axiosInstance.interceptors.response.use(
  (response) => {
    // Transform successful responses to extract data
    const apiResponse = response.data as ApiResponse;
    if (apiResponse && typeof apiResponse === 'object' && 'success' in apiResponse) {
      response.data = apiResponse.data;
    }
    return response;
  },
  (error) => {
    // Handle authentication errors globally
    if (error.response?.status === 401 && onAuthError && !error.config?.url?.includes('/auth/login')) {
      // Only trigger auth error for non-login requests
      setTimeout(() => {
        onAuthError?.();
      }, 100);
    }
    
    // Transform error to ApiError
    const apiError = handleApiError(error);
    return Promise.reject(apiError);
  }
);

// Reset logout flag when needed
export const resetLogoutFlag = () => {
  isLoggingOut = false;
};