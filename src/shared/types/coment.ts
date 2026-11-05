import { Post } from "./post";

export interface ComentAuthor {
  id: number;
  name: string;
}

export interface Coment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt?: string;
  post: Post;
  createdBy?: ComentAuthor | null;
  updatedBy?: ComentAuthor | null;
}

export interface CreateComentRequest {
  post: number;
  content: string;
}

export interface UpdateComentRequest {
  content: string;
}

export interface ListComentsParams {
  post: number;
  page?: number;
  limit?: number;
}
