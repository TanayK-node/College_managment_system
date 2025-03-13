import React, { useState } from 'react';
import axios from 'axios';
import { User, StudentData, TeacherData, ExamRoom, DepartmentStats } from '../../types';
import {
  Settings,
  LogOut,
  Users,
  GraduationCap,
  School,
  BookOpen,
  BarChart3,
  Calendar,
  PlusCircle,
  Edit,
  Trash2,
  X,
} from 'lucide-react';
import { format } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [generating, setGenerating] = useState(false);
  const [timetableGenerated, setTimetableGenerated] = useState(false);
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [timetable, setTimetable] = useState<string[][] | null>(null);
  const [error, setError] = useState('');

  // State for modal windows
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  // State for student form
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    class: '',
    rollNumber: '',
  });

  // State for teacher form
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    department: '',
    subjects: '',
  });

  // State for exam scheduling form
  const [newExam, setNewExam] = useState({
    subject: '',
    date: '',
    startTime: '',
    endTime: '',
    roomId: '',
  });

  // State for room scheduling form
  const [roomSchedule, setRoomSchedule] = useState({
    purpose: '',
    date: '',
    startTime: '',
    endTime: '',
    notes: '',
  });

  // State for edit actions
  const [editId, setEditId] = useState('');

  // Mock data for original dashboard
  const [students, setStudents] = useState<StudentData[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      class: 'X-A',
      rollNumber: '2024001',
      attendance: 92,
      performanceData: [
        { subject: 'Mathematics', score: 85 },
        { subject: 'Physics', score: 78 },
        { subject: 'Chemistry', score: 92 },
      ],
    },
  ]);

  const [teachers, setTeachers] = useState<TeacherData[]>([
    {
      id: '1',
      name: 'Dr. Sarah Wilson',
      email: 'sarah@example.com',
      department: 'Mathematics',
      subjects: ['Calculus', 'Linear Algebra'],
      joinDate: '2022-08-15',
    },
  ]);

  const [examRooms, setExamRooms] = useState<ExamRoom[]>([
    {
      id: '1',
      roomNumber: '101',
      capacity: 40,
      floor: '1st',
      building: 'Main Block',
      status: 'available',
    },
  ]);

  const departmentStats: DepartmentStats[] = [
    { name: 'Mathematics', studentCount: 150, teacherCount: 8, averagePerformance: 82 },
    { name: 'Physics', studentCount: 120, teacherCount: 6, averagePerformance: 78 },
    { name: 'Chemistry', studentCount: 130, teacherCount: 7, averagePerformance: 85 },
  ];

  // Open modal handlers
  const openAddStudentModal = () => {
    setModalType('addStudent');
    setModalTitle('Add New Student');
    setNewStudent({
      name: '',
      email: '',
      class: '',
      rollNumber: '',
    });
    setShowModal(true);
  };

  const openAddTeacherModal = () => {
    setModalType('addTeacher');
    setModalTitle('Add New Teacher');
    setNewTeacher({
      name: '',
      email: '',
      department: '',
      subjects: '',
    });
    setShowModal(true);
  };

  const openScheduleExamModal = () => {
    setModalType('scheduleExam');
    setModalTitle('Schedule Exam');
    setNewExam({
      subject: '',
      date: '',
      startTime: '',
      endTime: '',
      roomId: '',
    });
    setShowModal(true);
  };

  const openScheduleRoomModal = (roomId: string) => {
    setModalType('scheduleRoom');
    setModalTitle('Schedule Room');
    setEditId(roomId);
    setRoomSchedule({
      purpose: '',
      date: '',
      startTime: '',
      endTime: '',
      notes: '',
    });
    setShowModal(true);
  };

  const openEditStudentModal = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (student) {
      setModalType('editStudent');
      setModalTitle('Edit Student');
      setEditId(studentId);
      setNewStudent({
        name: student.name,
        email: student.email,
        class: student.class,
        rollNumber: student.rollNumber,
      });
      setShowModal(true);
    }
  };

  const openEditTeacherModal = (teacherId: string) => {
    const teacher = teachers.find((t) => t.id === teacherId);
    if (teacher) {
      setModalType('editTeacher');
      setModalTitle('Edit Teacher');
      setEditId(teacherId);
      setNewTeacher({
        name: teacher.name,
        email: teacher.email,
        department: teacher.department,
        subjects: teacher.subjects.join(', '),
      });
      setShowModal(true);
    }
  };

  const openEditRoomModal = (roomId: string) => {
    const room = examRooms.find((r) => r.id === roomId);
    if (room) {
      setModalType('editRoom');
      setModalTitle('Edit Room');
      setEditId(roomId);
      setShowModal(true);
    }
  };

  // Form change handlers
  const handleStudentFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTeacherFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTeacher((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExamFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewExam((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoomScheduleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRoomSchedule((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Form submit handlers
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = (students.length + 1).toString();
    const newStudentObj: StudentData = {
      id: newId,
      name: newStudent.name,
      email: newStudent.email,
      class: newStudent.class,
      rollNumber: newStudent.rollNumber,
      attendance: Math.floor(Math.random() * 30) + 70,
      performanceData: [
        { subject: 'Mathematics', score: Math.floor(Math.random() * 30) + 70 },
        { subject: 'Physics', score: Math.floor(Math.random() * 30) + 70 },
        { subject: 'Chemistry', score: Math.floor(Math.random() * 30) + 70 },
      ],
    };
    setStudents([...students, newStudentObj]);
    setShowModal(false);
    alert('Student added successfully!');
  };

  const handleEditStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedStudents = students.map((student) => {
      if (student.id === editId) {
        return {
          ...student,
          name: newStudent.name,
          email: newStudent.email,
          class: newStudent.class,
          rollNumber: newStudent.rollNumber,
        };
      }
      return student;
    });
    setStudents(updatedStudents);
    setShowModal(false);
    alert('Student updated successfully!');
  };

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = (teachers.length + 1).toString();
    const newTeacherObj: TeacherData = {
      id: newId,
      name: newTeacher.name,
      email: newTeacher.email,
      department: newTeacher.department,
      subjects: newTeacher.subjects.split(',').map((subject) => subject.trim()),
      joinDate: new Date().toISOString().split('T')[0],
    };
    setTeachers([...teachers, newTeacherObj]);
    setShowModal(false);
    alert('Teacher added successfully!');
  };

  const handleEditTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTeachers = teachers.map((teacher) => {
      if (teacher.id === editId) {
        return {
          ...teacher,
          name: newTeacher.name,
          email: newTeacher.email,
          department: newTeacher.department,
          subjects: newTeacher.subjects.split(',').map((subject) => subject.trim()),
        };
      }
      return teacher;
    });
    setTeachers(updatedTeachers);
    setShowModal(false);
    alert('Teacher updated successfully!');
  };

  const handleScheduleExam = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(false);
    alert(`Exam scheduled: ${newExam.subject} on ${newExam.date} from ${newExam.startTime} to ${newExam.endTime}`);
  };

  const handleScheduleRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedRooms = examRooms.map((room) => {
      if (room.id === editId) {
        return {
          ...room,
          status: 'occupied',
        };
      }
      return room;
    });
    setExamRooms(updatedRooms);
    setShowModal(false);
    alert(`Room scheduled for ${roomSchedule.purpose} on ${roomSchedule.date}`);
  };

  const handleEditRoom = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(false);
    alert('Room details updated successfully!');
  };

  // Delete handlers
  const handleDeleteStudent = (studentId: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      const filteredStudents = students.filter((student) => student.id !== studentId);
      setStudents(filteredStudents);
      alert('Student deleted successfully!');
    }
  };

  const handleDeleteTeacher = (teacherId: string) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      const filteredTeachers = teachers.filter((teacher) => teacher.id !== teacherId);
      setTeachers(filteredTeachers);
      alert('Teacher deleted successfully!');
    }
  };

  // Add Room handler
  const handleAddRoom = () => {
    setModalType('addRoom');
    setModalTitle('Add New Room');
    setShowModal(true);
  };

  const handleSubmitAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
  
    // Get input values
    const roomNumberInput = document.getElementById('roomNumber') as HTMLInputElement;
    const capacityInput = document.getElementById('capacity') as HTMLInputElement;
    const floorInput = document.getElementById('floor') as HTMLInputElement;
    const buildingInput = document.getElementById('building') as HTMLInputElement;
  
    // Create new room object
    const newRoom: ExamRoom = {
      id: (examRooms.length + 1).toString(), // Generate a unique ID
      roomNumber: roomNumberInput.value,
      capacity: parseInt(capacityInput.value),
      floor: floorInput.value,
      building: buildingInput.value,
      status: 'available', // Default status
    };
  
    // Debug: Log the new room
    console.log('New Room:', newRoom);
  
    // Update the state
    setExamRooms((prevRooms) => [...prevRooms, newRoom]);
  
    // Debug: Log the updated examRooms
    console.log('Updated Exam Rooms:', [...examRooms, newRoom]);
  
    // Close the modal
    setShowModal(false);
  
    // Show success message
    alert('Room added successfully!');
  };

  // Timetable generation and viewing handlers
  const handleGenerateTimetable = async () => {
    setGenerating(true);
    setError('');
    setTimetable(null);
    try {
      setTimeout(() => {
        setTimetableGenerated(true);
        setGenerating(false);
        alert('Timetable generated successfully!');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate timetable. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleViewTimetable = async () => {
    if (!department || !semester) {
      setError('Please select a department and semester.');
      return;
    }
    setError('');
    setTimetable(null);
    setTimeout(() => {
      const mockTimetable = [
        ['Monday', 'Math', 'Physics', 'Break', 'Chemistry', 'English', 'Lunch', 'Computer', 'PE'],
        ['Tuesday', 'Physics', 'Math', 'Break', 'Biology', 'Chemistry', 'Lunch', 'History', 'Art'],
        ['Wednesday', 'Chemistry', 'English', 'Break', 'Math', 'Physics', 'Lunch', 'Geography', 'Music'],
        ['Thursday', 'English', 'History', 'Break', 'Physics', 'Math', 'Lunch', 'Computer', 'PE'],
        ['Friday', 'Biology', 'Chemistry', 'Break', 'Math', 'English', 'Lunch', 'Physics', 'Music'],
      ];
      setTimetable(mockTimetable);
    }, 1000);
  };

  // Render modal content based on type
  const renderModalContent = () => {
    switch (modalType) {
      case 'addStudent':
      case 'editStudent':
        return (
          <form onSubmit={modalType === 'addStudent' ? handleAddStudent : handleEditStudent}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1E3A8A] mb-1">Student Name</label>
                <input
                  type="text"
                  name="name"
                  value={newStudent.name}
                  onChange={handleStudentFormChange}
                  className="w-full p-2 border-2 border-[#1E3A8A] rounded focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E3A8A] mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newStudent.email}
                  onChange={handleStudentFormChange}
                  className="w-full p-2 border-2 border-[#1E3A8A] rounded focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E3A8A] mb-1">Class</label>
                <input
                  type="text"
                  name="class"
                  value={newStudent.class}
                  onChange={handleStudentFormChange}
                  className="w-full p-2 border-2 border-[#1E3A8A] rounded focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E3A8A] mb-1">Roll Number</label>
                <input
                  type="text"
                  name="rollNumber"
                  value={newStudent.rollNumber}
                  onChange={handleStudentFormChange}
                  className="w-full p-2 border-2 border-[#1E3A8A] rounded focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[#1E3A8A] text-[#1E3A8A] rounded hover:bg-[#DBEAFE] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1E3A8A] text-[#EFF6FF] rounded hover:bg-[#2563EB] transition-colors"
                >
                  {modalType === 'addStudent' ? 'Add Student' : 'Update Student'}
                </button>
              </div>
            </div>
          </form>
        );

      case 'addTeacher':
      case 'editTeacher':
        return (
          <form onSubmit={modalType === 'addTeacher' ? handleAddTeacher : handleEditTeacher}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1E3A8A] mb-1">Teacher Name</label>
                <input
                  type="text"
                  name="name"
                  value={newTeacher.name}
                  onChange={handleTeacherFormChange}
                  className="w-full p-2 border-2 border-[#1E3A8A] rounded focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E3A8A] mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newTeacher.email}
                  onChange={handleTeacherFormChange}
                  className="w-full p-2 border-2 border-[#1E3A8A] rounded focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E3A8A] mb-1">Department</label>
                <select
                  name="department"
                  value={newTeacher.department}
                  onChange={handleTeacherFormChange}
                  className="w-full p-2 border-2 border-[#1E3A8A] rounded focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                  required
                >
                  <option value="">Select Department</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E3A8A] mb-1">Subjects (comma-separated)</label>
                <input
                  type="text"
                  name="subjects"
                  value={newTeacher.subjects}
                  onChange={handleTeacherFormChange}
                  className="w-full p-2 border-2 border-[#1E3A8A] rounded focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                  placeholder="e.g. Calculus, Algebra, Statistics"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[#1E3A8A] text-[#1E3A8A] rounded hover:bg-[#DBEAFE] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1E3A8A] text-[#EFF6FF] rounded hover:bg-[#2563EB] transition-colors"
                >
                  {modalType === 'addTeacher' ? 'Add Teacher' : 'Update Teacher'}
                </button>
              </div>
            </div>
          </form>
        );

      case 'scheduleExam':
        return (
          <form onSubmit={handleScheduleExam}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1E3A8A] mb-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={newExam.subject}
                  onChange={handleExamFormChange}
                  className="w-full p-2 border-2 border-[#1E3A8A] rounded focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E3A8A] mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={newExam.date}
                  onChange={handleExamFormChange}
                  className="w-full p-2 border-2 border-[#1E3A8A] rounded focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-[#1E3A8A] mb-1">Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    value={newExam.startTime}
                    onChange={handleExamFormChange}
                    className="w-full p-2 border-2 border-[#1E3A8A] rounded focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-[#1E3A8A] mb-1">End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    value={newExam.endTime}
                    onChange={handleExamFormChange}
                    className="w-full p-2 border-2 border-[#1E3A8A] rounded focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E3A8A] mb-1">Exam Room</label>
                <select
                  name="roomId"
                  value={newExam.roomId}
                  onChange={handleExamFormChange}
                  className="w-full p-2 border-2 border-[#1E3A8A] rounded focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                  required
                >
                  <option value="">Select Exam Room</option>
                  {examRooms
                    .filter((room) => room.status === 'available')
                    .map((room) => (
                      <option key={room.id} value={room.id}>
                        Room {room.roomNumber} - {room.building} ({room.capacity} capacity)
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[#1E3A8A] text-[#1E3A8A] rounded hover:bg-[#DBEAFE] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1E3A8A] text-[#EFF6FF] rounded hover:bg-[#2563EB] transition-colors"
                >
                  Schedule Exam
                </button>
              </div>
            </div>
          </form>
        );

      case 'scheduleRoom':
        return (
          <form onSubmit={handleScheduleRoom}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1E3A8A] mb-1">Purpose</label>
                <input
                  type="text"
                  name="purpose"
                  value={roomSchedule.purpose}
                  onChange={handleRoomScheduleFormChange}
                  className="w-full p-2 border-2 border-[#1E3A8A] rounded focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                  placeholder="e.g. Final Exam, Mid-term Exam, Special Class"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E3A8A] mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={roomSchedule.date}
                  onChange={handleRoomScheduleFormChange}
                  className="w-full p-2 border-2 border-[#1E3A8A] rounded focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-[#1E3A8A] mb-1">Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    value={roomSchedule.startTime}
                    onChange={handleRoomScheduleFormChange}
                    className="w-full p-2 border-2 border-[#1E3A8A] rounded focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-[#1E3A8A] mb-1">End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    value={roomSchedule.endTime}
                    onChange={handleRoomScheduleFormChange}
                    className="w-full p-2 border-2 border-[#1E3A8A] rounded focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E3A8A] mb-1">Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={roomSchedule.notes}
                  onChange={handleRoomScheduleFormChange}
                  className="w-full p-2 border-2 border-[#1E3A8A] rounded focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                  rows={3}
                  placeholder="Additional notes about the room schedule"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[#1E3A8A] text-[#1E3A8A] rounded hover:bg-[#DBEAFE] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1E3A8A] text-[#EFF6FF] rounded hover:bg-[#2563EB] transition-colors"
                >
                  Schedule Room
                </button>
              </div>
            </div>
          </form>
        );

      case 'addRoom':
        return (
          <form onSubmit={handleSubmitAddRoom}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1E3A8A] mb-1">Room Number</label>
                <input
                  type="text"
                  id="roomNumber"
                  className="w-full p-2 border-2 border-[#1E3A8A] rounded focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E3A8A] mb-1">Capacity</label>
                <input
                  type="number"
                  id="capacity"
                  className="w-full p-2 border-2 border-[#1E3A8A] rounded focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E3A8A] mb-1">Floor</label>
                <input
                  type="text"
                  id="floor"
                  className="w-full p-2 border-2 border-[#1E3A8A] rounded focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E3A8A] mb-1">Building</label>
                <input
                  type="text"
                  id="building"
                  className="w-full p-2 border-2 border-[#1E3A8A] rounded focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[#1E3A8A] text-[#1E3A8A] rounded hover:bg-[#DBEAFE] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1E3A8A] text-[#EFF6FF] rounded hover:bg-[#2563EB] transition-colors"
                >
                  Add Room
                </button>
              </div>
            </div>
          </form>
        );

      case 'editRoom':
        return (
          <form onSubmit={handleEditRoom}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1E3A8A] mb-1">Room Number</label>
                <input
                  type="text"
                  defaultValue={examRooms.find((room) => room.id === editId)?.roomNumber}
                  className="w-full p-2 border-2 border-[#1E3A8A] rounded focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E3A8A] mb-1">Capacity</label>
                <input
                  type="number"
                  defaultValue={examRooms.find((room) => room.id === editId)?.capacity}
                  className="w-full p-2 border-2 border-[#1E3A8A] rounded focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E3A8A] mb-1">Floor</label>
                <input
                  type="text"
                  defaultValue={examRooms.find((room) => room.id === editId)?.floor}
                  className="w-full p-2 border-2 border-[#1E3A8A] rounded focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E3A8A] mb-1">Building</label>
                <input
                  type="text"
                  defaultValue={examRooms.find((room) => room.id === editId)?.building}
                  className="w-full p-2 border-2 border-[#1E3A8A] rounded focus:outline-none focus:ring-2 focus:ring-[#93C5FD]"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[#1E3A8A] text-[#1E3A8A] rounded hover:bg-[#DBEAFE] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1E3A8A] text-[#EFF6FF] rounded hover:bg-[#2563EB] transition-colors"
                >
                  Update Room
                </button>
              </div>
            </div>
          </form>
        );

      default:
        return null;
    }
  };

  // Render functions for tabs
  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-[#EFF6FF] p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#1E3A8A]">Department Performance</h3>
          <BarChart3 className="h-6 w-6 text-[#1E3A8A]" />
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#93C5FD" />
              <XAxis dataKey="name" stroke="#1E3A8A" />
              <YAxis stroke="#1E3A8A" />
              <Tooltip />
              <Legend />
              <Bar dataKey="averagePerformance" fill="#2563EB" name="Avg. Performance" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#EFF6FF] p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#1E3A8A]">Student Distribution</h3>
          <Users className="h-6 w-6 text-[#1E3A8A]" />
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#93C5FD" />
              <XAxis dataKey="name" stroke="#1E3A8A" />
              <YAxis stroke="#1E3A8A" />
              <Tooltip />
              <Bar dataKey="studentCount" fill="#1E3A8A" name="Students" />
              <Bar dataKey="teacherCount" fill="#93C5FD" name="Teachers" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#EFF6FF] p-6 rounded-lg shadow-md col-span-1 md:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#1E3A8A]">Quick Actions</h3>
          <Settings className="h-6 w-6 text-[#1E3A8A]" />
        </div>
        <div className="space-y-4">
          <button
            onClick={openAddStudentModal}
            className="w-full flex items-center justify-between p-3 bg-[#93C5FD] rounded-md hover:bg-[#2563EB] transition-colors text-[#1E3A8A] hover:text-[#EFF6FF]"
          >
            <span className="flex items-center">
              <PlusCircle className="h-5 w-5 mr-2" />
              Add New Student
            </span>
          </button>
          <button
            onClick={openAddTeacherModal}
            className="w-full flex items-center justify-between p-3 bg-[#93C5FD] rounded-md hover:bg-[#2563EB] transition-colors text-[#1E3A8A] hover:text-[#EFF6FF]"
          >
            <span className="flex items-center">
              <PlusCircle className="h-5 w-5 mr-2" />
              Add New Teacher
            </span>
          </button>
          <button
            onClick={openScheduleExamModal}
            className="w-full flex items-center justify-between p-3 bg-[#93C5FD] rounded-md hover:bg-[#2563EB] transition-colors text-[#1E3A8A] hover:text-[#EFF6FF]"
          >
            <span className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Schedule Exam
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#1E3A8A]">Student Management</h2>
        <button
          onClick={openAddStudentModal}
          className="px-4 py-2 bg-[#1E3A8A] text-[#EFF6FF] rounded-md hover:bg-[#2563EB] transition-colors flex items-center"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Student
        </button>
      </div>
      <div className="bg-[#EFF6FF] rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-[#1E3A8A]">
          <thead className="bg-[#93C5FD]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1E3A8A] uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1E3A8A] uppercase tracking-wider">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1E3A8A] uppercase tracking-wider">Roll Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1E3A8A] uppercase tracking-wider">Attendance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1E3A8A] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-[#EFF6FF] divide-y divide-[#1E3A8A]">
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-[#1E3A8A]">{student.name}</div>
                      <div className="text-sm text-[#2563EB]">{student.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1E3A8A]">{student.class}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1E3A8A]">{student.rollNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm text-[#1E3A8A]">{student.attendance}%</span>
                    <div className="ml-2 w-16 bg-[#93C5FD] rounded-full h-2">
                      <div
                        className="bg-[#2563EB] rounded-full h-2"
                        style={{ width: `${student.attendance}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => openEditStudentModal(student.id)}
                    className="text-[#1E3A8A] hover:text-[#2563EB] mr-3"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteStudent(student.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTeachers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#1E3A8A]">Teacher Management</h2>
        <button
          onClick={openAddTeacherModal}
          className="px-4 py-2 bg-[#1E3A8A] text-[#EFF6FF] rounded-md hover:bg-[#2563EB] transition-colors flex items-center"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Teacher
        </button>
      </div>
      <div className="bg-[#EFF6FF] rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-[#1E3A8A]">
          <thead className="bg-[#93C5FD]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1E3A8A] uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1E3A8A] uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1E3A8A] uppercase tracking-wider">Subjects</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1E3A8A] uppercase tracking-wider">Join Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1E3A8A] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-[#EFF6FF] divide-y divide-[#1E3A8A]">
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-[#1E3A8A]">{teacher.name}</div>
                      <div className="text-sm text-[#2563EB]">{teacher.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1E3A8A]">{teacher.department}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1E3A8A]">{teacher.subjects.join(', ')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1E3A8A]">
                  {format(new Date(teacher.joinDate), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => openEditTeacherModal(teacher.id)}
                    className="text-[#1E3A8A] hover:text-[#2563EB] mr-3"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTeacher(teacher.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderExamRooms = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#1E3A8A]">Exam Room Management</h2>
        <button
          onClick={handleAddRoom}
          className="px-4 py-2 bg-[#1E3A8A] text-[#EFF6FF] rounded-md hover:bg-[#2563EB] transition-colors flex items-center"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Room
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {examRooms.map((room) => (
          <div key={room.id} className="bg-[#EFF6FF] p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-[#1E3A8A]">Room {room.roomNumber}</h3>
                <p className="text-sm text-[#2563EB]">{room.building} - {room.floor} Floor</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  room.status === 'available'
                    ? 'bg-green-100 text-green-800'
                    : room.status === 'occupied'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {room.status}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm text-[#1E3A8A]">Capacity: {room.capacity} students</p>
            </div>
            <div className="mt-4 flex space-x-4">
              <button
                onClick={() => openScheduleRoomModal(room.id)}
                className="flex-1 px-3 py-2 bg-[#93C5FD] text-[#1E3A8A] rounded-md hover:bg-[#2563EB] hover:text-[#EFF6FF] transition-colors"
              >
                Schedule
              </button>
              <button
                onClick={() => openEditRoomModal(room.id)}
                className="flex-1 px-3 py-2 bg-[#93C5FD] text-[#1E3A8A] rounded-md hover:bg-[#2563EB] hover:text-[#EFF6FF] transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTimetable = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-[#1E3A8A] mb-4">Timetable Management</h2>
      <div className="bg-[#93C5FD] p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <button
            onClick={handleGenerateTimetable}
            disabled={generating}
            className={`bg-[#1E3A8A] text-[#EFF6FF] px-6 py-2 rounded transition-colors w-full ${
              generating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#2563EB]'
            }`}
          >
            {generating ? 'Generating...' : 'Generate Timetable'}
          </button>
        </div>

        {timetableGenerated && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-[#1E3A8A] mb-2">Select Department and Semester</h3>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="border-2 border-[#1E3A8A] p-2 rounded bg-[#EFF6FF] text-[#1E3A8A] w-full"
              >
                <option value="">Select Department</option>
                <option value="0">Computer Engineering</option>
                <option value="1">Information Technology</option>
                <option value="2">Mechanical Engineering</option>
                <option value="3">Civil Engineering</option>
                <option value="4">Bio-medical Engineering</option>
              </select>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="border-2 border-[#1E3A8A] p-2 rounded bg-[#EFF6FF] text-[#1E3A8A] w-full"
              >
                <option value="">Select Semester</option>
                {[...Array(8)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              <button
                onClick={handleViewTimetable}
                className="bg-[#1E3A8A] text-[#EFF6FF] px-4 py-2 rounded hover:bg-[#2563EB] transition-colors w-full sm:w-auto"
              >
                View Timetable
              </button>
            </div>
          </div>
        )}

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {timetable && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-2 border-[#1E3A8A] bg-[#EFF6FF]">
              <thead>
                <tr className="bg-[#2563EB] text-[#EFF6FF]">
                  <th className="border-2 border-[#1E3A8A] p-2">Day</th>
                  <th className="border-2 border-[#1E3A8A] p-2">8:00-9:00</th>
                  <th className="border-2 border-[#1E3A8A] p-2">9:00-10:00</th>
                  <th className="border-2 border-[#1E3A8A] p-2">10:00-10:30</th>
                  <th className="border-2 border-[#1E3A8A] p-2">10:30-11:30</th>
                  <th className="border-2 border-[#1E3A8A] p-2">11:30-12:30</th>
                  <th className="border-2 border-[#1E3A8A] p-2">12:30-1:00</th>
                  <th className="border-2 border-[#1E3A8A] p-2">1:00-2:00</th>
                  <th className="border-2 border-[#1E3A8A] p-2">2:00-3:00</th>
                </tr>
              </thead>
              <tbody>
                {timetable.map((row, index) => (
                  <tr key={index}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="border-2 border-[#1E3A8A] p-2 text-center text-[#1E3A8A]">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'students':
        return renderStudents();
      case 'teachers':
        return renderTeachers();
      case 'examRooms':
        return renderExamRooms();
      case 'timetable':
        return renderTimetable();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#DBEAFE]">
      <header className="bg-[#1E3A8A] text-[#EFF6FF] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-[#93C5FD]" />
              <div className="ml-4">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-[#93C5FD]">Welcome, {user.name}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center text-[#93C5FD] hover:text-[#EFF6FF] transition-colors"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>
  
      {/* Main Content Area */}
      <div className="flex">
        {/* Vertical Navigation */}
        <nav className="bg-[#EFF6FF] shadow-sm w-64 min-h-screen py-6">
          <div className="space-y-3">
            {[
              { id: 'overview', icon: BarChart3, label: 'Overview' },
              { id: 'students', icon: GraduationCap, label: 'Students' },
              { id: 'teachers', icon: Users, label: 'Teachers' },
              { id: 'examRooms', icon: School, label: 'Exam Rooms' },
              { id: 'timetable', icon: Calendar, label: 'Timetable' },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center w-full px-6 py-3 text-sm font-medium ${
                  activeTab === id
                    ? 'text-[#1E3A8A] bg-[#DBEAFE] border-l-4 border-[#1E3A8A]'
                    : 'text-[#2563EB] hover:text-[#1E3A8A] hover:bg-[#DBEAFE] hover:border-l-4 hover:border-[#93C5FD]'
                } transition-colors`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {label}
              </button>
            ))}
          </div>
        </nav>
  
        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </main>
      </div>
  
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-[#EFF6FF] rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[#1E3A8A]">{modalTitle}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#1E3A8A] hover:text-[#2563EB]"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            {renderModalContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;