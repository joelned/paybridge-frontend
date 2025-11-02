import axios from 'axios';
import { env } from '../../config/env';
import { handleApiError } from '../../utils/errorHandler';
import type { ApiResponse } from '../../types/api';

let onAuthError: (() => void) | null = null;
let isLoggingOut = false;

export const setAuthInterceptors = (authErrorHandler: () => void) => {
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
  withCredentials: true, // Include cookies in requests
});

// Response interceptor - transform responses and handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Transform successful responses to extract data
    const apiResponse = response.data as ApiResponse;
    if (apiResponse && typeof apiResponse === 'object' && 'success' in apiResponse) {
      // Return the data field for successful responses
      response.data = apiResponse.data;
    }
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401 && onAuthError) {
      setTimeout(() => {
        onAuthError();
      }, 100);
    }
    
    // Transform error to ApiError
    const apiError = handleApiError(error);
    return Promise.reject(apiError);
  }
);