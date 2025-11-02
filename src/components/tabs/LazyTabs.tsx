import { lazy } from 'react';

// Code-split tab components for better performance
export const OverviewTab = lazy(() => 
  import('./OverviewTab').then(module => ({ default: module.OverviewTab }))
);

export const PaymentsTab = lazy(() => 
  import('./PaymentsTab').then(module => ({ default: module.PaymentsTab }))
);

export const ProvidersTab = lazy(() => 
  import('./ProvidersTab').then(module => ({ default: module.ProvidersTab }))
);

export const PaymentLinksTab = lazy(() => 
  import('./PaymentLinksTab').then(module => ({ default: module.PaymentLinksTab }))
);

export const ReconciliationTab = lazy(() => 
  import('./ReconciliationTab').then(module => ({ default: module.ReconciliationTab }))
);

export const AnalyticsTab = lazy(() => 
  import('./AnalyticsTab').then(module => ({ default: module.AnalyticsTab }))
);

export const SettingsTab = lazy(() => 
  import('./SettingsTab').then(module => ({ default: module.SettingsTab }))
);