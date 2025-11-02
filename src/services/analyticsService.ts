import { axiosInstance } from './api/axiosConfig';
import { ApiError } from '../types/api';

export interface AnalyticsMetrics {
  totalPayments: number;
  totalAmount: number;
  successfulPayments: number;
  failedPayments: number;
  successRate: number;
  averageTransactionValue: number;
  currency: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  count?: number;
}

export interface PaymentAnalytics {
  metrics: AnalyticsMetrics;
  paymentTrends: TimeSeriesData[];
  statusDistribution: {
    status: string;
    count: number;
    percentage: number;
  }[];
  providerPerformance: {
    providerId: string;
    providerName: string;
    totalPayments: number;
    successfulPayments: number;
    successRate: number;
    totalAmount: number;
  }[];
}

export interface RevenueAnalytics {
  totalRevenue: number;
  revenueGrowth: number;
  revenueTrends: TimeSeriesData[];
  revenueByProvider: {
    providerId: string;
    providerName: string;
    revenue: number;
    percentage: number;
  }[];
  monthlyRecurring: number;
}

export interface CustomerAnalytics {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  customerGrowth: number;
  topCustomers: {
    email: string;
    totalPayments: number;
    totalAmount: number;
    lastPaymentDate: string;
  }[];
}

export interface AnalyticsFilters {
  dateFrom?: string;
  dateTo?: string;
  providerId?: string;
  currency?: string;
  granularity?: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH';
}

export interface DashboardAnalytics {
  payments: PaymentAnalytics;
  revenue: RevenueAnalytics;
  customers: CustomerAnalytics;
  period: {
    from: string;
    to: string;
  };
}

class AnalyticsService {
  /**
   * Get dashboard analytics overview
   */
  async getDashboardAnalytics(filters: AnalyticsFilters = {}): Promise<DashboardAnalytics> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });

      const response = await axiosInstance.get<DashboardAnalytics>(`/analytics/dashboard?${params}`);
      return response.data;
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError('Failed to load analytics');
    }
  }

  /**
   * Get payment analytics
   */
  async getPaymentAnalytics(filters: AnalyticsFilters = {}): Promise<PaymentAnalytics> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    const response = await axiosInstance.get<PaymentAnalytics>(`/analytics/payments?${params}`);
    return response.data;
  }

  /**
   * Get revenue analytics
   */
  async getRevenueAnalytics(filters: AnalyticsFilters = {}): Promise<RevenueAnalytics> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    const response = await axiosInstance.get<RevenueAnalytics>(`/analytics/revenue?${params}`);
    return response.data;
  }

  /**
   * Get customer analytics
   */
  async getCustomerAnalytics(filters: AnalyticsFilters = {}): Promise<CustomerAnalytics> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    const response = await axiosInstance.get<CustomerAnalytics>(`/analytics/customers?${params}`);
    return response.data;
  }

  /**
   * Get payment trends over time
   */
  async getPaymentTrends(filters: AnalyticsFilters = {}): Promise<TimeSeriesData[]> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    const response = await axiosInstance.get<TimeSeriesData[]>(`/analytics/trends/payments?${params}`);
    return response.data;
  }

  /**
   * Get revenue trends over time
   */
  async getRevenueTrends(filters: AnalyticsFilters = {}): Promise<TimeSeriesData[]> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    const response = await axiosInstance.get<TimeSeriesData[]>(`/analytics/trends/revenue?${params}`);
    return response.data;
  }

  /**
   * Get provider performance comparison
   */
  async getProviderPerformance(filters: AnalyticsFilters = {}): Promise<PaymentAnalytics['providerPerformance']> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    const response = await axiosInstance.get(`/analytics/providers/performance?${params}`);
    return response.data;
  }

  /**
   * Export analytics data
   */
  async exportAnalyticsData(
    type: 'payments' | 'revenue' | 'customers',
    filters: AnalyticsFilters = {},
    format: 'CSV' | 'EXCEL' = 'CSV'
  ): Promise<Blob> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    params.append('format', format);

    const response = await axiosInstance.get(`/analytics/export/${type}?${params}`, {
      responseType: 'blob'
    });
    return response.data;
  }

  /**
   * Get real-time metrics
   */
  async getRealTimeMetrics(): Promise<{
    activePayments: number;
    todayRevenue: number;
    todayPayments: number;
    successRate: number;
    lastUpdated: string;
  }> {
    const response = await axiosInstance.get('/analytics/realtime');
    return response.data;
  }
}

export const analyticsService = new AnalyticsService();