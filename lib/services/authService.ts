import api from '../api/axios';

interface RegisterData {
  name: string;
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

const authService = {
  // Get CSRF cookie before login/register
  async getCsrfCookie() {
    await api.get('/sanctum/csrf-cookie');
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
    const response = await api.post('/api/auth/logout');
    return response.data;
  },

  // Get authenticated user
  async getUser() {
    const response = await api.get<{ data: User }>('/api/auth/user');
    return response.data;
  },

  // Update profile
  async updateProfile(data: ProfileUpdateData) {
    const response = await api.put('/api/auth/profile', data);
    return response.data;
  },

  // Change password
  async changePassword(data: PasswordChangeData) {
    const response = await api.put('/api/auth/password', data);
    return response.data;
  },
};

export default authService;
export type { User, RegisterData, LoginResponse, ProfileUpdateData, PasswordChangeData };
