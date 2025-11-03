import { axiosInstance } from './api/axiosConfig';
import { ApiError } from '../types/api';

export interface MerchantProfile {
  id: string;
  businessName: string;
  email: string;
  businessType: string;
  businessCountry: string;
  websiteUrl?: string;
  contactPhone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  businessRegistration?: {
    registrationNumber: string;
    taxId: string;
    registrationCountry: string;
  };
  bankingDetails?: {
    accountHolderName: string;
    accountNumber: string;
    routingNumber: string;
    bankName: string;
    bankCountry: string;
  };
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED';
  verificationStatus: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface UpdateMerchantProfileRequest {
  businessName?: string;
  businessType?: string;
  websiteUrl?: string;
  contactPhone?: string;
  address?: MerchantProfile['address'];
  businessRegistration?: MerchantProfile['businessRegistration'];
  bankingDetails?: MerchantProfile['bankingDetails'];
}

export interface MerchantSettings {
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    webhookNotifications: boolean;
    paymentSuccessNotification: boolean;
    paymentFailureNotification: boolean;
    dailySummaryNotification: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
    ipWhitelist?: string[];
  };
  preferences: {
    defaultCurrency: string;
    timezone: string;
    dateFormat: string;
    language: string;
  };
  webhooks: {
    url?: string;
    events: string[];
    secret?: string;
    isActive: boolean;
  };
}

export interface UpdateMerchantSettingsRequest extends Partial<MerchantSettings> {}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface MerchantVerificationDocument {
  id: string;
  type: 'BUSINESS_LICENSE' | 'TAX_CERTIFICATE' | 'BANK_STATEMENT' | 'ID_DOCUMENT' | 'OTHER';
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
}

export interface MerchantStatistics {
  totalPayments: number;
  totalRevenue: number;
  successRate: number;
  averageTransactionValue: number;
  activePaymentLinks: number;
  connectedProviders: number;
  accountAge: number; // in days
  lastPaymentDate?: string;
}

class MerchantService {
  /**
   * Get merchant profile
   */
  async getMerchantProfile(): Promise<MerchantProfile> {
    const response = await axiosInstance.get<MerchantProfile>('/merchants/profile');
    return response.data;
  }

  /**
   * Update merchant profile
   */
  async updateMerchantProfile(profileData: UpdateMerchantProfileRequest): Promise<MerchantProfile> {
    try {
      const response = await axiosInstance.put<MerchantProfile>('/merchants/profile', profileData);
      return response.data;
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError('Failed to update profile');
    }
  }

  /**
   * Get merchant settings
   */
  async getMerchantSettings(): Promise<MerchantSettings> {
    const response = await axiosInstance.get<MerchantSettings>('/merchants/settings');
    return response.data;
  }

  /**
   * Update merchant settings
   */
  async updateMerchantSettings(settingsData: UpdateMerchantSettingsRequest): Promise<MerchantSettings> {
    const response = await axiosInstance.put<MerchantSettings>('/merchants/settings', settingsData);
    return response.data;
  }

  /**
   * Change password
   */
  async changePassword(passwordData: ChangePasswordRequest): Promise<{ message: string }> {
    const response = await axiosInstance.post('/merchants/change-password', passwordData);
    return response.data;
  }

  /**
   * Enable/disable two-factor authentication
   */
  async toggleTwoFactor(enabled: boolean): Promise<{ 
    enabled: boolean; 
    qrCode?: string; 
    backupCodes?: string[];
  }> {
    const response = await axiosInstance.post('/merchants/two-factor/toggle', { enabled });
    return response.data;
  }

  /**
   * Verify two-factor authentication setup
   */
  async verifyTwoFactor(code: string): Promise<{ verified: boolean; backupCodes: string[] }> {
    const response = await axiosInstance.post('/merchants/two-factor/verify', { code });
    return response.data;
  }

  /**
   * Upload verification document
   */
  async uploadVerificationDocument(
    type: MerchantVerificationDocument['type'], 
    file: File
  ): Promise<MerchantVerificationDocument> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await axiosInstance.post<MerchantVerificationDocument>(
      '/merchants/verification/documents', 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  }

