import { UserRoleEnum } from "./auth";

export interface Student {
  id: number | string;
  name: string;
  username: string;
  email: string;
  role: UserRoleEnum;
  isActive: boolean;
}

export interface ListStudentsParams {
  page?: number;
  limit?: number;
}

export interface CreateStudentRequest {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface UpdateStudentRequest {
  name: string;
  username: string;
  email: string;
  password?: string;
}
