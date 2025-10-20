// src/pages/public/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GitMerge, AlertCircle, Mail, Lock, CheckCircle } from 'lucide-react';
import { Button, Input, Card } from '../../components/common';
import { InlineAlert } from '../../components/feedback/InlineAlert';
import { authService } from '../../services/authService';
import type { User } from '../../types/auth';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { message?: string };
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(state?.message || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user } = await authService.login(formData.email, formData.password);
      onLogin(user);

      const target = user.userType === 'ADMIN' ? '/admin' : '/merchant';
      navigate(target);
    } catch (err: any) {
      if (err.response) {
        const status = err.response.status;
        if (status === 401 || status === 403) {
          const message = err.response.data?.message || '';
          
          if (message.toLowerCase().includes('verify') || message.toLowerCase().includes('verification')) {
            setError('Please verify your email before logging in.');
            setTimeout(() => {
              navigate('/verify-email', { 
                state: { email: formData.email }
              });
            }, 2000);
          } else {
            setError('Invalid email or password');
          }
        } else if (status === 500) {
          setError('Server error. Please try again later');
        } else {
          setError(err.response.data?.message || 'Login failed');
        }
      } else if (err.request) {
        setError('Cannot connect to server. Please check your connection');
      } else {
        setError(err.message || 'An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4 sm:p-6">
      <Card padding="lg" variant="soft" interactive className="w-full max-w-md sm:max-w-lg">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg ring-1 ring-black/5">
            <GitMerge className="text-white" size={28} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-sm sm:text-base text-gray-600">Sign in to your PayBridge account</p>
        </div>

        {/* Success message */}
        {successMessage && (
          <InlineAlert variant="success" icon={CheckCircle}>
            {successMessage}
          </InlineAlert>
        )}

        {/* Error message */}
        {error && (
          <InlineAlert variant="error" icon={AlertCircle}>
            {error}
          </InlineAlert>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            label="Email"
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="you@example.com"
            required
            disabled={loading}
            autoComplete="email"
            icon={Mail}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="••••••••"
            required
            disabled={loading}
            autoComplete="current-password"
            icon={Lock}
          />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm mb-2 pt-1">
            <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
              <input type="checkbox" className="rounded w-4 h-4" />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              className="text-indigo-600 hover:text-indigo-700 font-medium text-left sm:text-right"
            >
              Forgot password?
            </button>
          </div>
          <Button type="submit" className="w-full" loading={loading} disabled={loading}>
            Sign In
          </Button>
        </form>

        {/* Signup link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-indigo-600 font-medium hover:underline"
              disabled={loading}
            >
              Sign up
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};