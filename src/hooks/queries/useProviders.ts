import { useQuery } from '@tanstack/react-query';
import { providerService } from '../../services';

export const useProviders = () => {
  return useQuery({
    queryKey: ['providers'],
    queryFn: () => providerService.getProviders(),
    staleTime: 10 * 60 * 1000 // 10 minutes for providers
  });
};

export const useProvider = (providerId: string) => {
  return useQuery({
    queryKey: ['provider', providerId],
    queryFn: () => providerService.getProvider(providerId),
    enabled: !!providerId
  });
};

export const useProviderTypes = () => {
  return useQuery({
    queryKey: ['provider-types'],
    queryFn: () => providerService.getAvailableProviderTypes(),
    staleTime: 60 * 60 * 1000 // 1 hour for provider types
  });
};

export const useProviderConfigTemplate = (providerType: string) => {
  return useQuery({
    queryKey: ['provider-config-template', providerType],
    queryFn: () => providerService.getProviderConfigTemplate(providerType),
    enabled: !!providerType,
    staleTime: 60 * 60 * 1000 // 1 hour for config templates
  });
};