  /**
   * Get verification documents
   */
  async getVerificationDocuments(): Promise<MerchantVerificationDocument[]> {
    const response = await axiosInstance.get<MerchantVerificationDocument[]>('/merchants/verification/documents');
    return response.data;
  }

  /**
   * Delete verification document
   */
  async deleteVerificationDocument(documentId: string): Promise<void> {
    await axiosInstance.delete(`/merchants/verification/documents/${documentId}`);
  }

  /**
   * Get merchant statistics
   */
  async getMerchantStatistics(): Promise<MerchantStatistics> {
    const response = await axiosInstance.get<MerchantStatistics>('/merchants/statistics');
    return response.data;
  }

  /**
   * Request account verification
   */
  async requestAccountVerification(): Promise<{ message: string; status: string }> {
    const response = await axiosInstance.post('/merchants/verification/request');
    return response.data;
  }

  /**
   * Test webhook endpoint
   */
  async testWebhook(url: string): Promise<{ success: boolean; message: string; responseTime?: number }> {
    const response = await axiosInstance.post('/merchants/webhook/test', { url });
    return response.data;
  }

  /**
   * Generate API key
   */
  async generateApiKey(name: string, permissions: string[]): Promise<{ 
    keyId: string; 
    key: string; 
    name: string; 
    permissions: string[];
    createdAt: string;
  }> {
    const response = await axiosInstance.post('/merchants/api-keys', { name, permissions });
    return response.data;
  }

  /**
   * Get API keys
   */
  async getApiKeys(): Promise<{
    keyId: string;
    name: string;
    permissions: string[];
    lastUsed?: string;
    createdAt: string;
    isActive: boolean;
  }[]> {
    const response = await axiosInstance.get('/merchants/api-keys');
    return response.data;
  }

  /**
   * Revoke API key
   */
  async revokeApiKey(keyId: string): Promise<void> {
    await axiosInstance.delete(`/merchants/api-keys/${keyId}`);
  }

  /**
   * Export merchant data
   */
  async exportMerchantData(format: 'JSON' | 'CSV' = 'JSON'): Promise<Blob> {
    const response = await axiosInstance.get(`/merchants/export?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  }

  /**
   * Delete merchant account
   */
  async deleteMerchantAccount(password: string): Promise<{ message: string }> {
    const response = await axiosInstance.post('/merchants/delete-account', { password });
    return response.data;
  }

  /**
   * Get overview dashboard data
   */
  async getOverview(): Promise<{
    stats: Array<{
      title: string;
      value: string;
      change?: string;
      trend?: 'up' | 'down';
      subtitle?: string;
    }>;
    providerStats: Array<{
      provider: string;
      volume: string;
      transactions: number;
      successRate: string;
      color: string;
    }>;
    recentTransactions: Array<{
      id: string;
      customer: string;
      amount: string;
      status: string;
      provider: string;
      date: string;
    }>;
  }> {
    const response = await axiosInstance.get('/merchants/overview');
    return response.data;
  }

  /**
   * Get recent transactions for overview
   */
  async getRecentTransactions(limit: number = 10): Promise<Array<{
    id: string;
    customer: string;
    amount: string;
    status: string;
    provider: string;
    date: string;
  }>> {
    const response = await axiosInstance.get(`/merchants/recent-transactions?limit=${limit}`);
    return response.data;
  }

  /**
   * Get business info for settings
   */
  async getBusinessInfo(): Promise<{
    businessName: string;
    businessType: string;
    businessCountry: string;
    email: string;
  }> {
    const response = await axiosInstance.get('/merchants/business-info');
    return response.data;
  }

  /**
   * Get notification settings
   */
  async getNotificationSettings(): Promise<{
    email: boolean;
    sms: boolean;
    webhook: boolean;
  }> {
    const response = await axiosInstance.get('/merchants/notification-settings');
    return response.data;
  }

  /**
   * Get security settings
   */
  async getSecuritySettings(): Promise<{
    twoFactor: boolean;
    sessionTimeout: string;
  }> {
    const response = await axiosInstance.get('/merchants/security-settings');
    return response.data;
  }
}

export const merchantService = new MerchantService();