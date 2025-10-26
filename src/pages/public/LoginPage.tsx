// src/pages/public/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle, Mail, Lock, CheckCircle } from 'lucide-react';
import paybridgeLogo from '../../assets/paybridge_logo.png';
import { Button, Input, Card } from '../../components/common';
import { InlineAlert } from '../../components/feedback/InlineAlert';
import { useAuth } from '../../contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { message?: string };
  const { login, user, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(state?.message || '');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
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
      await login(formData.email, formData.password);
      // Navigation will be handled by the useEffect above
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
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
          <img src={paybridgeLogo} alt="PayBridge" className="w-16 h-16 mb-4 mx-auto" />
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
          <InlineAlert variant="error" icon={AlertCircle} className="mb-6 text-red-500">
            {error}
          </InlineAlert>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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
          />

          <Input
            label="Password"
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Enter your password"
            required
            disabled={loading}
            autoComplete="current-password"
            icon={Lock}
          />

          <div className="flex items-center justify-between text-sm pt-1">
            <label className="flex items-center gap-2 text-gray-700 cursor-pointer group">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0 transition-all cursor-pointer" 
              />
              <span className="group-hover:text-gray-900 transition-colors">Remember me</span>
            </label>
            <button
              type="button"
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
            Sign In
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