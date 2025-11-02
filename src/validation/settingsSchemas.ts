import { z } from 'zod';

export const businessInfoSchema = z.object({
  businessName: z
    .string()
    .min(1, 'Business name is required')
    .max(100, 'Business name cannot exceed 100 characters'),
  businessType: z
    .string()
    .min(1, 'Business type is required'),
  websiteUrl: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  contactPhone: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required')
  }).optional()
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(1, 'New password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your new password')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  webhookNotifications: z.boolean().default(true),
  paymentSuccessNotification: z.boolean().default(true),
  paymentFailureNotification: z.boolean().default(true),
  dailySummaryNotification: z.boolean().default(false)
});

export const securitySettingsSchema = z.object({
  twoFactorEnabled: z.boolean().default(false),
  sessionTimeout: z
    .number()
    .int('Session timeout must be a whole number')
    .min(15, 'Session timeout must be at least 15 minutes')
    .max(1440, 'Session timeout cannot exceed 24 hours')
    .default(60),
  ipWhitelist: z
    .array(z.string().ip('Please enter a valid IP address'))
    .optional()
});

export const webhookSettingsSchema = z.object({
  url: z
    .string()
    .url('Please enter a valid webhook URL')
    .optional()
    .or(z.literal('')),
  events: z
    .array(z.string())
    .min(1, 'Please select at least one event')
    .default(['payment.completed', 'payment.failed']),
  secret: z
    .string()
    .min(16, 'Webhook secret must be at least 16 characters')
    .optional()
    .or(z.literal('')),
  isActive: z.boolean().default(false)
});

export const preferencesSchema = z.object({
  defaultCurrency: z
    .string()
    .length(3, 'Currency must be a 3-letter code')
    .default('USD'),
  timezone: z
    .string()
    .min(1, 'Timezone is required')
    .default('UTC'),
  dateFormat: z
    .enum(['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'])
    .default('MM/DD/YYYY'),
  language: z
    .enum(['en', 'es', 'fr', 'de'])
    .default('en')
});

export type BusinessInfoFormData = z.infer<typeof businessInfoSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type NotificationSettingsFormData = z.infer<typeof notificationSettingsSchema>;
export type SecuritySettingsFormData = z.infer<typeof securitySettingsSchema>;
export type WebhookSettingsFormData = z.infer<typeof webhookSettingsSchema>;
export type PreferencesFormData = z.infer<typeof preferencesSchema>;