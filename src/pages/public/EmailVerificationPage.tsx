// src/pages/public/EmailVerificationPage.tsx
import React, { useState, useRef, useEffect, type KeyboardEvent, type ClipboardEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { InlineAlert } from '../../components/feedback/InlineAlert';
import { authService } from '../../services/authService';

interface LocationState {
  email?: string;
}

export const EmailVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const email = state?.email || '';

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  // Timer for code expiration
  useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setError('Verification code has expired. Please request a new one.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  // Cooldown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
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
    
    // Only process if it's 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setCode(digits);
      inputRefs.current[5]?.focus();
      
      // Auto-submit
      setTimeout(() => handleVerify(pastedData), 100);
    }
  };

  const handleVerify = async (verificationCode?: string) => {
    const codeToVerify = verificationCode || code.join('');
    
    if (codeToVerify.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.verifyEmail(email, codeToVerify);
      setSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login', { 
          state: { message: 'Email verified successfully! Please log in.' }
        });
      }, 2000);
    } catch (err: any) {
      if (err.response) {
        const message = err.response.data?.message || 'Verification failed';
        
        // Check the actual message content instead of status codes
        if (message.includes('expired')) {
          setError('Verification code has expired. Please request a new one.');
          setTimeRemaining(0);
        } else if (message.includes('Too many verification attempts')) {
          setError('Too many attempts. Please request a new code.');
        } else if (message.includes('Invalid verification code')) {
          setError('Invalid verification code. Please try again.');
        } else if (message.includes('already verified')) {
          setError('Email is already verified. Please log in.');
        } else if (message.includes('No account found')) {
          setError('No account found with this email. Please register again.');
        } else {
          setError(message);
        }
      } else {
        setError('Cannot connect to server. Please check your connection.');
      }
      
      // Clear the code on error
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    setLoading(true);
    setError('');

    try {
      await authService.resendVerificationCode(email);
      setResendCooldown(60); // 1 minute cooldown
      setTimeRemaining(900); // Reset to 15 minutes
      setCode(['', '', '', '', '', '']);
      
      // Show success message
      setError(''); // Clear any errors
      const successMessage = 'New verification code sent! Check your email.';
      setError(successMessage); // Using error state for success message temporarily
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        if (error === successMessage) {
          setError('');
        }
      }, 3000);
      
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 429) {
        setError('Too many requests. Please wait before requesting another code.');
      } else if (err.response?.status === 400) {
        setError(err.response.data?.message || 'Failed to resend code. Please try again.');
      } else {
        setError('Failed to resend code. Please try again.');
      }
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
          <p className="text-gray-600 mb-4">Your email has been successfully verified.</p>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Mail className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
          <p className="text-gray-600">
            We've sent a 6-digit code to
          </p>
          <p className="font-semibold text-gray-900 mt-1">{email}</p>
        </div>

        {/* Timer */}
        {timeRemaining > 0 && (
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center gap-2 text-blue-700">
            <Clock size={18} />
            <span className="text-sm font-medium">
              Code expires in {formatTime(timeRemaining)}
            </span>
          </div>
        )}

        {/* Error/Success Message */}
        {error && (
          error.includes('sent!') ? (
            <InlineAlert variant="success" icon={CheckCircle} className="mb-6">{error}</InlineAlert>
          ) : (
            <InlineAlert variant="error" icon={AlertCircle} className="mb-6">{error}</InlineAlert>
          )
        )}

        {/* Code Input Boxes */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
            Enter Verification Code
          </label>
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
                className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg transition-all
                  ${digit ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'}
                  ${error && !error.includes('sent!') ? 'border-red-500' : ''}
                  focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 focus:outline-none
                  disabled:bg-gray-100 disabled:cursor-not-allowed
                `}
              />
            ))}
          </div>
        </div>

        {/* Verify Button */}
        <Button
          onClick={() => handleVerify()}
          className="w-full mb-4"
          disabled={loading || code.join('').length !== 6 || timeRemaining <= 0}
          loading={loading}
        >
          Verify Email
        </Button>

        {/* Resend Code */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            Didn't receive the code?
          </p>
          <button
            onClick={handleResendCode}
            disabled={resendCooldown > 0 || loading}
            className={`text-sm font-medium transition-colors
              ${resendCooldown > 0 || loading
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-indigo-600 hover:text-indigo-700 hover:underline'
              }
            `}
          >
            {resendCooldown > 0
              ? `Resend code in ${resendCooldown}s`
              : 'Resend verification code'
            }
          </button>
        </div>

        {/* Back to Register */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <button
            onClick={() => navigate('/register')}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            disabled={loading}
          >
            ← Back to registration
          </button>
        </div>
      </Card>
    </div>
  );
};