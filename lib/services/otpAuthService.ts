import api from '@/lib/api/axios';

const API_BASE = '/api/auth';

export interface SendOtpResponse {
  success: boolean;
  message: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export const otpAuthService = {
  // Send OTP to email
  sendOtp: async (email: string): Promise<SendOtpResponse> => {
    const response = await api.post(`${API_BASE}/send-otp`, { email });
    return response.data;
  },

  // Send Registration OTP
  sendRegistrationOtp: async (email: string): Promise<SendOtpResponse> => {
    const response = await api.post(`${API_BASE}/send-registration-otp`, { email });
    return response.data;
  },

  // Verify OTP code (optional step)
  verifyOtp: async (email: string, otp: string): Promise<VerifyOtpResponse> => {
    const response = await api.post(`${API_BASE}/verify-otp`, { email, otp });
    return response.data;
  },

  // Reset password with OTP
  resetPassword: async (
    email: string,
    otp: string,
    password: string,
    passwordConfirmation: string
  ): Promise<ResetPasswordResponse> => {
    const response = await api.post(`${API_BASE}/reset-password-otp`, {
      email,
      otp,
      password,
      password_confirmation: passwordConfirmation,
    });
    return response.data;
  },
};
