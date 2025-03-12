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

  // Mock data for original dashboard
  const students: StudentData[] = [
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
  ];

  const teachers: TeacherData[] = [
    {
      id: '1',
      name: 'Dr. Sarah Wilson',
      email: 'sarah@example.com',
      department: 'Mathematics',
      subjects: ['Calculus', 'Linear Algebra'],
      joinDate: '2022-08-15',
    },
  ];

  const examRooms: ExamRoom[] = [
    {
      id: '1',
      roomNumber: '101',
      capacity: 40,
      floor: '1st',
      building: 'Main Block',
      status: 'available',
    },
  ];

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

  // Render functions for tabs
  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-[#FFF8E8] p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#8B4513]">Department Performance</h3>
          <BarChart3 className="h-6 w-6 text-[#8B4513]" />
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DED0B6" />
              <XAxis dataKey="name" stroke="#8B4513" />
              <YAxis stroke="#8B4513" />
              <Tooltip />
              <Legend />
              <Bar dataKey="averagePerformance" fill="#A0522D" name="Avg. Performance" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#FFF8E8] p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#8B4513]">Student Distribution</h3>
          <Users className="h-6 w-6 text-[#8B4513]" />
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DED0B6" />
              <XAxis dataKey="name" stroke="#8B4513" />
              <YAxis stroke="#8B4513" />
              <Tooltip />
              <Bar dataKey="studentCount" fill="#8B4513" name="Students" />
              <Bar dataKey="teacherCount" fill="#DED0B6" name="Teachers" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#FFF8E8] p-6 rounded-lg shadow-md col-span-1 md:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#8B4513]">Quick Actions</h3>
          <Settings className="h-6 w-6 text-[#8B4513]" />
        </div>
        <div className="space-y-4">
          <button className="w-full flex items-center justify-between p-3 bg-[#DED0B6] rounded-md hover:bg-[#A0522D] transition-colors text-[#8B4513] hover:text-[#F5E8C7]">
            <span className="flex items-center">
              <PlusCircle className="h-5 w-5 mr-2" />
              Add New Student
            </span>
          </button>
          <button className="w-full flex items-center justify-between p-3 bg-[#DED0B6] rounded-md hover:bg-[#A0522D] transition-colors text-[#8B4513] hover:text-[#F5E8C7]">
            <span className="flex items-center">
              <PlusCircle className="h-5 w-5 mr-2" />
              Add New Teacher
            </span>
          </button>
          <button className="w-full flex items-center justify-between p-3 bg-[#DED0B6] rounded-md hover:bg-[#A0522D] transition-colors text-[#8B4513] hover:text-[#F5E8C7]">
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
        <h2 className="text-xl font-semibold text-[#8B4513]">Student Management</h2>
        <button className="px-4 py-2 bg-[#8B4513] text-[#F5E8C7] rounded-md hover:bg-[#A0522D] transition-colors flex items-center">
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Student
        </button>
      </div>
      <div className="bg-[#FFF8E8] rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-[#8B4513]">
          <thead className="bg-[#DED0B6]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider">Roll Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider">Attendance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-[#FFF8E8] divide-y divide-[#8B4513]">
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-[#8B4513]">{student.name}</div>
                      <div className="text-sm text-[#A0522D]">{student.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8B4513]">{student.class}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8B4513]">{student.rollNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm text-[#8B4513]">{student.attendance}%</span>
                    <div className="ml-2 w-16 bg-[#DED0B6] rounded-full h-2">
                      <div
                        className="bg-[#A0522D] rounded-full h-2"
                        style={{ width: `${student.attendance}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-[#8B4513] hover:text-[#A0522D] mr-3">
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
        <h2 className="text-xl font-semibold text-[#8B4513]">Teacher Management</h2>
        <button className="px-4 py-2 bg-[#8B4513] text-[#F5E8C7] rounded-md hover:bg-[#A0522D] transition-colors flex items-center">
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Teacher
        </button>
      </div>
      <div className="bg-[#FFF8E8] rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-[#8B4513]">
          <thead className="bg-[#DED0B6]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider">Subjects</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider">Join Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-[#FFF8E8] divide-y divide-[#8B4513]">
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-[#8B4513]">{teacher.name}</div>
                      <div className="text-sm text-[#A0522D]">{teacher.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8B4513]">{teacher.department}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8B4513]">{teacher.subjects.join(', ')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8B4513]">
                  {format(new Date(teacher.joinDate), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-[#8B4513] hover:text-[#A0522D] mr-3">
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
        <h2 className="text-xl font-semibold text-[#8B4513]">Exam Room Management</h2>
        <button className="px-4 py-2 bg-[#8B4513] text-[#F5E8C7] rounded-md hover:bg-[#A0522D] transition-colors flex items-center">
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Room
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {examRooms.map((room) => (
          <div key={room.id} className="bg-[#FFF8E8] p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-[#8B4513]">Room {room.roomNumber}</h3>
                <p className="text-sm text-[#A0522D]">{room.building} - {room.floor} Floor</p>
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
              <p className="text-sm text-[#8B4513]">Capacity: {room.capacity} students</p>
            </div>
            <div className="mt-4 flex space-x-4">
              <button className="flex-1 px-3 py-2 bg-[#DED0B6] text-[#8B4513] rounded-md hover:bg-[#A0522D] hover:text-[#F5E8C7] transition-colors">
                Schedule
              </button>
              <button className="flex-1 px-3 py-2 bg-[#DED0B6] text-[#8B4513] rounded-md hover:bg-[#A0522D] hover:text-[#F5E8C7] transition-colors">
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
      <h2 className="text-xl font-semibold text-[#8B4513] mb-4">Timetable Management</h2>
      <div className="bg-[#DED0B6] p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <button
            onClick={handleGenerateTimetable}
            disabled={generating}
            className={`bg-[#8B4513] text-[#F5E8C7] px-6 py-2 rounded transition-colors w-full ${
              generating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#A0522D]'
            }`}
          >
            {generating ? 'Generating...' : 'Generate Timetable'}
          </button>
        </div>

        {timetableGenerated && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-[#8B4513] mb-2">Select Department and Semester</h3>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="border-2 border-[#8B4513] p-2 rounded bg-[#FFF8E8] text-[#8B4513] w-full"
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
                className="border-2 border-[#8B4513] p-2 rounded bg-[#FFF8E8] text-[#8B4513] w-full"
              >
                <option value="">Select Semester</option>
                {[...Array(8)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              <button
                onClick={handleViewTimetable}
                className="bg-[#8B4513] text-[#F5E8C7] px-4 py-2 rounded hover:bg-[#A0522D] transition-colors w-full sm:w-auto"
              >
                View Timetable
              </button>
            </div>
          </div>
        )}

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {timetable && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-2 border-[#8B4513] bg-[#FFF8E8]">
              <thead>
                <tr className="bg-[#A0522D] text-[#F5E8C7]">
                  <th className="border-2 border-[#8B4513] p-2">Day</th>
                  <th className="border-2 border-[#8B4513] p-2">8:00-9:00</th>
                  <th className="border-2 border-[#8B4513] p-2">9:00-10:00</th>
                  <th className="border-2 border-[#8B4513] p-2">10:00-10:30</th>
                  <th className="border-2 border-[#8B4513] p-2">10:30-11:30</th>
                  <th className="border-2 border-[#8B4513] p-2">11:30-12:30</th>
                  <th className="border-2 border-[#8B4513] p-2">12:30-1:00</th>
                  <th className="border-2 border-[#8B4513] p-2">1:00-2:00</th>
                  <th className="border-2 border-[#8B4513] p-2">2:00-3:00</th>
                </tr>
              </thead>
              <tbody>
                {timetable.map((row, index) => (
                  <tr key={index}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="border-2 border-[#8B4513] p-2 text-center text-[#8B4513]">
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
    <div className="min-h-screen bg-[#F5E8C7]">
      <header className="bg-[#8B4513] text-[#F5E8C7] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-[#DED0B6]" />
              <div className="ml-4">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-[#DED0B6]">Welcome, {user.name}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center text-[#DED0B6] hover:text-[#F5E8C7] transition-colors"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-[#FFF8E8] shadow-sm mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
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
                className={`flex items-center px-3 py-4 text-sm font-medium ${
                  activeTab === id
                    ? 'text-[#8B4513] border-b-2 border-[#8B4513]'
                    : 'text-[#A0522D] hover:text-[#8B4513] hover:border-b-2 hover:border-[#DED0B6]'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;