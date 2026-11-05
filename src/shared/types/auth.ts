export enum UserRoleEnum {
  STUDENT = "student",
  TEACHER = "teacher",
  ADMIN = "admin",
}

export interface User {
  id: number | string;
  name: string;
  username: string;
  email: string;
  role: UserRoleEnum;
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
