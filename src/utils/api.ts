// src/utils/api.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Request cache for deduplication
const requestCache = new Map<string, Promise<any>>();
const responseCache = new Map<string, { data: any; timestamp: number }>();

// Cache duration in milliseconds
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class ApiService {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  private getCacheKey(method: string, url: string, params?: any): string {
    return `${method}:${url}:${JSON.stringify(params || {})}`;
  }

  private isValidCache(timestamp: number): boolean {
    return Date.now() - timestamp < CACHE_DURATION;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const cacheKey = this.getCacheKey('GET', url, config?.params);
    
    // Check response cache first
    const cached = responseCache.get(cacheKey);
    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data;
    }

    // Check if request is already in flight
    if (requestCache.has(cacheKey)) {
      return requestCache.get(cacheKey);
    }

    // Make new request
    const request = this.instance.get<T>(url, config).then((response) => {
      // Cache the response
      responseCache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
      
      // Remove from request cache
      requestCache.delete(cacheKey);
      
      return response.data;
    }).catch((error) => {
      requestCache.delete(cacheKey);
      throw error;
    });

    requestCache.set(cacheKey, request);
    return request;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    // Invalidate related GET caches
    this.invalidateCache(url);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    this.invalidateCache(url);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    this.invalidateCache(url);
    return response.data;
  }

  private invalidateCache(url: string) {
    // Remove related cached responses
    for (const [key] of responseCache) {
      if (key.includes(url)) {
        responseCache.delete(key);
      }
    }
  }

  clearCache() {
    requestCache.clear();
    responseCache.clear();
  }
}

export const apiService = new ApiService();