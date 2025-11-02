# Loading State Standards

This document defines the standardized loading patterns used throughout the PayBridge frontend application.

## Loading Components

### LoadingSpinner
Use for inline loading indicators and button states.

```typescript
import { LoadingSpinner } from '../components/common';

// Sizes: sm, md, lg, xl
<LoadingSpinner size="md" text="Loading..." />
```

### LoadingSkeleton
Use for initial page loads and content placeholders.

```typescript
import { LoadingSkeleton } from '../components/common';

// Variants: card, table, text, stat, chart
<LoadingSkeleton variant="card" />
<LoadingSkeleton variant="table" rows={5} />
```

### LoadingOverlay
Use for forms, modals, and overlay loading states.

```typescript
import { LoadingOverlay } from '../components/common';

<div className="relative">
  <LoadingOverlay isVisible={isLoading} text="Saving..." />
  {/* Your content */}
</div>
```

### Button Loading
Buttons automatically handle loading states.

```typescript
import { Button } from '../components/common';

<Button loading={isSubmitting}>
  Submit Form
</Button>
```

## Loading Patterns

### 1. Initial Page Load
Use `LoadingSkeleton` with appropriate variants:

```typescript
// For dashboard pages
const TabLoadingFallback = () => (
  <div className="space-y-6">
    <LoadingSkeleton variant="stat" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <LoadingSkeleton variant="card" />
      <LoadingSkeleton variant="card" />
      <LoadingSkeleton variant="card" />
    </div>
    <LoadingSkeleton variant="table" rows={5} />
  </div>
);
```

### 2. Data Fetching
Use `useLoading` hook for consistent state management:

```typescript
import { useLoading } from '../hooks/useLoading';

const MyComponent = () => {
  const { isLoading, withLoading } = useLoading();

  const fetchData = async () => {
    await withLoading(async () => {
      const data = await apiCall();
      setData(data);
    });
  };

  if (isLoading) {
    return <LoadingSkeleton variant="table" />;
  }

  return <DataTable data={data} />;
};
```

### 3. Form Submissions
Use `LoadingOverlay` for form containers:

```typescript
const MyForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="relative">
      <LoadingOverlay isVisible={isSubmitting} text="Saving..." />
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <Button loading={isSubmitting} type="submit">
          Save Changes
        </Button>
      </form>
    </div>
  );
};
```

### 4. Search Operations
Use inline spinners for search:

```typescript
const SearchComponent = () => {
  const [isSearching, setIsSearching] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <input {...searchProps} />
      {isSearching && <LoadingSpinner size="sm" />}
    </div>
  );
};
```

## Component-Specific Standards

### StatCard
```typescript
<StatCard
  title="Total Revenue"
  value="$12,345"
  loading={isLoading}
/>
```

### DataTable
```typescript
<DataTable
  columns={columns}
  data={data}
  loading={isLoading}
  emptyMessage="No transactions found"
/>
```

### Modals
```typescript
const MyModal = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="modal-container relative">
      <LoadingOverlay isVisible={isLoading} />
      {/* Modal content */}
    </div>
  );
};
```

## Suspense Boundaries

Use React Suspense for lazy-loaded components:

```typescript
<Suspense fallback={<TabLoadingFallback />}>
  <LazyComponent />
</Suspense>
```

## Loading State Rules

### When to Show Loading States

1. **Always** show loading for async operations > 200ms
2. **Always** show loading for form submissions
3. **Always** show loading for data fetching
4. **Never** show loading for cached data
5. **Never** show multiple loading states simultaneously

### Loading State Hierarchy

1. **Page Level**: Use `LoadingSkeleton` variants
2. **Component Level**: Use component-specific loading props
3. **Action Level**: Use `LoadingSpinner` or button loading
4. **Overlay Level**: Use `LoadingOverlay` for blocking operations

### Accessibility

- All loading states include proper ARIA labels
- Loading spinners have `role="status"`
- Screen readers announce loading state changes
- Loading states don't interfere with keyboard navigation

### Performance

- Loading states render immediately (no delay)
- Skeleton screens match actual content layout
- Loading states are lightweight and performant
- Avoid nested loading states

## Migration Checklist

- [ ] Replace custom spinners with `LoadingSpinner`
- [ ] Replace empty states with `LoadingSkeleton`
- [ ] Add loading props to all data components
- [ ] Use `useLoading` hook for async operations
- [ ] Add `LoadingOverlay` to forms and modals
- [ ] Update button components to use loading prop
- [ ] Test loading states with slow network conditions
- [ ] Verify accessibility of loading states