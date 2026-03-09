// src/pages/public/RegisterPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Building, Mail, Lock, Globe, Eye, EyeOff, ChevronDown, ChevronUp, CheckCircle2, Circle } from 'lucide-react';
import paybridgeLogo from '../../assets/paybridge_logo.png';
import { Button, Input, Select, Card } from '../../components/common';
import { InlineAlert } from '../../components/feedback/InlineAlert';
import { authService } from '../../services/authService';
import { getErrorMessage } from '../../utils/errorHandler';
import { ISO_COUNTRY_OPTIONS } from '../../constants/countries';

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
    businessCountry: '',
    websiteUrl: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showWebsiteField, setShowWebsiteField] = useState(false);

  const passwordChecks = {
    minLength: formData.password.length >= 8,
    hasLetter: /[A-Za-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
    hasSymbol: /[^A-Za-z0-9]/.test(formData.password)
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessName.trim()) newErrors.businessName = 'Enter your business name.';
    if (!formData.email.trim()) newErrors.email = 'Enter your email.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Enter a valid email address.';
    if (!formData.password) newErrors.password = 'Enter a password.';
    else if (!Object.values(passwordChecks).every(Boolean)) newErrors.password = 'Use a password that meets all requirements.';
    if (!formData.businessType) newErrors.businessType = 'Select your business type.';
    if (!formData.businessCountry.trim()) newErrors.businessCountry = 'Select your business country.';

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
      sessionStorage.setItem('paybridge:pendingVerificationEmail', formData.email);
      navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`, {
        state: { email: formData.email }
      });
    } catch (err: unknown) {
      setErrors({ general: getErrorMessage(err) || 'Unable to create account. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof RegisterRequest) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const displayError = errors.general;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-100/15 rounded-full blur-3xl"></div>
      </div>

      <Card
        padding="md"
        variant="elevated"
        className="w-full max-w-2xl relative z-10 bg-white/98 backdrop-blur-xl border-white/60 shadow-2xl shadow-slate-900/10"
      >
        <div className="text-center mb-6">
          <img src={paybridgeLogo} alt="PayBridge" className="w-36 h-auto mb-3 mx-auto object-contain" />
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2">
            Create Your Account
          </h1>
        </div>

        {displayError && (
          <InlineAlert variant="error" icon={AlertCircle} className="mb-6">
            {displayError}
          </InlineAlert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-3.5" noValidate>
          <div className="grid sm:grid-cols-2 gap-4">
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
              placeholder="you@company.com"
              required
              disabled={loading}
              error={errors.email}
              icon={Mail}
              autoComplete="email"
            />
          </div>

          <div>
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password')(e.target.value)}
              placeholder="Create a password"
              required
              disabled={loading}
              error={errors.password}
              icon={Lock}
              autoComplete="new-password"
              endAdornment={(
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-md p-1 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            />
            <div className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
              <div className={`flex items-center gap-1.5 ${passwordChecks.minLength ? 'text-emerald-700' : 'text-slate-500'}`}>
                {passwordChecks.minLength ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                <span>At least 8 characters</span>
              </div>
              <div className={`flex items-center gap-1.5 ${passwordChecks.hasLetter ? 'text-emerald-700' : 'text-slate-500'}`}>
                {passwordChecks.hasLetter ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                <span>One letter</span>
              </div>
              <div className={`flex items-center gap-1.5 ${passwordChecks.hasNumber ? 'text-emerald-700' : 'text-slate-500'}`}>
                {passwordChecks.hasNumber ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                <span>One number</span>
              </div>
              <div className={`flex items-center gap-1.5 ${passwordChecks.hasSymbol ? 'text-emerald-700' : 'text-slate-500'}`}>
                {passwordChecks.hasSymbol ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                <span>One symbol</span>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
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

            <Select
              label="Business Country"
              name="businessCountry"
              id="businessCountry"
              value={formData.businessCountry}
              onChange={(e) => handleInputChange('businessCountry')(e.target.value)}
              options={[
                { value: '', label: 'Select country' },
                ...ISO_COUNTRY_OPTIONS,
              ]}
              required
              disabled={loading}
              error={errors.businessCountry}
              hint="Used for compliance and payout routing."
              autoComplete="country"
            />
          </div>

          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowWebsiteField((prev) => !prev)}
              className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100/70 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              disabled={loading}
            >
              <span>Add website (optional)</span>
              {showWebsiteField ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showWebsiteField && (
              <div className="mt-3">
                <Input
                  label="Website URL"
                  type="url"
                  name="websiteUrl"
                  id="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={(e) => handleInputChange('websiteUrl')(e.target.value)}
                  placeholder="https://yourbusiness.com"
                  disabled={loading}
                  icon={Globe}
                  autoComplete="url"
                />
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading} loading={loading} size="lg">
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Already have access?</span>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => onNavigate('login')}
            className="text-slate-700 hover:text-blue-600 font-semibold transition-colors inline-flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-lg px-3 py-2"
            disabled={loading}
          >
            <span>Sign in to your account</span>
            <span className="text-blue-600 group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

      </Card>
    </div>
  );
};
