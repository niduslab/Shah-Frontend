import api from '../api/axios';
import axios from 'axios';

import { API_ORIGIN } from '@/lib/config/api';
interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  password: string;
  password_confirmation: string;
}

interface LoginResponse {
  message: string;
  data: {
    user: User;
  };
}

interface User {
  id: number;
  first_name?: string;
  last_name?: string;
  name?: string;
  email: string;
  phone?: string;
  user_type?: string;
  email_verified_at: string | null;
  status?: boolean;
  created_at: string;
  updated_at: string;
  role_names?: string[];
  permission_names?: string[];
}

interface ProfileUpdateData {
  name?: string;
  email?: string;
}

interface PasswordChangeData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

const API_URL = API_ORIGIN;

const authService = {
  // Get CSRF cookie before login/register - use raw axios to avoid interceptor
  async getCsrfCookie() {
    await axios.get(`${API_URL}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
    // Wait a bit for cookie to be properly set
    await new Promise(resolve => setTimeout(resolve, 100));
  },

  // Register
  async register(data: RegisterData) {
    await this.getCsrfCookie();
    const response = await api.post<LoginResponse>('/api/auth/register', data);
    return response.data;
  },

  // Login
  async login(email: string, password: string) {
    // Get CSRF cookie first
    await this.getCsrfCookie();
    
    // Make the login request
    const response = await api.post<LoginResponse>('/api/auth/login', { email, password });
    return response.data;
  },

  // Logout
  async logout() {
    try {
      // Get fresh CSRF cookie before logout
      await this.getCsrfCookie();
      const response = await api.post('/api/auth/logout');
      return response.data;
    } catch (error) {
      // If logout fails, still clear local state
      console.error('Logout API error:', error);
      throw error;
    }
  },

  // Get authenticated user
  async getUser() {
    const response = await api.get<{ data: User }>('/api/auth/user');
    return response.data;
  },

  // Update profile
  async updateProfile(data: ProfileUpdateData) {
    await this.getCsrfCookie();
    const response = await api.put('/api/auth/profile', data);
    return response.data;
  },

  // Change password
  async changePassword(data: PasswordChangeData) {
    await this.getCsrfCookie();
    const response = await api.put('/api/auth/password', data);
    return response.data;
  },
};

export default authService;
export type { User, RegisterData, LoginResponse, ProfileUpdateData, PasswordChangeData };
