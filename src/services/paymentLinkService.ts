import { axiosInstance } from './api/axiosConfig';
import { ApiError } from '../types/api';

export interface PaymentLink {
  id: string;
  title: string;
  description?: string;
  amount: number;
  currency: string;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  providerId: string;
  merchantId: string;
  url: string;
  shortUrl?: string;
  expiresAt?: string;
  maxUses?: number;
  currentUses: number;
  collectCustomerInfo: boolean;
  customFields?: {
    name: string;
    type: 'TEXT' | 'EMAIL' | 'NUMBER' | 'SELECT';
    required: boolean;
    options?: string[];
  }[];
  successUrl?: string;
  cancelUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentLinkRequest {
  title: string;
  description?: string;
  amount: number;
  currency: string;
  providerId: string;
  expiresAt?: string;
  maxUses?: number;
  collectCustomerInfo?: boolean;
  customFields?: PaymentLink['customFields'];
  successUrl?: string;
  cancelUrl?: string;
}

export interface UpdatePaymentLinkRequest extends Partial<CreatePaymentLinkRequest> {
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface PaymentLinkUsage {
  id: string;
  paymentLinkId: string;
  paymentId?: string;
  customerEmail?: string;
  customerData?: Record<string, any>;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  usedAt: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface PaymentLinkAnalytics {
  totalLinks: number;
  activeLinks: number;
  totalViews: number;
  totalPayments: number;
  totalAmount: number;
  conversionRate: number;
  topPerformingLinks: {
    id: string;
    title: string;
    views: number;
    payments: number;
    amount: number;
    conversionRate: number;
  }[];
}

export interface PaymentLinkFilters {
  status?: string;
  providerId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  size?: number;
}

export interface PaymentLinkListResponse {
  paymentLinks: PaymentLink[];
  totalCount: number;
  page: number;
  size: number;
}

class PaymentLinkService {
  /**
   * Get payment links with filters
   */
  async getPaymentLinks(filters: PaymentLinkFilters = {}): Promise<PaymentLinkListResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    const response = await axiosInstance.get<PaymentLinkListResponse>(`/payment-links?${params}`);
    return response.data;
  }

  /**
   * Get payment link by ID
   */
  async getPaymentLink(linkId: string): Promise<PaymentLink> {
    const response = await axiosInstance.get<PaymentLink>(`/payment-links/${linkId}`);
    return response.data;
  }

  /**
   * Create a new payment link
   */
  async createPaymentLink(linkData: CreatePaymentLinkRequest): Promise<PaymentLink> {
    try {
      const response = await axiosInstance.post<PaymentLink>('/payment-links', linkData);
      return response.data;
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError('Failed to create payment link');
    }
  }

  /**
   * Update payment link
   */
  async updatePaymentLink(linkId: string, linkData: UpdatePaymentLinkRequest): Promise<PaymentLink> {
    const response = await axiosInstance.put<PaymentLink>(`/payment-links/${linkId}`, linkData);
    return response.data;
  }

  /**
   * Delete payment link
   */
  async deletePaymentLink(linkId: string): Promise<void> {
    await axiosInstance.delete(`/payment-links/${linkId}`);
  }

  /**
   * Activate/deactivate payment link
   */
  async togglePaymentLink(linkId: string, active: boolean): Promise<PaymentLink> {
    const response = await axiosInstance.patch<PaymentLink>(`/payment-links/${linkId}/toggle`, {
      active
    });
    return response.data;
  }

  /**
   * Get payment link usage history
   */
  async getPaymentLinkUsage(linkId: string, page = 0, size = 20): Promise<{
    usage: PaymentLinkUsage[];
    totalCount: number;
    page: number;
    size: number;
  }> {
    const response = await axiosInstance.get(`/payment-links/${linkId}/usage?page=${page}&size=${size}`);
    return response.data;
  }

  /**
   * Get payment link analytics
   */
  async getPaymentLinkAnalytics(linkId?: string, dateFrom?: string, dateTo?: string): Promise<PaymentLinkAnalytics> {
    const params = new URLSearchParams();
    if (linkId) params.append('linkId', linkId);
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);

    const response = await axiosInstance.get<PaymentLinkAnalytics>(`/payment-links/analytics?${params}`);
    return response.data;
  }

  /**
   * Generate short URL for payment link
   */
  async generateShortUrl(linkId: string): Promise<{ shortUrl: string }> {
    const response = await axiosInstance.post(`/payment-links/${linkId}/short-url`);
    return response.data;
  }

  /**
   * Get QR code for payment link
   */
  async getQRCode(linkId: string, size = 256): Promise<Blob> {
    const response = await axiosInstance.get(`/payment-links/${linkId}/qr-code?size=${size}`, {
      responseType: 'blob'
    });
    return response.data;
  }

  /**
   * Duplicate payment link
   */
  async duplicatePaymentLink(linkId: string, title?: string): Promise<PaymentLink> {
    const response = await axiosInstance.post<PaymentLink>(`/payment-links/${linkId}/duplicate`, {
      title
    });
    return response.data;
  }

  /**
   * Preview payment link (get public view data)
   */
  async previewPaymentLink(linkId: string): Promise<{
    title: string;
    description?: string;
    amount: number;
    currency: string;
    merchantName: string;
    customFields?: PaymentLink['customFields'];
    isActive: boolean;
    isExpired: boolean;
  }> {
    const response = await axiosInstance.get(`/payment-links/${linkId}/preview`);
    return response.data;
  }

  /**
   * Export payment link data
   */
  async exportPaymentLinkData(filters: PaymentLinkFilters, format: 'CSV' | 'EXCEL' = 'CSV'): Promise<Blob> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    params.append('format', format);

    const response = await axiosInstance.get(`/payment-links/export?${params}`, {
      responseType: 'blob'
    });
    return response.data;
  }
}

export const paymentLinkService = new PaymentLinkService();