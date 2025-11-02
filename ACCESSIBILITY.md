# Accessibility Guide

This document outlines the accessibility standards and implementation details for the PayBridge frontend application.

## Overview

PayBridge follows WCAG 2.1 AA standards to ensure the application is accessible to all users, including those using assistive technologies.

## Key Features Implemented

### 1. Keyboard Navigation
- All interactive elements are keyboard accessible
- Proper tab order throughout the application
- Visible focus indicators on all focusable elements
- Skip links for main content navigation
- Escape key closes modals and dropdowns

### 2. Screen Reader Support
- Semantic HTML structure with proper headings
- ARIA labels and descriptions where needed
- Live regions for dynamic content announcements
- Proper form labeling and error associations
- Screen reader only content for context

### 3. Focus Management
- Focus trapping in modals using React Aria
- Focus restoration when modals close
- Automatic focus on first form field
- Focus management during route changes

### 4. Color and Contrast
- WCAG AA compliant color contrast ratios
- Information not conveyed by color alone
- High contrast mode support
- Reduced motion support for animations

## Components

### AccessibleModal
```typescript
<AccessibleModal
  isOpen={isOpen}
  onClose={onClose}
  title="Modal Title"
  size="md"
>
  {/* Modal content */}
</AccessibleModal>
```

Features:
- Focus trapping with React Aria FocusScope
- Escape key handling
- Proper ARIA attributes
- Screen reader announcements

### Form Components
All form components include:
- Proper label associations
- Error message announcements
- Required field indicators
- ARIA invalid states

```typescript
<FormField
  name="email"
  control={control}
  label="Email Address"
  required
  type="email"
/>
```

### Skip Link
```typescript
<SkipLink />
```
Allows keyboard users to skip to main content.

### Live Region
```typescript
<LiveRegion 
  message="Form submitted successfully" 
  priority="polite" 
/>
```
Announces dynamic content changes to screen readers.

## Keyboard Shortcuts

### Global Shortcuts
- `Alt + 1-7`: Navigate to dashboard tabs
- `Escape`: Close modals and dropdowns
- `Tab`: Navigate forward through interactive elements
- `Shift + Tab`: Navigate backward through interactive elements

### Modal Navigation
- `Escape`: Close modal
- `Tab`: Navigate within modal (focus trapped)
- `Enter`: Activate focused button

### Form Navigation
- `Tab`: Move to next field
- `Shift + Tab`: Move to previous field
- `Enter`: Submit form (when on submit button)
- `Space`: Toggle checkboxes and buttons

## Testing Guidelines

### Automated Testing
```bash
# Install axe-core for automated accessibility testing
npm install --save-dev @axe-core/react

# Run accessibility tests
npm run test:a11y
```

### Manual Testing Checklist

#### Keyboard Navigation
- [ ] All interactive elements are reachable via keyboard
- [ ] Tab order is logical and intuitive
- [ ] Focus indicators are visible and clear
- [ ] No keyboard traps (except intentional modal traps)
- [ ] Skip links work correctly

#### Screen Reader Testing
- [ ] Content is announced in logical order
- [ ] Form labels are properly associated
- [ ] Error messages are announced
- [ ] Dynamic content changes are announced
- [ ] Images have appropriate alt text

#### Visual Testing
- [ ] Text has sufficient color contrast (4.5:1 minimum)
- [ ] Focus indicators are visible
- [ ] Content is readable at 200% zoom
- [ ] Information is not conveyed by color alone

### Testing Tools

#### Browser Extensions
- axe DevTools
- WAVE Web Accessibility Evaluator
- Lighthouse Accessibility Audit

#### Screen Readers
- **macOS**: VoiceOver (built-in)
- **Windows**: NVDA (free) or JAWS
- **Linux**: Orca

#### Testing Commands
```bash
# VoiceOver (macOS)
Cmd + F5  # Toggle VoiceOver

# NVDA (Windows)
Ctrl + Alt + N  # Start NVDA

# Chrome DevTools
F12 > Lighthouse > Accessibility
```

## Implementation Examples

### Accessible Button
```typescript
<Button
  variant="primary"
  aria-label="Save changes" // For icon-only buttons
  disabled={isLoading}
  loading={isLoading}
>
  Save
</Button>
```

### Accessible Form
```typescript
const MyForm = () => {
  const { control, handleSubmit } = useForm();
  const { focusRef, focusFirst } = useFocusManagement();

  useEffect(() => {
    focusFirst(); // Focus first field on mount
  }, [focusFirst]);

  return (
    <form ref={focusRef} onSubmit={handleSubmit(onSubmit)}>
      <FormField
        name="name"
        control={control}
        label="Full Name"
        required
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};
```

### Accessible Data Table
```typescript
<table role="table" aria-label="Payment transactions">
  <thead>
    <tr>
      <th scope="col">Date</th>
      <th scope="col">Amount</th>
      <th scope="col">Status</th>
    </tr>
  </thead>
  <tbody>
    {data.map((item) => (
      <tr key={item.id}>
        <td>{item.date}</td>
        <td>{item.amount}</td>
        <td>
          <span 
            className={`status-${item.status}`}
            aria-label={`Payment status: ${item.status}`}
          >
            {item.status}
          </span>
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

## Common Patterns

### Loading States
```typescript
// Announce loading states
<div aria-live="polite" aria-busy={isLoading}>
  {isLoading ? 'Loading...' : 'Content loaded'}
</div>

// Loading buttons
<Button loading={isSubmitting} disabled={isSubmitting}>
  {isSubmitting ? 'Saving...' : 'Save'}
</Button>
```

### Error Handling
```typescript
// Associate errors with form fields
<FormField
  name="email"
  control={control}
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? 'email-error' : undefined}
/>
{errors.email && (
  <p id="email-error" role="alert" aria-live="polite">
    {errors.email.message}
  </p>
)}
```

### Dynamic Content
```typescript
// Announce dynamic changes
const { announce } = useAnnouncement();

const handleSuccess = () => {
  announce('Payment created successfully', 'polite');
};
```

## Compliance Checklist

### WCAG 2.1 AA Requirements
- [ ] **1.1.1** Non-text Content: Alt text for images
- [ ] **1.3.1** Info and Relationships: Proper semantic markup
- [ ] **1.4.3** Contrast: 4.5:1 contrast ratio for normal text
- [ ] **2.1.1** Keyboard: All functionality via keyboard
- [ ] **2.1.2** No Keyboard Trap: Users can navigate away
- [ ] **2.4.1** Bypass Blocks: Skip links provided
- [ ] **2.4.3** Focus Order: Logical tab sequence
- [ ] **2.4.7** Focus Visible: Clear focus indicators
- [ ] **3.2.2** On Input: No unexpected context changes
- [ ] **3.3.1** Error Identification: Clear error messages
- [ ] **3.3.2** Labels or Instructions: Form labels provided
- [ ] **4.1.2** Name, Role, Value: Proper ARIA implementation

## Resources

### Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Aria Documentation](https://react-spectrum.adobe.com/react-aria/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

### Tools
- [axe-core](https://github.com/dequelabs/axe-core)
- [React Aria](https://react-spectrum.adobe.com/react-aria/)
- [WAVE](https://wave.webaim.org/)

### Testing
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [Keyboard Testing Guide](https://webaim.org/articles/keyboard/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)