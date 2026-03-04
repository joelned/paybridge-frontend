// Re-export core types from dedicated files
export type { User, LoginRequest, LoginResponse } from './auth';
export type { ApiResponse, ApiErrorResponse, ValidationError, ApiError } from './api';

// Re-export service types (avoid duplicates)
export type {
  // Provider types
  ConfigureProviderRequest,
  ConfigureProviderResponse,
  ConfiguredProviderResponse,
  TestProviderResponse
} from '../services/providerService';
export type {
  AnalyticsMetrics,
  TimeSeriesData,
  PaymentAnalytics,
  RevenueAnalytics,
  CustomerAnalytics,
  AnalyticsFilters,
  DashboardAnalytics
} from '../services/analyticsService';
export type {
  MerchantProfile,
  UpdateMerchantProfileRequest,
  MerchantSettings,
  UpdateMerchantSettingsRequest,
  ChangePasswordRequest,
  MerchantVerificationDocument,
  MerchantStatistics
} from '../services/merchantService';

// Component prop types
export interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  icon: React.ComponentType<any>;
  trend?: 'up' | 'down';
  subtitle?: string;
}

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  icon?: React.ComponentType<any>;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps {
  label?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  icon?: React.ComponentType<any>;
}

// Utility types
export type { Currency } from '../utils/currencyFormatter';
