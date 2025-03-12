export type UserRole = 'student' | 'faculty' | 'admin';

export interface User {
  id: number;
  email: string;
  role: UserRole;
}