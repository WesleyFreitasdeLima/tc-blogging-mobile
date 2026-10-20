import type { ApiResponse } from '@/shared/types/api';
import type {
  LoginRequest,
  LoginResponseData,
  User,
} from '@/shared/types/auth';
import { api } from './api';

type ApiUser = Omit<User, 'role'> & { role: string };
type ApiLoginResponseData = Omit<LoginResponseData, 'user'> & {
  user?: ApiUser;
};

function normalizeUser(user: ApiUser): User {
  const role = user.role.toUpperCase();

  if (role !== 'ADMIN' && role !== 'TEACHER') {
    throw new Error('A API retornou um perfil de usuário inválido.');
  }

  return { ...user, role } as User;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponseData> {
    const response = await api.post<ApiResponse<ApiLoginResponseData>>(
      '/auth/login',
      credentials,
    );
    return {
      ...response.data.data,
      user: response.data.data.user
        ? normalizeUser(response.data.data.user)
        : undefined,
    };
  },

  async getMe(): Promise<User> {
    const response = await api.get<ApiResponse<ApiUser>>('/users/me');
    return normalizeUser(response.data.data);
  },
};

export const loginService = authService;
