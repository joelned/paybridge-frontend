import { z } from 'zod';

export const createPaymentSchema = z.object({
  amount: z
    .number()
    .min(0.01, 'Amount must be greater than 0')
    .max(1000000, 'Amount cannot exceed 1,000,000'),
  currency: z
    .string()
    .min(1, 'Currency is required')
    .length(3, 'Currency must be a 3-letter code'),
  providerId: z
    .string()
    .min(1, 'Payment provider is required'),
  customerEmail: z
    .string()
    .email('Please enter a valid email address')
    .optional(),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  callbackUrl: z
    .string()
    .url('Please enter a valid callback URL')
    .optional()
});

export const paymentLinkSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title cannot exceed 100 characters'),
  amount: z
    .number()
    .min(0.01, 'Amount must be greater than 0')
    .max(1000000, 'Amount cannot exceed 1,000,000'),
  currency: z
    .string()
    .min(1, 'Currency is required')
    .length(3, 'Currency must be a 3-letter code'),
  providerId: z
    .string()
    .min(1, 'Payment provider is required'),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  expiresAt: z
    .string()
    .datetime('Please enter a valid date and time')
    .optional(),
  maxUses: z
    .number()
    .int('Max uses must be a whole number')
    .min(1, 'Max uses must be at least 1')
    .optional(),
  collectCustomerInfo: z
    .boolean()
    .default(false),
  successUrl: z
    .string()
    .url('Please enter a valid success URL')
    .optional(),
  cancelUrl: z
    .string()
    .url('Please enter a valid cancel URL')
    .optional()
});

export const refundPaymentSchema = z.object({
  paymentId: z
    .string()
    .min(1, 'Payment ID is required'),
  amount: z
    .number()
    .min(0.01, 'Refund amount must be greater than 0')
    .optional(),
  reason: z
    .string()
    .max(500, 'Reason cannot exceed 500 characters')
    .optional()
});

export type CreatePaymentFormData = z.infer<typeof createPaymentSchema>;
export type PaymentLinkFormData = z.infer<typeof paymentLinkSchema>;
export type RefundPaymentFormData = z.infer<typeof refundPaymentSchema>;