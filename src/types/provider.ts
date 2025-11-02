export type ProviderType = 'STRIPE' | 'PAYSTACK' | 'FLUTTERWAVE';

export interface StripeConfig {
  apiKey: string;
  secretKey: string;
  webhookSecret: string;
  testMode: boolean;
}

export interface PaystackConfig {
  publicKey: string;
  secretKey: string;
  testMode: boolean;
}

export interface FlutterwaveConfig {
  publicKey: string;
  secretKey: string;
  encryptionKey: string;
  testMode: boolean;
}

export type ProviderConfig = StripeConfig | PaystackConfig | FlutterwaveConfig;

export interface PaymentProviderData {
  id?: string;
  name: string;
  type: ProviderType;
  config: ProviderConfig;
  enabled: boolean;
  priority: number;
}

export interface ConfigField {
  key: string;
  label: string;
  type: 'text' | 'password' | 'boolean';
  required: boolean;
  placeholder?: string;
  description?: string;
}

export const PROVIDER_CONFIGS: Record<ProviderType, ConfigField[]> = {
  STRIPE: [
    { key: 'apiKey', label: 'Publishable Key', type: 'text', required: true, placeholder: 'pk_test_...' },
    { key: 'secretKey', label: 'Secret Key', type: 'password', required: true, placeholder: 'sk_test_...' },
    { key: 'webhookSecret', label: 'Webhook Secret', type: 'password', required: true, placeholder: 'whsec_...' },
    { key: 'testMode', label: 'Test Mode', type: 'boolean', required: false }
  ],
  PAYSTACK: [
    { key: 'publicKey', label: 'Public Key', type: 'text', required: true, placeholder: 'pk_test_...' },
    { key: 'secretKey', label: 'Secret Key', type: 'password', required: true, placeholder: 'sk_test_...' },
    { key: 'testMode', label: 'Test Mode', type: 'boolean', required: false }
  ],
  FLUTTERWAVE: [
    { key: 'publicKey', label: 'Public Key', type: 'text', required: true, placeholder: 'FLWPUBK_TEST-...' },
    { key: 'secretKey', label: 'Secret Key', type: 'password', required: true, placeholder: 'FLWSECK_TEST-...' },
    { key: 'encryptionKey', label: 'Encryption Key', type: 'password', required: true, placeholder: 'FLWSECK_TEST...' },
    { key: 'testMode', label: 'Test Mode', type: 'boolean', required: false }
  ]
};