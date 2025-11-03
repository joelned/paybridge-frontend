export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateProviderConfig = (type: string, config: Record<string, any>): ValidationResult => {
  const errors: string[] = [];

  switch (type.toLowerCase()) {
    case 'stripe':
      if (!config.secretKey) errors.push('Secret Key is required');
      if (!config.publishableKey) errors.push('Publishable Key is required');
      break;
    case 'paystack':
      if (!config.secretKey) errors.push('Secret Key is required');
      if (!config.publicKey) errors.push('Public Key is required');
      break;
    case 'flutterwave':
      if (!config.secretKey) errors.push('Secret Key is required');
      if (!config.publicKey) errors.push('Public Key is required');
      break;
    default:
      errors.push('Invalid provider type');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};