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
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', class: '', email: '', rollNumber: '' });
  const [newRoom, setNewRoom] = useState({ roomNumber: '', capacity: '', floor: '', building: '' });

  // State for managing students, teachers, and exam rooms
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

  // Timetable generation and viewing handlers
  const handleGenerateTimetable = async () => {
    setGenerating(true);
    setError('');
    setTimetable(null);
    try {
      const response = await axios.post('http://localhost:5000/generate-timetable');
      if (response.status === 200) {
        setTimetableGenerated(true);
        alert('Timetable generated successfully!');
      }
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
    try {
      const response = await axios.post('http://localhost:5000/get-timetable', {
        department: parseInt(department),
        semester: parseInt(semester),
      });
      setTimetable(response.data.schedule);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch timetable. Please check your selection.');
    }
  };

  // Add Student handler
  const handleAddStudent = () => {
    const newStudentData: StudentData = {
      id: (students.length + 1).toString(),
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
    setStudents([...students, newStudentData]);
    setShowStudentModal(false);
    setNewStudent({ name: '', class: '', email: '', rollNumber: '' });
  };

  // Add Room handler
  const handleAddRoom = () => {
    const newRoomData: ExamRoom = {
      id: (examRooms.length + 1).toString(),
      roomNumber: newRoom.roomNumber,
      capacity: parseInt(newRoom.capacity),
      floor: newRoom.floor,
      building: newRoom.building,
      status: 'available',
    };
    setExamRooms([...examRooms, newRoomData]);
    setShowRoomModal(false);
    setNewRoom({ roomNumber: '', capacity: '', floor: '', building: '' });
  };

  // Render functions for tabs
  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#03045E]">Department Performance</h3>
          <BarChart3 className="h-6 w-6 text-[#03045E]" />
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#90E0EF" />
              <XAxis dataKey="name" stroke="#03045E" />
              <YAxis stroke="#03045E" />
              <Tooltip />
              <Legend />
              <Bar dataKey="averagePerformance" fill="#0077B6" name="Avg. Performance" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#03045E]">Student Distribution</h3>
          <Users className="h-6 w-6 text-[#03045E]" />
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#90E0EF" />
              <XAxis dataKey="name" stroke="#03045E" />
              <YAxis stroke="#03045E" />
              <Tooltip />
              <Bar dataKey="studentCount" fill="#03045E" name="Students" />
              <Bar dataKey="teacherCount" fill="#90E0EF" name="Teachers" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#03045E]">Quick Actions</h3>
          <Settings className="h-6 w-6 text-[#03045E]" />
        </div>
        <div className="space-y-4">
          <button
            onClick={() => setShowStudentModal(true)}
            className="w-full flex items-center justify-between p-3 bg-[#90E0EF] rounded-md hover:bg-[#0077B6] transition-colors text-[#03045E] hover:text-white"
          >
            <span className="flex items-center">
              <PlusCircle className="h-5 w-5 mr-2" />
              Add New Student
            </span>
          </button>
          <button
            onClick={() => setShowRoomModal(true)}
            className="w-full flex items-center justify-between p-3 bg-[#90E0EF] rounded-md hover:bg-[#0077B6] transition-colors text-[#03045E] hover:text-white"
          >
            <span className="flex items-center">
              <PlusCircle className="h-5 w-5 mr-2" />
              Add Room
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#03045E]">Student Management</h2>
        <button
          onClick={() => setShowStudentModal(true)}
          className="px-4 py-2 bg-[#03045E] text-white rounded-md hover:bg-[#0077B6] transition-colors flex items-center"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Student
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-[#03045E]">
          <thead className="bg-[#90E0EF]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#03045E] uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#03045E] uppercase tracking-wider">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#03045E] uppercase tracking-wider">Roll Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#03045E] uppercase tracking-wider">Attendance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#03045E] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#03045E]">
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-[#03045E]">{student.name}</div>
                      <div className="text-sm text-[#0077B6]">{student.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#03045E]">{student.class}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#03045E]">{student.rollNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm text-[#03045E]">{student.attendance}%</span>
                    <div className="ml-2 w-16 bg-[#90E0EF] rounded-full h-2">
                      <div
                        className="bg-[#0077B6] rounded-full h-2"
                        style={{ width: `${student.attendance}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-[#03045E] hover:text-[#0077B6] mr-3">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
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
        <h2 className="text-xl font-semibold text-[#03045E]">Teacher Management</h2>
        <button
          onClick={() => setShowStudentModal(true)}
          className="px-4 py-2 bg-[#03045E] text-white rounded-md hover:bg-[#0077B6] transition-colors flex items-center"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Teacher
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-[#03045E]">
          <thead className="bg-[#90E0EF]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#03045E] uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#03045E] uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#03045E] uppercase tracking-wider">Subjects</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#03045E] uppercase tracking-wider">Join Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#03045E] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#03045E]">
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-[#03045E]">{teacher.name}</div>
                      <div className="text-sm text-[#0077B6]">{teacher.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#03045E]">{teacher.department}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#03045E]">{teacher.subjects.join(', ')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#03045E]">
                  {format(new Date(teacher.joinDate), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-[#03045E] hover:text-[#0077B6] mr-3">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
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
        <h2 className="text-xl font-semibold text-[#03045E]">Exam Room Management</h2>
        <button
          onClick={() => setShowRoomModal(true)}
          className="px-4 py-2 bg-[#03045E] text-white rounded-md hover:bg-[#0077B6] transition-colors flex items-center"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Room
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {examRooms.map((room) => (
          <div key={room.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-[#03045E]">Room {room.roomNumber}</h3>
                <p className="text-sm text-[#0077B6]">{room.building} - {room.floor} Floor</p>
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
              <p className="text-sm text-[#03045E]">Capacity: {room.capacity} students</p>
            </div>
            <div className="mt-4 flex space-x-4">
              <button className="flex-1 px-3 py-2 bg-[#90E0EF] text-[#03045E] rounded-md hover:bg-[#0077B6] hover:text-white transition-colors">
                Schedule
              </button>
              <button className="flex-1 px-3 py-2 bg-[#90E0EF] text-[#03045E] rounded-md hover:bg-[#0077B6] hover:text-white transition-colors">
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
      <h2 className="text-xl font-semibold text-[#03045E] mb-4">Timetable Management</h2>
      <div className="bg-[#90E0EF] p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <button
            onClick={handleGenerateTimetable}
            disabled={generating}
            className={`bg-[#03045E] text-white px-6 py-2 rounded transition-colors w-full ${
              generating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#0077B6]'
            }`}
          >
            {generating ? 'Generating...' : 'Generate Timetable'}
          </button>
        </div>

        {timetableGenerated && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-[#03045E] mb-2">Select Department and Semester</h3>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="border-2 border-[#03045E] p-2 rounded bg-white text-[#03045E] w-full"
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
                className="border-2 border-[#03045E] p-2 rounded bg-white text-[#03045E] w-full"
              >
                <option value="">Select Semester</option>
                {[...Array(8)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              <button
                onClick={handleViewTimetable}
                className="bg-[#03045E] text-white px-4 py-2 rounded hover:bg-[#0077B6] transition-colors w-full sm:w-auto"
              >
                View Timetable
              </button>
            </div>
          </div>
        )}

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {timetable && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-2 border-[#03045E] bg-white">
              <thead>
                <tr className="bg-[#0077B6] text-white">
                  <th className="border-2 border-[#03045E] p-2">Day</th>
                  <th className="border-2 border-[#03045E] p-2">8:00-9:00</th>
                  <th className="border-2 border-[#03045E] p-2">9:00-10:00</th>
                  <th className="border-2 border-[#03045E] p-2">10:00-10:30</th>
                  <th className="border-2 border-[#03045E] p-2">10:30-11:30</th>
                  <th className="border-2 border-[#03045E] p-2">11:30-12:30</th>
                  <th className="border-2 border-[#03045E] p-2">12:30-1:00</th>
                  <th className="border-2 border-[#03045E] p-2">1:00-2:00</th>
                  <th className="border-2 border-[#03045E] p-2">2:00-3:00</th>
                </tr>
              </thead>
              <tbody>
                {timetable.map((row, index) => (
                  <tr key={index}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="border-2 border-[#03045E] p-2 text-center text-[#03045E]">
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
    <div className="min-h-screen bg-white">
      <header className="bg-[#03045E] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-[#90E0EF]" />
              <div className="ml-4">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-[#90E0EF]">Welcome, {user.name}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center text-[#90E0EF] hover:text-white transition-colors"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Vertical Navbar */}
        <nav className="bg-[#03045E] shadow-sm w-64 min-h-screen py-6">
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
                    ? 'text-white bg-[#0077B6] border-l-4 border-[#00B4D8]'
                    : 'text-[#90E0EF] hover:text-white hover:bg-[#0077B6] hover:border-l-4 hover:border-[#00B4D8]'
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

      {/* Student Modal */}
      {showStudentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold text-[#03045E] mb-4">Add New Student</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                className="w-full p-2 border-2 border-[#03045E] rounded focus:outline-none focus:ring-2 focus:ring-[#90E0EF]"
              />
              <input
                type="text"
                placeholder="Class"
                value={newStudent.class}
                onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
                className="w-full p-2 border-2 border-[#03045E] rounded focus:outline-none focus:ring-2 focus:ring-[#90E0EF]"
              />
              <input
                type="email"
                placeholder="Email"
                value={newStudent.email}
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                className="w-full p-2 border-2 border-[#03045E] rounded focus:outline-none focus:ring-2 focus:ring-[#90E0EF]"
              />
              <input
                type="text"
                placeholder="Roll Number"
                value={newStudent.rollNumber}
                onChange={(e) => setNewStudent({ ...newStudent, rollNumber: e.target.value })}
                className="w-full p-2 border-2 border-[#03045E] rounded focus:outline-none focus:ring-2 focus:ring-[#90E0EF]"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowStudentModal(false)}
                  className="px-4 py-2 border border-[#03045E] text-[#03045E] rounded hover:bg-[#90E0EF] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStudent}
                  className="px-4 py-2 bg-[#03045E] text-white rounded hover:bg-[#0077B6] transition-colors"
                >
                  Add Student
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Room Modal */}
      {showRoomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold text-[#03045E] mb-4">Add New Room</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Room Number"
                value={newRoom.roomNumber}
                onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
                className="w-full p-2 border-2 border-[#03045E] rounded focus:outline-none focus:ring-2 focus:ring-[#90E0EF]"
              />
              <input
                type="text"
                placeholder="Capacity"
                value={newRoom.capacity}
                onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
                className="w-full p-2 border-2 border-[#03045E] rounded focus:outline-none focus:ring-2 focus:ring-[#90E0EF]"
              />
              <input
                type="text"
                placeholder="Floor"
                value={newRoom.floor}
                onChange={(e) => setNewRoom({ ...newRoom, floor: e.target.value })}
                className="w-full p-2 border-2 border-[#03045E] rounded focus:outline-none focus:ring-2 focus:ring-[#90E0EF]"
              />
              <input
                type="text"
                placeholder="Building"
                value={newRoom.building}
                onChange={(e) => setNewRoom({ ...newRoom, building: e.target.value })}
                className="w-full p-2 border-2 border-[#03045E] rounded focus:outline-none focus:ring-2 focus:ring-[#90E0EF]"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRoomModal(false)}
                  className="px-4 py-2 border border-[#03045E] text-[#03045E] rounded hover:bg-[#90E0EF] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddRoom}
                  className="px-4 py-2 bg-[#03045E] text-white rounded hover:bg-[#0077B6] transition-colors"
                >
                  Add Room
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;