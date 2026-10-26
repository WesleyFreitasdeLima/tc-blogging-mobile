export type Role = 'ADMIN' | 'TEACHER';

export interface User {
  id: number | string;
  name: string;
  username: string;
  email: string;
  role: Role;
  isActive?: boolean;
  [key: string]: unknown;
}

export interface LoginRequest {
  login: string;
  password: string;
}

export interface LoginResponseData {
  accessToken: string;
  user?: User;
}