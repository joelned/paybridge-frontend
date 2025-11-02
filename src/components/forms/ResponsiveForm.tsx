import React from 'react';
import { useIsMobile } from '../../hooks/useMediaQuery';

interface ResponsiveFormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}

export const ResponsiveForm = React.memo(({
  children,
  onSubmit,
  className = '',
}: ResponsiveFormProps) => {
  const isMobile = useIsMobile();

  return (
    <form
      onSubmit={onSubmit}
      className={`${isMobile ? 'form-mobile' : ''} ${className}`}
    >
      {children}
    </form>
  );
});

ResponsiveForm.displayName = 'ResponsiveForm';

interface ResponsiveFormRowProps {
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveFormRow = React.memo(({
  children,
  className = '',
}: ResponsiveFormRowProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={`${isMobile ? 'form-row' : 'flex gap-4'} ${className}`}>
      {children}
    </div>
  );
});

ResponsiveFormRow.displayName = 'ResponsiveFormRow';

interface ResponsiveButtonGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveButtonGroup = React.memo(({
  children,
  className = '',
}: ResponsiveButtonGroupProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={`${isMobile ? 'button-group-mobile' : 'flex gap-3 justify-end'} ${className}`}>
      {children}
    </div>
  );
});

ResponsiveButtonGroup.displayName = 'ResponsiveButtonGroup';