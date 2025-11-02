import React from 'react';
import { useController, Control, FieldPath, FieldValues } from 'react-hook-form';

interface Option {
  value: string;
  label: string;
}

interface Props<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

export function FormSelect<T extends FieldValues>({
  name,
  control,
  label,
  options,
  placeholder = 'Select an option',
  required = false,
  className = '',
  disabled = false
}: Props<T>) {
  const {
    field,
    fieldState: { error }
  } = useController({
    name,
    control
  });
  
  const fieldId = `select-${name}`;
  const errorId = `${fieldId}-error`;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>
      )}
      
      <select
        {...field}
        id={fieldId}
        disabled={disabled}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : undefined}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 ${
          error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p id={errorId} className="text-sm text-red-600" role="alert" aria-live="polite">
          {error.message}
        </p>
      )}
    </div>
  );
}