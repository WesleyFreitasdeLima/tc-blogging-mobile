import type { ApiResponse } from '@/shared/types/api';
import type { Teacher } from '@/shared/types/teacher';
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
};