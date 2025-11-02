import { axiosInstance } from './api/axiosConfig';
import { ApiError } from '../types/api';

export interface PaymentProvider {
  id: string;
  name: string;
  type: 'STRIPE' | 'PAYSTACK' | 'FLUTTERWAVE';
  config: Record<string, any>;
  enabled: boolean;
  priority: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProviderRequest {
  name: string;
  type: string;
  configuration: Record<string, any>;
  supportedCurrencies?: string[];
  supportedCountries?: string[];
  fees?: {
    percentage: number;
    fixed: number;
    currency: string;
  };
}

export interface UpdateProviderRequest {
  name?: string;
  configuration?: Record<string, any>;
  isEnabled?: boolean;
  priority?: number;
}

export interface ProviderTestRequest {
  amount: number;
  currency: string;
}

export interface ProviderTestResponse {
  success: boolean;
  message: string;
  transactionId?: string;
}

class ProviderService {
  /**
   * Get all payment providers for the merchant
   */
  async getProviders(): Promise<PaymentProvider[]> {
    const response = await axiosInstance.get<PaymentProvider[]>('/payment-providers');
    return response.data;
  }

  /**
   * Get provider by ID
   */
  async getProvider(providerId: string): Promise<PaymentProvider> {
    const response = await axiosInstance.get<PaymentProvider>(`/payment-providers/${providerId}`);
    return response.data;
  }

  /**
   * Create a new payment provider
   */
  async createProvider(providerData: CreateProviderRequest): Promise<PaymentProvider> {
    try {
      const response = await axiosInstance.post<PaymentProvider>('/payment-providers', providerData);
      return response.data;
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError('Failed to create provider');
    }
  }

  /**
   * Update payment provider
   */
  async updateProvider(providerId: string, providerData: UpdateProviderRequest): Promise<PaymentProvider> {
    const response = await axiosInstance.put<PaymentProvider>(`/payment-providers/${providerId}`, providerData);
    return response.data;
  }

  /**
   * Delete payment provider
   */
  async deleteProvider(providerId: string): Promise<void> {
    await axiosInstance.delete(`/payment-providers/${providerId}`);
  }

  /**
   * Enable/disable payment provider
   */
  async toggleProvider(providerId: string, enabled: boolean): Promise<PaymentProvider> {
    const response = await axiosInstance.patch<PaymentProvider>(`/payment-providers/${providerId}/toggle`, {
      enabled
    });
    return response.data;
  }

  /**
   * Test payment provider connection
   */
  async testProvider(providerId: string, testData: ProviderTestRequest): Promise<ProviderTestResponse> {
    const response = await axiosInstance.post<ProviderTestResponse>(`/payment-providers/${providerId}/test`, testData);
    return response.data;
  }

  /**
   * Get available provider types
   */
  async getAvailableProviderTypes(): Promise<string[]> {
    const response = await axiosInstance.get<string[]>('/payment-providers/types');
    return response.data;
  }

  /**
   * Get provider configuration template
   */
  async getProviderConfigTemplate(providerType: string): Promise<Record<string, any>> {
    const response = await axiosInstance.get(`/payment-providers/config-template/${providerType}`);
    return response.data;
  }
}

export const providerService = new ProviderService();