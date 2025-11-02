import React from 'react';
import { ProviderType, PROVIDER_CONFIGS, ConfigField } from '../../types/provider';

interface Props {
  providerType: ProviderType;
  config: Record<string, any>;
  onChange: (config: Record<string, any>) => void;
  errors: Record<string, string>;
}

export const ProviderConfigForm: React.FC<Props> = ({ providerType, config, onChange, errors }) => {
  const fields = PROVIDER_CONFIGS[providerType];

  const handleFieldChange = (key: string, value: any) => {
    onChange({ ...config, [key]: value });
  };

  const renderField = (field: ConfigField) => {
    const value = config[field.key] || (field.type === 'boolean' ? false : '');
    const error = errors[field.key];

    if (field.type === 'boolean') {
      return (
        <div key={field.key} className="space-y-2">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleFieldChange(field.key, e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-gray-700">{field.label}</span>
          </label>
          {field.description && (
            <p className="text-xs text-gray-500">{field.description}</p>
          )}
        </div>
      );
    }

    return (
      <div key={field.key} className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          type={field.type}
          value={value}
          onChange={(e) => handleFieldChange(field.key, e.target.value)}
          placeholder={field.placeholder}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        {field.description && (
          <p className="text-xs text-gray-500">{field.description}</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {fields.map(renderField)}
    </div>
  );
};