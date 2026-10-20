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