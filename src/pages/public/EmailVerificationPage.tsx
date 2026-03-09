// src/pages/public/EmailVerificationPage.tsx
import React, { useState, useRef, useEffect, type KeyboardEvent, type ClipboardEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, AlertCircle, CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import paybridgeLogo from '../../assets/paybridge_logo.png';
import { Button, Card, Input } from '../../components/common';
import { InlineAlert } from '../../components/feedback/InlineAlert';
import { authService } from '../../services/authService';
import { getErrorMessage } from '../../utils/errorHandler';

interface LocationState {
  email?: string;
}

export const EmailVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const queryEmail = (new URLSearchParams(location.search).get('email') || '').trim();
  const storedEmail = (sessionStorage.getItem('paybridge:pendingVerificationEmail') || '').trim();
  const initialEmail = (state?.email || queryEmail || storedEmail || '').trim();

  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState(initialEmail);
  const [emailInput, setEmailInput] = useState(initialEmail);
  const [emailInputError, setEmailInputError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(600);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (email) {
      sessionStorage.setItem('paybridge:pendingVerificationEmail', email);
    }
  }, [email]);

  useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setError('Code expired. Request a new code to continue.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  useEffect(() => {
    if (!email) return;
    inputRefs.current[0]?.focus();
  }, [email]);

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (index === 5 && value) {
      const fullCode = [...newCode.slice(0, 5), value].join('');
      if (fullCode.length === 6) {
        handleVerify(fullCode);
      }
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();

    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setCode(digits);
      setError('');
      inputRefs.current[5]?.focus();
      setTimeout(() => handleVerify(pastedData), 100);
    }
  };

  const handleVerify = async (verificationCode?: string) => {
    if (!email) {
      setError('Enter your email to continue.');
      return;
    }

    const codeToVerify = verificationCode || code.join('');

    if (codeToVerify.length !== 6) {
      setError('Enter the 6-digit code.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await authService.verifyEmail(email, codeToVerify);
      sessionStorage.removeItem('paybridge:pendingVerificationEmail');
      setSuccess(true);

      setTimeout(() => {
        navigate('/login', {
          state: { message: 'Email verified successfully! Please log in.' }
        });
      }, 2000);
    } catch (err: unknown) {
      const message = getErrorMessage(err) || 'Unable to verify code. Try again.';
      if (message.includes('expired')) {
        setError('Code expired. Request a new code to continue.');
        setTimeRemaining(0);
      } else if (message.includes('Too many verification attempts')) {
        setError('Too many attempts. Request a new code to continue.');
      } else if (message.includes('Invalid verification code')) {
        setError('Code is invalid. Check it and try again.');
      } else if (message.includes('already verified')) {
        setError('Email already verified. Continue to sign in.');
      } else if (message.includes('No account found')) {
        setError('No account found for this email. Register to continue.');
      } else {
        setError(message);
      }

      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    if (!email) {
      setError('Enter your email to continue.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await authService.resendVerificationCode(email);
      setResendCooldown(60);
      setTimeRemaining(900);
      setCode(['', '', '', '', '', '']);
      setSuccessMessage('New code sent. Next: enter the latest code from your inbox.');
      inputRefs.current[0]?.focus();
    } catch (err: unknown) {
      setError(getErrorMessage(err) || 'Unable to resend code. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl"></div>
        </div>

        <Card
          padding="lg"
          variant="elevated"
          className="w-full max-w-md relative z-10 bg-white/98 backdrop-blur-xl border-white/60 shadow-2xl shadow-slate-900/10 text-center"
        >
          <img src={paybridgeLogo} alt="PayBridge" className="w-40 h-auto mb-4 mx-auto object-contain" />
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-emerald-600" size={32} />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2">
            Email Verified
          </h2>
          <p className="text-slate-600 mb-4">Your account is verified. Next: sign in to continue.</p>
          <p className="text-sm text-slate-500">Redirecting to login...</p>
        </Card>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl"></div>
        </div>

        <Card
          padding="lg"
          variant="elevated"
          className="w-full max-w-md relative z-10 bg-white/98 backdrop-blur-xl border-white/60 shadow-2xl shadow-slate-900/10"
        >
          <div className="text-center mb-6">
            <img src={paybridgeLogo} alt="PayBridge" className="w-40 h-auto mb-4 mx-auto object-contain" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2">
              Continue Email Verification
            </h1>
            <p className="text-slate-600 text-sm">Enter your registration email. Next: we will ask for your 6-digit code.</p>
          </div>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const value = emailInput.trim();
              if (!/\S+@\S+\.\S+/.test(value)) {
                setEmailInputError('Enter a valid email address.');
                return;
              }
              setEmail(value);
              setEmailInputError('');
              setError('');
            }}
          >
            <Input
              label="Email Address"
              type="email"
              value={emailInput}
              onChange={(e) => {
                setEmailInput(e.target.value);
                if (emailInputError) setEmailInputError('');
              }}
              error={emailInputError}
              placeholder="you@company.com"
              icon={Mail}
              autoComplete="email"
              required
            />
            <Button type="submit" className="w-full" size="lg">
              Continue
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <button
              onClick={() => navigate('/register')}
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded px-2 py-1"
            >
              <ArrowLeft size={14} />
              <span>Back to registration</span>
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
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
        <div className="text-center mb-8">
          <img src={paybridgeLogo} alt="PayBridge" className="w-44 h-auto mb-4 mx-auto object-contain" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2">
            Verify Your Email
          </h1>
          <p className="text-slate-600">Enter your 6-digit code to complete setup.</p>
          <p className="font-semibold text-slate-900 mt-1 break-all">{email}</p>
        </div>

        {timeRemaining > 0 && (
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center gap-2 text-blue-700">
            <Clock size={18} />
            <span className="text-sm font-medium">Code expires in {formatTime(timeRemaining)}</span>
          </div>
        )}

        {successMessage && (
          <InlineAlert variant="success" icon={CheckCircle} className="mb-6">
            {successMessage}
          </InlineAlert>
        )}

        {error && (
          <InlineAlert variant="error" icon={AlertCircle} className="mb-6">
            {error}
          </InlineAlert>
        )}

        <div className="mb-6">
          <label className="ui-field-label text-center mb-3">Verification Code</label>
          <div className="flex gap-2 justify-center">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                disabled={loading || timeRemaining <= 0}
                className={`
                  w-12 h-14 text-center text-xl font-semibold rounded-xl transition-all
                  ui-control
                  ${error ? 'ui-control-error' : ''}
                  ${digit ? 'border-blue-500 bg-blue-50/70' : ''}
                  disabled:opacity-60 disabled:cursor-not-allowed
                `}
                aria-label={`Verification code digit ${index + 1}`}
              />
            ))}
          </div>
          <p className="text-xs text-slate-500 text-center mt-2">Tip: paste the full 6-digit code into the first box.</p>
        </div>

        <Button
          onClick={() => handleVerify()}
          className="w-full mb-4"
          disabled={loading || code.join('').length !== 6 || timeRemaining <= 0}
          loading={loading}
          size="lg"
        >
          {loading ? 'Verifying...' : 'Verify Code'}
        </Button>

        <div className="text-center">
          <p className="text-sm text-slate-600 mb-2">Didn&apos;t receive a code?</p>
          <button
            onClick={handleResendCode}
            disabled={resendCooldown > 0 || loading}
            className={
              resendCooldown > 0 || loading
                ? 'text-sm font-semibold text-slate-400 cursor-not-allowed'
                : 'text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded px-1 py-0.5'
            }
          >
            {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend verification code'}
          </button>
          <p className="text-xs text-slate-500 mt-2">Next: use only the most recent code.</p>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <button
            onClick={() => navigate('/register')}
            className="text-sm text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded px-2 py-1"
            disabled={loading}
          >
            <ArrowLeft size={14} />
            <span>Back to registration</span>
          </button>
        </div>

        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
          <Mail className="w-4 h-4 text-blue-600" />
          <span>Email delivery may take up to 1 minute</span>
        </div>
      </Card>
    </div>
  );
};
