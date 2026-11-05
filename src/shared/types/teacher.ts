import { UserRoleEnum } from "./auth";

export interface Teacher {
  id: number | string;
  name: string;
  username: string;
  email: string;
  role: UserRoleEnum;
  isActive: boolean;
}

export interface ListTeachersParams {
  page?: number;
  limit?: number;
}

export interface CreateTeacherRequest {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface UpdateTeacherRequest {
  name: string;
  username: string;
  email: string;
  password?: string;
}