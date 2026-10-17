import type { ApiResponse } from '@/shared/types/api';
import type {
  LoginRequest,
  LoginResponseData,
  User,
} from '@/shared/types/auth';
import { api } from './api';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponseData> {
    const response = await api.post<ApiResponse<LoginResponseData>>(
      '/auth/login',
      credentials,
    );
    return response.data.data;
  },

  async getMe(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/users/me');
    return response.data.data;
  },
};

export const loginService = authService;
