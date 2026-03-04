import { axiosInstance } from './api/axiosConfig';

export type SupportedProviderName = 'stripe' | 'paystack';

export interface ConfigureProviderRequest {
  name: SupportedProviderName;
  config: {
    secretKey: string;
  };
  testConnection?: boolean;
}

export interface ConfigureProviderResponse {
  configId: number;
  provider: string;
  tested: boolean;
}

export interface ConfiguredProviderResponse {
  configId: number;
  providerId: number;
  providerName: string;
  providerCode: string;
  enabled: boolean;
  lastVerifiedAt?: string;
  createdAt?: string;
}

export interface TestProviderResponse {
  message: string;
  tested: boolean;
  durationMs?: number;
  metadata?: Record<string, unknown>;
}

class ProviderService {
  async getConfiguredProviders(): Promise<ConfiguredProviderResponse[]> {
    const response = await axiosInstance.get<ConfiguredProviderResponse[]>('/providers');
    return response.data;
  }

  async configureProvider(data: ConfigureProviderRequest): Promise<ConfigureProviderResponse> {
    const response = await axiosInstance.post<ConfigureProviderResponse>(
      '/providers/configure',
      {
        name: data.name,
        config: data.config,
      },
      {
        params: {
          testConnection: data.testConnection ?? true,
        },
      }
    );

    return response.data;
  }

  async testProvider(configId: number): Promise<TestProviderResponse> {
    const response = await axiosInstance.post<TestProviderResponse>(`/providers/test/${configId}`);
    return response.data;
  }
}

export const providerService = new ProviderService();
