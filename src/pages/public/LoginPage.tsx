import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GitMerge, AlertCircle, Mail, Lock } from 'lucide-react';
import { Button, Input, Card } from '../../components/common';
import { authService } from '../../services/authService';
import type { User } from '../../types/auth';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { user } = await authService.login(formData.email, formData.password);
      onLogin(user);

      // Navigate to appropriate dashboard based on role
      const target = user.userType === 'ADMIN' ? '/admin' : '/merchant';
      navigate(target);
    } catch (err: any) {
      if (err.response) {
        const status = err.response.status;
        if (status === 401 || status === 403) {
          setError('Invalid email or password');
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <GitMerge className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your PayBridge account</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle size={20} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
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
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="••••••••"
            required
            disabled={loading}
            autoComplete="current-password"
            icon={Lock}
          />

          <div className="flex items-center justify-between text-sm mb-4">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" className="rounded" />
              Remember me
            </label>
            <button
              type="button"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
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
            Don’t have an account?{' '}
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
