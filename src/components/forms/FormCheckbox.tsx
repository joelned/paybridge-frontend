import React from 'react';
import { useController, Control, FieldPath, FieldValues } from 'react-hook-form';

interface Props<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  description?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

export function FormCheckbox<T extends FieldValues>({
  name,
  control,
  label,
  description,
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

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-start space-x-3">
        <input
          {...field}
          type="checkbox"
          checked={field.value || false}
          disabled={disabled}
          className={`w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 disabled:opacity-50 ${
            error ? 'border-red-300' : ''
          }`}
        />
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
}