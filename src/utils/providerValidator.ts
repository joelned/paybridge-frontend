import { ProviderType, ProviderConfig, PROVIDER_CONFIGS } from '../types/provider';

export function validateProviderConfig(type: ProviderType, config: Record<string, any>): string[] {
  const errors: string[] = [];
  const fields = PROVIDER_CONFIGS[type];

  for (const field of fields) {
    const value = config[field.key];

    if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      errors.push(`${field.label} is required`);
      continue;
    }

    if (field.type === 'boolean' && value !== undefined && typeof value !== 'boolean') {
      errors.push(`${field.label} must be a boolean`);
    }

    if (field.type !== 'boolean' && value && typeof value !== 'string') {
      errors.push(`${field.label} must be a string`);
    }
  }

  return errors;
}

export function getDefaultConfig(type: ProviderType): Record<string, any> {
  const fields = PROVIDER_CONFIGS[type];
  const config: Record<string, any> = {};

  fields.forEach(field => {
    config[field.key] = field.type === 'boolean' ? false : '';
  });

  return config;
}