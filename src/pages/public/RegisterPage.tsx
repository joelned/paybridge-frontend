// src/pages/public/RegisterPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Building, Mail, Lock, Globe, MapPin } from 'lucide-react';
import { Button, Input, Select, Card } from '../../components/common';
import { InlineAlert } from '../../components/feedback/InlineAlert';
import { authService } from '../../services/authService';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
}

interface RegisterRequest {
  businessName: string;
  email: string;
  password: string;
  businessType: string;
  businessCountry: string;
  websiteUrl?: string;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterRequest>({
    businessName: '',
    email: '',
    password: '',
    businessType: '',
    businessCountry: 'NG',
    websiteUrl: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (!formData.businessType) newErrors.businessType = 'Business type is required';
    if (!formData.businessCountry.trim()) newErrors.businessCountry = 'Country code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      await authService.register(formData);
      navigate('/verify-email', { 
        state: { email: formData.email }
      });
    } catch (err: any) {
      let errorMessage = 'Registration failed. Please try again.';
      if (err.response) {
        const backendError = err.response.data;
        if (err.response.status === 400 && backendError.errors) {
          const fieldErrors: Record<string, string> = {};
          backendError.errors.forEach((error: any) => {
            fieldErrors[error.field] = error.message;
          });
          setErrors(fieldErrors);
          return;
        }
        if (err.response.status === 409) {
          errorMessage = 'An account with this email already exists';
        } else if (err.response.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = backendError?.message || errorMessage;
        }
      } else if (err.request) {
        errorMessage = 'Cannot connect to server. Please check your connection.';
      }

      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof RegisterRequest) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const displayError = errors.general;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4 sm:p-6">
      <Card padding="lg" variant="soft" className="w-full max-w-2xl">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-sm sm:text-base text-gray-600">Start orchestrating payments in minutes</p>
        </div>

        {displayError && (
          <InlineAlert variant="error" icon={AlertCircle}>{displayError}</InlineAlert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            <Input
              label="Business Name"
              name="businessName"
              id="businessName"
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName')(e.target.value)}
              placeholder="Acme Corp"
              required
              disabled={loading}
              error={errors.businessName}
              icon={Building}
            />
            <Input
              label="Email"
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email')(e.target.value)}
              placeholder="you@business.com"
              required
              disabled={loading}
              error={errors.email}
              icon={Mail}
            />
          </div>

          <Input
            label="Password"
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password')(e.target.value)}
            placeholder="Min. 8 characters"
            required
            disabled={loading}
            error={errors.password}
            icon={Lock}
          />

          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            <Select
              label="Business Type"
              name="businessType"
              id="businessType"
              value={formData.businessType}
              onChange={(e) => handleInputChange('businessType')(e.target.value)}
              options={[
                { value: '', label: 'Select type' },
                { value: 'E-commerce', label: 'E-commerce' },
                { value: 'SaaS', label: 'SaaS' },
                { value: 'Marketplace', label: 'Marketplace' },
                { value: 'Other', label: 'Other' }
              ]}
              required
              disabled={loading}
              error={errors.businessType}
            />

            <Input
              label="Country Code"
              name="businessCountry"
              id="businessCountry"
              value={formData.businessCountry}
              onChange={(e) => handleInputChange('businessCountry')(e.target.value)}
              placeholder="NG"
              required
              disabled={loading}
              error={errors.businessCountry}
              icon={MapPin}
            />
          </div>

          <Input
            label="Website URL (Optional)"
            type="url"
            name="websiteUrl"
            id="websiteUrl"
            value={formData.websiteUrl}
            onChange={(e) => handleInputChange('websiteUrl')(e.target.value)}
            placeholder="https://yourbusiness.com"
            disabled={loading}
            icon={Globe}
          />

          <Button type="submit" className="w-full" disabled={loading} loading={loading}>
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button 
              onClick={() => onNavigate('login')} 
              className="text-indigo-600 font-medium hover:underline disabled:opacity-50"
              disabled={loading}
            >
              Sign in
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};