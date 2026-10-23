import type { ApiResponse } from '@/shared/types/api';
import type {
    CreateTeacherRequest,
    Teacher,
    UpdateTeacherRequest,
} from '@/shared/types/teacher';
import { api } from './api';

interface ApiUser extends Omit<Teacher, 'role'> {
  role: string;
}

const API_PAGE_SIZE = 100;

export const teachersService = {
  async getAll(): Promise<Teacher[]> {
    const teachers: Teacher[] = [];
    let page = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      const response = await api.get<ApiResponse<ApiUser[]>>('/users', {
        params: { page, limit: API_PAGE_SIZE },
      });
      const users = response.data.data ?? [];

      teachers.push(
        ...users
          .filter((user) => user.role.toLowerCase() === 'teacher')
          .map((user) => ({ ...user, role: 'teacher' as const })),
      );

      hasMorePages = users.length === API_PAGE_SIZE;
      page += 1;
    }

    return teachers;
  },

  async create(data: CreateTeacherRequest): Promise<Teacher> {
    const response = await api.post<ApiResponse<ApiUser>>('/users', {
      ...data,
      role: 'teacher',
    });

    return { ...response.data.data, role: 'teacher' };
  },

  async getById(id: number | string): Promise<Teacher> {
    const response = await api.get<ApiResponse<ApiUser>>(`/users/${id}`);
    const user = response.data.data;

    if (user.role.toLowerCase() !== 'teacher') {
      throw new Error('O usuário solicitado não é um professor.');
    }

    return { ...user, role: 'teacher' };
  },

  async update(
    id: number | string,
    data: UpdateTeacherRequest,
  ): Promise<Teacher> {
    const response = await api.put<ApiResponse<ApiUser>>(`/users/${id}`, data);
    return { ...response.data.data, role: 'teacher' };
  },

  async delete(id: number | string): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};