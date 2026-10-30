import type { ApiResponse } from "@/shared/types/api";
import type {
  Coment,
  CreateComentRequest,
  ListComentsParams,
  UpdateComentRequest,
} from "@/shared/types/coment";
import { api } from "./api";

export const comentsService = {
  async getAll(params?: ListComentsParams): Promise<Coment[]> {
    const response = await api.get<ApiResponse<Coment[]>>("/coments", {
      params,
    });
    return response.data.data;
  },

  async getById(id: number | string): Promise<Coment> {
    const response = await api.get<ApiResponse<Coment>>(`/coments/${id}`);
    return response.data.data;
  },

  async create(data: CreateComentRequest): Promise<Coment> {
    const response = await api.post<ApiResponse<Coment>>("/coments", data);
    return response.data.data;
  },

  async update(
    id: number | string,
    data: Partial<UpdateComentRequest>
  ): Promise<Coment> {
    const response = await api.put<ApiResponse<Coment>>(`/coments/${id}`, data);
    return response.data.data;
  },

  async delete(id: number | string): Promise<void> {
    await api.delete(`/coments/${id}`);
  },
};
