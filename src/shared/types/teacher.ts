export interface Teacher {
  id: number | string;
  name: string;
  username: string;
  email: string;
  role: 'teacher';
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