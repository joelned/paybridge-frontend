// src/pages/public/LoginPage.tsx
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle, Mail, Lock, CheckCircle, Eye, EyeOff } from 'lucide-react';
import paybridgeLogo from '../../assets/paybridge_logo.png';
import { Button, Input, Card } from '../../components/common';
import { InlineAlert } from '../../components/feedback/InlineAlert';
import { useAuth } from '../../contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { message?: string; email?: string };
  const { login, user, isAuthenticated } = useAuth();

  // Initialize email from state or localStorage (Remember Me)
  const [formData, setFormData] = useState({
    email: state?.email || localStorage.getItem('remembered_email') || '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(() => !!localStorage.getItem('remembered_email'));
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(state?.message || '');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Use useLayoutEffect to prevent flash of login content if already authenticated
  useLayoutEffect(() => {
    if (isAuthenticated && user) {
      const target = user.userType === 'ADMIN' ? '/admin/overview' : '/merchant/overview';
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Handle Remember Me logic
      if (rememberMe) {
        localStorage.setItem('remembered_email', formData.email);
      } else {
        localStorage.removeItem('remembered_email');
      }

      await login(formData.email, formData.password);
      // Navigation will be handled by the useLayoutEffect above
    } catch (err: unknown) {
      // Display the exact error message from backend
      const errorMessage =
        err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      setError(errorMessage);

      // Handle specific cases for better UX
      if (errorMessage.toLowerCase().includes('verify') ||
        errorMessage.toLowerCase().includes('verification')) {
        sessionStorage.setItem('paybridge:pendingVerificationEmail', formData.email);
        setTimeout(() => {
          navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`, {
            state: { email: formData.email }
          });
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  // If authenticated, render nothing while redirecting (avoids flash)
  if (isAuthenticated && user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 flex items-center justify-center p-4 sm:p-6 relative overflow-x-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-100/15 rounded-full blur-3xl"></div>
      </div>

      <Card
        padding="lg"
        variant="elevated"
        className="w-full max-w-md relative z-10 bg-white/98 backdrop-blur-xl border-white/60 shadow-2xl shadow-slate-900/10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <img src={paybridgeLogo} alt="PayBridge" className="w-44 h-auto mb-4 mx-auto object-contain" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-600">Sign in to your PayBridge account</p>
        </div>
        {/* Success message */}
        {successMessage && (
          <InlineAlert variant="success" icon={CheckCircle} className="mb-6">
            {successMessage}
          </InlineAlert>
        )}

        {/* Error message */}
        {error && (
          <div role="alert" aria-live="polite">
            <InlineAlert variant="error" icon={AlertCircle} className="mb-6 text-red-500">
              {error}
            </InlineAlert>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <Input
            label="Email Address"
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="you@company.com"
            required
            disabled={loading}
            autoComplete="email"
            icon={Mail}
            error={error && error.toLowerCase().includes('email') ? 'Please check your email' : undefined}
          />

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            id="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Enter your password"
            required
            disabled={loading}
            autoComplete="current-password"
            icon={Lock}
            endAdornment={(
              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                className="text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-md p-1 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
            error={error && error.toLowerCase().includes('password') ? 'Please check your password' : undefined}
          />

          <div className="flex items-center justify-between text-sm pt-1">
            <label className="flex items-center gap-2 text-gray-700 cursor-pointer group select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0 transition-all cursor-pointer"
              />
              <span className="group-hover:text-gray-900 transition-colors">Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')} 
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded px-1 py-0.5"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            className="w-full"
            loading={loading}
            disabled={loading}
            size="lg"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">New to PayBridge?</span>
          </div>
        </div>

        {/* Signup link */}
        <div className="text-center">
          <button
            onClick={() => navigate('/register')}
            className="text-slate-700 hover:text-blue-600 font-semibold transition-colors inline-flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-lg px-3 py-2"
            disabled={loading}
          >
            <span>Create an account</span>
            <span className="text-blue-600 group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        {/* Security badge */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
          <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
          </svg>
          <span>Secured with enterprise-grade encryption</span>
        </div>
      </Card>
    </div>
  );
};
