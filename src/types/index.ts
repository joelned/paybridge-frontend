export interface User {
  id: string;
  email: string;
  username: string;
  userType: 'MERCHANT' | 'ADMIN';
  businessName?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface Payment {
  id: string;
  customer: string;
  amount: string;
  status: 'SUCCEEDED' | 'PROCESSING' | 'FAILED' | 'PENDING' | 'REFUNDED';
  provider: string;
  date: string;
  idempotencyKey: string;
}

export interface Provider {
  id: number;
  name: string;
  enabled: boolean;
  logo: string;
  color: string;
  apiKey: string;
  transactions: number;
  volume: string;
}

export interface PaymentLink {
  id: string;
  name: string;
  amount: string;
  url: string;
  clicks: number;
  conversions: number;
  status: 'active' | 'expired';
}

export interface ReconciliationJob {
  id: string;
  provider: string;
  period: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'FAILED' | 'PENDING';
  matched: number;
  discrepancies: number;
  date: string;
}

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

export interface ReconciliationJob {
  id: string;
  provider: string;
  period: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'FAILED' | 'PENDING';
  matched: number;
  discrepancies: number;
  date: string;
}

export interface PaymentLink {
  id: string;
  name: string;
  amount: string;
  url: string;
  clicks: number;
  conversions: number;
  status: 'active' | 'expired';
}