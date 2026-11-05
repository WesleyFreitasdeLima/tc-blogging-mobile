import type { ApiResponse } from "@/shared/types/api";
import type {
  CreateStudentRequest,
  Student,
  UpdateStudentRequest,
} from "@/shared/types/student";
import { UserRoleEnum } from "../types/auth";
import { api } from "./api";

interface ApiUser extends Omit<Student, "role"> {
  role: string;
}

const API_PAGE_SIZE = 100;

export const studentsService = {
  async getAll(): Promise<Student[]> {
    const students: Student[] = [];
    let page = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      const response = await api.get<ApiResponse<ApiUser[]>>("/users", {
        params: { page, limit: API_PAGE_SIZE, role: UserRoleEnum.STUDENT },
      });
      const users = response.data.data ?? [];

      students.push(
        ...users
          .filter((user) => user.role === UserRoleEnum.STUDENT)
          .map((user) => ({ ...user, role: UserRoleEnum.STUDENT as const })),
      );

      hasMorePages = users.length === API_PAGE_SIZE;
      page += 1;
    }

    return students;
  },

  async create(data: CreateStudentRequest): Promise<Student> {
    const response = await api.post<ApiResponse<ApiUser>>("/users", {
      ...data,
      role: UserRoleEnum.STUDENT,
    });

    return { ...response.data.data, role: UserRoleEnum.STUDENT };
  },

  async getById(id: number | string): Promise<Student> {
    const response = await api.get<ApiResponse<ApiUser>>(`/users/${id}`);
    const user = response.data.data;

    if (user.role !== UserRoleEnum.STUDENT) {
      throw new Error("O usuário solicitado não é um aluno.");
    }

    return { ...user, role: UserRoleEnum.STUDENT };
  },

  async update(
    id: number | string,
    data: UpdateStudentRequest,
  ): Promise<Student> {
    const response = await api.put<ApiResponse<ApiUser>>(`/users/${id}`, data);
    return { ...response.data.data, role: UserRoleEnum.STUDENT };
  },

  async delete(id: number | string): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};
