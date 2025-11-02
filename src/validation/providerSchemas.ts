import { z } from 'zod';

export const providerConfigSchema = z.object({
  name: z
    .string()
    .min(1, 'Provider name is required')
    .max(100, 'Provider name cannot exceed 100 characters'),
  type: z
    .enum(['STRIPE', 'PAYSTACK', 'FLUTTERWAVE'], {
      errorMap: () => ({ message: 'Please select a valid provider type' })
    }),
  priority: z
    .number()
    .int('Priority must be a whole number')
    .min(1, 'Priority must be at least 1')
    .max(100, 'Priority cannot exceed 100')
    .default(1),
  enabled: z
    .boolean()
    .default(true)
});

export const stripeConfigSchema = z.object({
  apiKey: z
    .string()
    .min(1, 'Publishable key is required')
    .startsWith('pk_', 'Publishable key must start with pk_'),
  secretKey: z
    .string()
    .min(1, 'Secret key is required')
    .startsWith('sk_', 'Secret key must start with sk_'),
  webhookSecret: z
    .string()
    .min(1, 'Webhook secret is required')
    .startsWith('whsec_', 'Webhook secret must start with whsec_'),
  testMode: z
    .boolean()
    .default(true)
});

export const paystackConfigSchema = z.object({
  publicKey: z
    .string()
    .min(1, 'Public key is required')
    .startsWith('pk_', 'Public key must start with pk_'),
  secretKey: z
    .string()
    .min(1, 'Secret key is required')
    .startsWith('sk_', 'Secret key must start with sk_'),
  testMode: z
    .boolean()
    .default(true)
});

export const flutterwaveConfigSchema = z.object({
  publicKey: z
    .string()
    .min(1, 'Public key is required')
    .startsWith('FLWPUBK_', 'Public key must start with FLWPUBK_'),
  secretKey: z
    .string()
    .min(1, 'Secret key is required')
    .startsWith('FLWSECK_', 'Secret key must start with FLWSECK_'),
  encryptionKey: z
    .string()
    .min(1, 'Encryption key is required'),
  testMode: z
    .boolean()
    .default(true)
});

export const createProviderSchema = providerConfigSchema.and(
  z.discriminatedUnion('type', [
    z.object({ type: z.literal('STRIPE'), config: stripeConfigSchema }),
    z.object({ type: z.literal('PAYSTACK'), config: paystackConfigSchema }),
    z.object({ type: z.literal('FLUTTERWAVE'), config: flutterwaveConfigSchema })
  ])
);

export const updateProviderSchema = providerConfigSchema.partial().and(
  z.object({
    config: z.union([stripeConfigSchema, paystackConfigSchema, flutterwaveConfigSchema]).optional()
  })
);

export type ProviderConfigFormData = z.infer<typeof providerConfigSchema>;
export type StripeConfigFormData = z.infer<typeof stripeConfigSchema>;
export type PaystackConfigFormData = z.infer<typeof paystackConfigSchema>;
export type FlutterwaveConfigFormData = z.infer<typeof flutterwaveConfigSchema>;
export type CreateProviderFormData = z.infer<typeof createProviderSchema>;
export type UpdateProviderFormData = z.infer<typeof updateProviderSchema>;