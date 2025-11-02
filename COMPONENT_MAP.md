# Component Map

This document outlines the organization and location of all components in the PayBridge frontend.

## Directory Structure

```
src/components/
├── common/          # Shared UI components
├── modals/          # All modal components
├── layout/          # Layout components (Header, Sidebar, etc.)
├── section/         # Section-specific components
├── feedback/        # User feedback components
└── index.ts         # Main component exports
```

## Component Categories

### Common Components (`src/components/common/`)
Reusable UI components used throughout the application.

- **Button.tsx** - Primary button component with variants
- **Input.tsx** - Form input component
- **Select.tsx** - Dropdown select component
- **Card.tsx** - Container card component
- **StatCard.tsx** - Statistics display card
- **Badge.tsx** - Status badge component
- **CurrencyDisplay.tsx** - Currency formatting component
- **MoneyInput.tsx** - Currency amount input component
- **BreadcrumbNavigation.tsx** - Navigation breadcrumbs
- **ErrorBoundary.tsx** - Error boundary wrapper
- **NotificationDropdown.tsx** - Notification dropdown
- **ProtectedRoute.tsx** - Route protection component
- **ThemeToggle.tsx** - Theme switcher
- **UserMenuDropdown.tsx** - User menu dropdown

### Modal Components (`src/components/modals/`)
All modal dialogs and overlays.

- **AddProviderModal.tsx** - Add payment provider modal
- **UpdateProviderModal.tsx** - Update payment provider modal
- **CreateLinkModal.tsx** - Create payment link modal
- **ConfirmDialog.tsx** - Generic confirmation dialog
- **ConfirmModal.tsx** - Confirmation modal
- **ExportDataModal.tsx** - Data export modal
- **TransactionDetailsModal.tsx** - Transaction details modal
- **RetryPaymentModal.tsx** - Payment retry modal
- **RunReconciliationModal.tsx** - Reconciliation modal
- **InvestigateDiscrepancyModal.tsx** - Discrepancy investigation modal
- **UpdateBusinessInfoModal.tsx** - Business info update modal
- **ViewProviderDashboardModal.tsx** - Provider dashboard modal
- **BaseModal.tsx** - Base modal component
- **FormModal.tsx** - Form modal wrapper
- **InfoModal.tsx** - Information modal
- **LoadingModal.tsx** - Loading modal
- **SuccessModal.tsx** - Success modal
- **ModalProvider.tsx** - Modal context provider
- **ProviderConfigForm.tsx** - Provider configuration form

### Layout Components (`src/components/layout/`)
Application layout and structure components.

- **Header.tsx** - Main application header
- **Sidebar.tsx** - Navigation sidebar
- **PageLayout.tsx** - Page layout wrapper
- **Container.tsx** - Content container
- **Toolbar.tsx** - Action toolbar

### Section Components (`src/components/section/`)
Section-specific components.

- **SectionHeader.tsx** - Section header component

### Feedback Components (`src/components/feedback/`)
User feedback and notification components.

- **InlineAlert.tsx** - Inline alert component

## Import Guidelines

### Preferred Import Patterns

```typescript
// Import from main index (recommended)
import { Button, Input, Card } from '../components';

// Import from category index
import { Button, Input } from '../components/common';

// Direct import (only when needed)
import { Button } from '../components/common/Button';
```

### Import Rules

1. **Use category imports** for multiple components from the same category
2. **Use main index imports** for components from different categories
3. **Avoid direct imports** unless there's a specific need
4. **Always use named imports** instead of default imports

## Component Standards

### File Naming
- Use PascalCase for component files: `ComponentName.tsx`
- Use camelCase for utility files: `utilityName.ts`
- Include component type in name when helpful: `CreateLinkModal.tsx`

### Export Standards
- Export component as named export: `export const ComponentName`
- Export types alongside components
- Include component in appropriate index file

### Component Organization
- Keep related components in the same directory
- Use subdirectories sparingly, only for clear categorization
- Maintain flat structure when possible

## Removed Duplicates

The following duplicate/empty files were removed during cleanup:

- `src/components/ui/Modals/CreateLinkModal.tsx` (empty)
- `src/components/ui/Modals/CreatePaymentModals.tsx` (empty)
- `src/components/ui/Charts/ProviderDistributionChart.tsx` (empty)
- `src/components/ui/Charts/RevenueChart.tsx` (empty)
- `src/components/ui/Charts/TransactionChart.tsx` (empty)
- `src/components/ui/` directory (redundant)

## Migration Notes

- All UI components moved from `src/components/ui/` to `src/components/common/`
- Empty chart components removed (implement when needed)
- Modal components consolidated in `src/components/modals/`
- All imports updated to use new structure