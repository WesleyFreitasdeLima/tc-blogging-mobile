export interface PostAuthor {
  id: number
  name: string
}

export interface Post {
  id: number
  title: string
  content: string
  createdAt: string
  updatedAt?: string
  isActive: boolean
  createdBy?: PostAuthor | null
  updatedBy?: PostAuthor | null
}

export interface CreatePostRequest {
  title: string
  content: string
}

export interface UpdatePostRequest {
  title: string
  content: string
}

export interface ListPostsParams {
  page?: number
  limit?: number
}

export interface SearchPostsParams {
  search: string
  page?: number
  limit?: number
}