'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { otpAuthService } from '@/lib/services/otpAuthService';
import OtpInput from '@/lib/components/OtpInput';
import CountdownTimer from '@/lib/components/CountdownTimer';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Email, 2: Verify OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Step 1: Send OTP
  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const data = await otpAuthService.sendOtp(email);
      if (data.success) {
        setMessage(data.message);
        setStep(2);
      } else {
        setError(data.message);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'Failed to send OTP. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validate OTP
    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);

    try {
      const data = await otpAuthService.verifyOtp(email, otp);
      
      if (data.success) {
        setMessage(data.message);
        setStep(3); // Move to password entry step
      } else {
        setError(data.message);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'Invalid or expired OTP. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password with verified OTP
  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validate password match
    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const data = await otpAuthService.resetPassword(
        email,
        otp,
        password,
        passwordConfirmation
      );
      
      if (data.success) {
        setMessage(data.message);
        setStep(4); // Move to success step
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError(data.message);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'Failed to reset password. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const data = await otpAuthService.sendOtp(email);
      if (data.success) {
        setMessage(data.message);
      } else {
        setError(data.message);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'Failed to resend OTP. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP expiration
  const handleOtpExpire = () => {
    setError('OTP has expired. Please request a new one.');
  };

  return (
    <div className="w-full space-y-8">
      {/* Step 1: Enter Email */}
      {step === 1 && (
        <>
          <div className="flex flex-col space-y-2 text-left">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Forgot Password?</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email to receive a verification code
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="h-12 w-full rounded-xl border border-border bg-gray-50/50 px-4 text-sm outline-none transition-all focus:border-[#0B3B2D] focus:ring-2 focus:ring-[#0B3B2D]/10 focus:bg-white placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-[#0B3B2D] text-white font-medium hover:bg-[#0B3B2D]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#0B3B2D]/20 mt-2 active:scale-[0.98]"
            >
              {loading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Remember your password?{' '}
            <Link href="/login" className="font-medium text-[#0B3B2D] hover:underline">
              Back to login
            </Link>
          </div>
        </>
      )}

      {/* Step 2: Verify OTP */}
      {step === 2 && (
        <>
          <div className="flex flex-col space-y-2 text-left">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Reset Password</h1>
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit code sent to <span className="font-semibold text-foreground">{email}</span>
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-600 text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Verification Code
              </label>
              <OtpInput
                length={6}
                value={otp}
                onChange={setOtp}
                disabled={loading}
              />
            </div>

            <CountdownTimer
              initialSeconds={300}
              onExpire={handleOtpExpire}
              onResend={handleResendOtp}
            />

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="h-12 w-full rounded-xl bg-[#0B3B2D] text-white font-medium hover:bg-[#0B3B2D]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#0B3B2D]/20 mt-2 active:scale-[0.98]"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm font-medium text-[#0B3B2D] hover:underline"
              >
                Change Email
              </button>
            </div>
          </form>
        </>
      )}

      {/* Step 3: Enter New Password */}
      {step === 3 && (
        <>
          <div className="flex flex-col space-y-2 text-left">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Create New Password</h1>
            <p className="text-sm text-muted-foreground">
              Enter your new password for <span className="font-semibold text-foreground">{email}</span>
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                  disabled={loading}
                  className="h-12 w-full rounded-xl border border-border bg-gray-50/50 px-4 pr-12 text-sm outline-none transition-all focus:border-[#0B3B2D] focus:ring-2 focus:ring-[#0B3B2D]/10 focus:bg-white placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="passwordConfirmation" className="text-sm font-medium text-foreground">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="passwordConfirmation"
                  type={showPasswordConfirmation ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  minLength={8}
                  required
                  disabled={loading}
                  className="h-12 w-full rounded-xl border border-border bg-gray-50/50 px-4 pr-12 text-sm outline-none transition-all focus:border-[#0B3B2D] focus:ring-2 focus:ring-[#0B3B2D]/10 focus:bg-white placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswordConfirmation ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-[#0B3B2D] text-white font-medium hover:bg-[#0B3B2D]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#0B3B2D]/20 mt-2 active:scale-[0.98]"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm font-medium text-[#0B3B2D] hover:underline"
              >
                Change Email
              </button>
            </div>
          </form>
        </>
      )}

      {/* Step 4: Success */}
      {step === 4 && (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">Password Reset Successful!</h2>
            <p className="text-sm text-muted-foreground">
              Your password has been reset successfully.
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecting to login page...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
