import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, KeyRound, Mail, ShieldCheck } from 'lucide-react';
import { Card, Button, Input } from '../../components/common';
import { InlineAlert } from '../../components/feedback/InlineAlert';
import { authService } from '../../services/authService';
import { getErrorMessage } from '../../utils/errorHandler';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [requestEmail, setRequestEmail] = useState('');

  const [resetData, setResetData] = useState({
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authService.forgotPassword(requestEmail);
      setSuccess(response.message || 'If your account exists, a reset code has been sent to your email.');
      setResetData((prev) => ({ ...prev, email: requestEmail }));
      setStep('reset');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authService.resetPassword(resetData);
      setSuccess(response.message || 'Password reset successfully.');
      setTimeout(() => {
        navigate('/login', {
          state: {
            message: 'Password reset successful. Please login with your new password.',
            email: resetData.email,
          },
        });
      }, 1500);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/40 to-blue-50/20 flex items-center justify-center p-4 sm:p-6">
      <Card padding="lg" variant="elevated" className="w-full max-w-md bg-white/95 backdrop-blur border-white/60 shadow-2xl shadow-slate-900/10">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <KeyRound className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Reset Password</h1>
          <p className="text-sm text-slate-600 mt-1">
            {step === 'request' ? 'Get a reset code via email' : 'Enter your reset code and new password'}
          </p>
        </div>

        {error && (
          <InlineAlert variant="error" icon={AlertCircle} className="mb-4 bg-red-50 border-red-300 text-red-800">
            {error}
          </InlineAlert>
        )}

        {success && (
          <InlineAlert variant="success" icon={CheckCircle} className="mb-4">
            {success}
          </InlineAlert>
        )}

        {step === 'request' ? (
          <form onSubmit={handleRequestCode} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={requestEmail}
              onChange={(e) => setRequestEmail(e.target.value)}
              placeholder="you@business.com"
              required
              disabled={loading}
              icon={Mail}
            />

            <Button type="submit" className="w-full" loading={loading} disabled={loading || !requestEmail.trim()}>
              Send Reset Code
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={resetData.email}
              onChange={(e) => setResetData((prev) => ({ ...prev, email: e.target.value }))}
              required
              disabled={loading}
              icon={Mail}
            />

            <Input
              label="Reset Code"
              value={resetData.code}
              onChange={(e) => setResetData((prev) => ({ ...prev, code: e.target.value }))}
              placeholder="6-digit code"
              required
              disabled={loading}
              icon={ShieldCheck}
            />

            <Input
              label="New Password"
              type="password"
              value={resetData.newPassword}
              onChange={(e) => setResetData((prev) => ({ ...prev, newPassword: e.target.value }))}
              placeholder="New strong password"
              required
              disabled={loading}
            />

            <Input
              label="Confirm New Password"
              type="password"
              value={resetData.confirmPassword}
              onChange={(e) => setResetData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="Re-enter new password"
              required
              disabled={loading}
            />

            <Button type="submit" className="w-full" loading={loading} disabled={loading}>
              Reset Password
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={loading}
              onClick={() => {
                setStep('request');
                setError('');
                setSuccess('');
              }}
            >
              Request New Code
            </Button>
          </form>
        )}

        <div className="mt-6 text-center text-sm">
          <button onClick={() => navigate('/login')} className="text-blue-600 hover:text-blue-700 font-semibold hover:underline" disabled={loading}>
            Back to Login
          </button>
        </div>
      </Card>
    </div>
  );
};
