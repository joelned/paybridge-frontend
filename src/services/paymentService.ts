import { axiosInstance } from './api/axiosConfig';
import { ApiError } from '../types/api';
import { generateIdempotencyKey, storeIdempotencyKey, getStoredKey, updateKeyStatus } from '../utils/idempotencyKey';

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  merchantId: string;
  providerId: string;
  customerEmail?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  externalTransactionId?: string;
  failureReason?: string;
}

export interface CreatePaymentRequest {
  amount: number;
  currency: string;
  providerId: string;
  customerEmail?: string;
  description?: string;
  callbackUrl?: string;
  idempotencyKey?: string;
}

export interface PaymentResponse {
  payment: Payment;
  paymentUrl?: string;
  idempotencyKey?: string;
}

export interface PaymentListResponse {
  payments: Payment[];
  totalCount: number;
  page: number;
  size: number;
}

export interface PaymentFilters {
  status?: string;
  providerId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  size?: number;
}

class PaymentService {
  /**
   * Create a new payment
   */
  async createPayment(paymentData: CreatePaymentRequest, reuseKey?: string): Promise<PaymentResponse> {
    try {
      const idempotencyKey = reuseKey || paymentData.idempotencyKey || generateIdempotencyKey();
      
      // Store key as pending
      storeIdempotencyKey(idempotencyKey, undefined, 'pending');
      
      const response = await axiosInstance.post<PaymentResponse>('/payments', paymentData, {
        headers: {
          'Idempotency-Key': idempotencyKey
        }
      });
      
      // Update key with payment result
      if (response.data.payment?.id) {
        updateKeyStatus(idempotencyKey, response.data.payment.id, 'completed');
      }
      
      return { ...response.data, idempotencyKey };
    } catch (error) {
      if (error instanceof ApiError && paymentData.idempotencyKey) {
        updateKeyStatus(paymentData.idempotencyKey, '', 'failed');
      }
      throw error instanceof ApiError ? error : new ApiError('Failed to create payment');
    }
  }

  /**
   * Get payment by ID
   */
  async getPayment(paymentId: string): Promise<Payment> {
    const response = await axiosInstance.get<Payment>(`/payments/${paymentId}`);
    return response.data;
  }

  /**
   * Get payments list with filters
   */
  async getPayments(filters: PaymentFilters = {}): Promise<PaymentListResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    const response = await axiosInstance.get<PaymentListResponse>(`/payments?${params}`);
    return response.data;
  }

  /**
   * Cancel a payment
   */
  async cancelPayment(paymentId: string): Promise<Payment> {
    const response = await axiosInstance.post<Payment>(`/payments/${paymentId}/cancel`);
    return response.data;
  }

  /**
   * Refund a payment
   */
  async refundPayment(paymentId: string, amount?: number): Promise<Payment> {
    const response = await axiosInstance.post<Payment>(`/payments/${paymentId}/refund`, {
      amount
    });
    return response.data;
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(paymentId: string): Promise<{ status: string; updatedAt: string }> {
    const response = await axiosInstance.get(`/payments/${paymentId}/status`);
    return response.data;
  }
}

export const paymentService = new PaymentService();