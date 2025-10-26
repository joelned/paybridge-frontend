import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

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
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});

// Response interceptor - handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only trigger auth error for actual authentication failures
    // Don't trigger on network errors or server errors
    if (error.response?.status === 401 && onAuthError) {
      // Add a small delay to prevent multiple rapid logout calls
      setTimeout(() => {
        onAuthError();
      }, 100);
    }
    return Promise.reject(error);
  }
);