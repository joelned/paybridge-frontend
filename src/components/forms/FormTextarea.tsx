import React from 'react';
import { useController, Control, FieldPath, FieldValues } from 'react-hook-form';

interface Props<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  maxLength?: number;
}

export function FormTextarea<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  rows = 3,
  required = false,
  className = '',
  disabled = false,
  maxLength
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
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        {...field}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 resize-vertical ${
          error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
        }`}
      />
      
      {maxLength && (
        <div className="flex justify-between text-xs text-gray-500">
          <span>{field.value?.length || 0}/{maxLength}</span>
        </div>
      )}
      
      {error && (
        <p className="text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
}