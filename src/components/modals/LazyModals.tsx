import { lazy } from 'react';

// Code-split modal components
export const AddProviderModal = lazy(() => 
  import('./AddProviderModal').then(module => ({ default: module.AddProviderModal }))
);

export const EditProviderModal = lazy(() => 
  import('./EditProviderModal').then(module => ({ default: module.EditProviderModal }))
);

export const PaymentDetailsModal = lazy(() => 
  import('./PaymentDetailsModal').then(module => ({ default: module.PaymentDetailsModal }))
);

export const CreatePaymentLinkModal = lazy(() => 
  import('./CreatePaymentLinkModal').then(module => ({ default: module.CreatePaymentLinkModal }))
);

export const ConfirmationModal = lazy(() => 
  import('./ConfirmationModal').then(module => ({ default: module.ConfirmationModal }))
);

export const SettingsModal = lazy(() => 
  import('./SettingsModal').then(module => ({ default: module.SettingsModal }))
);