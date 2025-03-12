export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Grade {
  assessment: string;
  score: number;
  maxScore: number;
  weight: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  teacher: string;
  attendance: number;
  grade?: string;
  grades?: Grade[];
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: string;
  submissions?: number;
  description?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  type: 'academic' | 'cultural' | 'sports' | 'holiday';
}

export interface TimeSlot {
  id: string;
  day: string;
  time: string;
  subject: string;
  class: string;
  room: string;
}

export interface Test {
  id: string;
  title: string;
  subject: string;
  date: string;
  duration: string;
  totalMarks: number;
  class: string;
  status: 'scheduled' | 'ongoing' | 'completed';
}

export interface StudentSubmission {
  id: string;
  studentName: string;
  studentId: string;
  assignmentId: string;
  submissionDate: string;
  status: 'pending' | 'graded';
  grade?: string;
  feedback?: string;
}

export interface StudentData {
  id: string;
  name: string;
  email: string;
  class: string;
  rollNumber: string;
  attendance: number;
  performanceData: {
    subject: string;
    score: number;
  }[];
}

export interface TeacherData {
  id: string;
  name: string;
  email: string;
  department: string;
  subjects: string[];
  joinDate: string;
}

export interface ExamRoom {
  id: string;
  roomNumber: string;
  capacity: number;
  floor: string;
  building: string;
  status: 'available' | 'occupied' | 'maintenance';
}

export interface DepartmentStats {
  name: string;
  studentCount: number;
  teacherCount: number;
  averagePerformance: number;
}