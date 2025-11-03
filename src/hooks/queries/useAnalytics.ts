import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../../services';
import type { AnalyticsFilters } from '../../services';

export const useDashboardAnalytics = (filters: AnalyticsFilters = {}) => {
  return useQuery({
    queryKey: ['analytics', 'dashboard', filters],
    queryFn: () => analyticsService.getDashboardAnalytics(filters),
    staleTime: 5 * 60 * 1000 // 5 minutes for dashboard analytics
  });
};

export const usePaymentAnalytics = (filters: AnalyticsFilters = {}) => {
  return useQuery({
    queryKey: ['analytics', 'payments', filters],
    queryFn: () => analyticsService.getPaymentAnalytics(filters)
  });
};

export const useRevenueAnalytics = (filters: AnalyticsFilters = {}) => {
  return useQuery({
    queryKey: ['analytics', 'revenue', filters],
    queryFn: () => analyticsService.getRevenueAnalytics(filters)
  });
};

export const useCustomerAnalytics = (filters: AnalyticsFilters = {}) => {
  return useQuery({
    queryKey: ['analytics', 'customers', filters],
    queryFn: () => analyticsService.getCustomerAnalytics(filters)
  });
};

export const usePaymentTrends = (filters: AnalyticsFilters = {}) => {
  return useQuery({
    queryKey: ['analytics', 'trends', 'payments', filters],
    queryFn: () => analyticsService.getPaymentTrends(filters)
  });
};

export const useRevenueTrends = (filters: AnalyticsFilters = {}) => {
  return useQuery({
    queryKey: ['analytics', 'trends', 'revenue', filters],
    queryFn: () => analyticsService.getRevenueTrends(filters)
  });
};

export const useProviderPerformance = (filters: AnalyticsFilters = {}) => {
  return useQuery({
    queryKey: ['analytics', 'provider-performance', filters],
    queryFn: () => analyticsService.getProviderPerformance(filters)
  });
};

export const useRealTimeMetrics = () => {
  return useQuery({
    queryKey: ['analytics', 'realtime'],
    queryFn: () => analyticsService.getRealTimeMetrics(),
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    staleTime: 0 // Always consider stale for real-time data
  });
};