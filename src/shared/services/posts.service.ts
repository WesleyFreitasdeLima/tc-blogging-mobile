import type { ApiResponse } from '@/shared/types/api';
import type {
  CreatePostRequest,
  ListPostsParams,
  Post,
  SearchPostsParams,
  UpdatePostRequest,
} from '@/shared/types/post';
import { api } from './api';

export const postsService = {
  async getAll(params?: ListPostsParams): Promise<Post[]> {
    const response = await api.get<ApiResponse<Post[]>>('/posts', {
      params,
    });
    return response.data.data;
  },

  async search(params: SearchPostsParams): Promise<Post[]> {
    const response = await api.get<ApiResponse<Post[]>>('/posts/search', {
      params,
    });
    return response.data.data;
  },

  async getById(id: number | string): Promise<Post> {
    const response = await api.get<ApiResponse<Post>>(`/posts/${id}`);
    return response.data.data;
  },

  async create(data: CreatePostRequest): Promise<Post> {
    const response = await api.post<ApiResponse<Post>>('/posts', data);
    return response.data.data;
  },

  async update(
    id: number | string,
    data: Partial<UpdatePostRequest> & { isActive?: boolean },
  ): Promise<Post> {
    const response = await api.put<ApiResponse<Post>>(`/posts/${id}`, data);
    return response.data.data;
  },
  
  async delete(id: number | string): Promise<void> {
    await api.delete(`/posts/${id}`);
  },
};
