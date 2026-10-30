import type { ApiResponse } from "@/shared/types/api";
import {
  UserRoleEnum,
  type LoginRequest,
  type LoginResponseData,
  type User,
} from "@/shared/types/auth";
import { api } from "./api";

type ApiUser = Omit<User, "role"> & { role: string };
type ApiLoginResponseData = Omit<LoginResponseData, "user"> & {
  user?: ApiUser;
};

function normalizeUser(user: ApiUser): User {
  const role = user.role;

  if (
    role !== UserRoleEnum.ADMIN &&
    role !== UserRoleEnum.TEACHER &&
    role !== UserRoleEnum.STUDENT
  ) {
    throw new Error("A API retornou um perfil de usuário inválido.");
  }

  return { ...user, role } as User;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponseData> {
    const response = await api.post<ApiResponse<ApiLoginResponseData>>(
      "/auth/login",
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
    const response = await api.get<ApiResponse<ApiUser>>("/users/me");
    return normalizeUser(response.data.data);
  },

  async updateMe(data: {
    name: string;
    username: string;
    email: string;
    password?: string;
  }): Promise<User> {
    const response = await api.put<ApiResponse<ApiUser>>("/users/me", data);
    return normalizeUser(response.data.data);
  },

  async deleteMe(): Promise<void> {
    await api.delete("/users/me");
  },
};

export const loginService = authService;
