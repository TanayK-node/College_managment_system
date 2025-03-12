// src/components/StudentDashboard/StudentDashboard.tsx
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import ChatbotWidget from './ChatbotWidget'; // Adjusted path assuming the file is named ChatbotWidget.tsx
import { User, Subject, Assignment, Notice, Event } from '../../types';
import { 
  BookOpen, 
  Calendar, 
  CheckSquare, 
  Bell, 
  LogOut,
  GraduationCap,
  Home,
  BarChart3,
  Menu,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { BarChart, Bar, CartesianGrid } from 'recharts';

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
}

const revenueData = [
  { name: 'Week 1', value: 11000 },
  { name: 'Week 2', value: 12500 },
  { name: 'Week 3', value: 11800 },
  { name: 'Week 4', value: 12300 },
  { name: 'Week 5', value: 13000 },
  { name: 'Week 6', value: 13800 },
  { name: 'Week 7', value: 15231.89 }
];

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Enhanced mock data with detailed grade tracking
  const subjects: Subject[] = [
    { 
      id: '1', 
      name: 'Mathematics', 
      code: 'MATH101', 
      teacher: 'Dr. Smith', 
      attendance: 85,
      grades: [
        { assessment: 'Quiz 1', score: 85, maxScore: 100, weight: 0.2 },
        { assessment: 'Midterm', score: 78, maxScore: 100, weight: 0.3 },
        { assessment: 'Project', score: 92, maxScore: 100, weight: 0.2 },
        { assessment: 'Final', score: 88, maxScore: 100, weight: 0.3 }
      ]
    },
    { 
      id: '2', 
      name: 'Physics', 
      code: 'PHY101', 
      teacher: 'Dr. Johnson', 
      attendance: 90,
      grades: [
        { assessment: 'Lab 1', score: 88, maxScore: 100, weight: 0.15 },
        { assessment: 'Midterm', score: 82, maxScore: 100, weight: 0.35 },
        { assessment: 'Lab 2', score: 95, maxScore: 100, weight: 0.15 },
        { assessment: 'Final', score: 85, maxScore: 100, weight: 0.35 }
      ]
    },
    { 
      id: '3', 
      name: 'Computer Science', 
      code: 'CS101', 
      teacher: 'Prof. Davis', 
      attendance: 95,
      grades: [
        { assessment: 'Assignment 1', score: 90, maxScore: 100, weight: 0.2 },
        { assessment: 'Project', score: 95, maxScore: 100, weight: 0.3 },
        { assessment: 'Assignment 2', score: 88, maxScore: 100, weight: 0.2 },
        { assessment: 'Final', score: 92, maxScore: 100, weight: 0.3 }
      ]
    },
  ];

  const assignments: Assignment[] = [
    { id: '1', title: 'Calculus Assignment', subject: 'Mathematics', dueDate: '2024-03-25', status: 'pending' },
    { id: '2', title: 'Physics Lab Report', subject: 'Physics', dueDate: '2024-03-28', status: 'submitted' },
    { id: '4', title: 'Community Project', subject: 'English', dueDate: '2024-04-11', status: 'graded', grade: 'B' },
    { id: '5', title: 'BEE', subject: 'Electronics', dueDate: '2024-04-16', status: 'graded', grade: 'C' },
  ];

  const notices: Notice[] = [
    { id: '1', title: 'Semester End Exam Schedule', content: 'Final exams will begin from April 15th. Please check the department notice board for detailed schedule.', date: '2024-03-20', priority: 'high' },
    { id: '2', title: 'Library Timing Change', content: 'Library will now be open till 8 PM on weekdays and 6 PM on weekends starting next week.', date: '2024-03-19', priority: 'medium' },
    { id: '3', title: 'Career Fair', content: 'Annual career fair will be held on April 5th in the main auditorium. All final year students are required to attend.', date: '2024-03-22', priority: 'high' },
  ];

  const events: Event[] = [
    { id: '1', title: 'Annual Sports Day', date: '2024-04-05', description: 'College annual sports event', type: 'sports' },
    { id: '2', title: 'Technical Symposium', date: '2024-04-10', description: 'Department technical event', type: 'academic' },
    { id: '3', title: 'Mid-Semester Exams Begin', date: '2024-03-30', description: 'Mid-semester examinations start', type: 'academic' },
    { id: '4', title: 'Workshop on AI', date: '2024-04-15', description: 'Workshop on artificial intelligence applications', type: 'academic' },
    { id: '5', title: 'Cultural Fest', date: '2024-04-20', description: 'Annual cultural festival', type: 'cultural' },
  ];

  // Calculate weighted average for each subject
  const calculateWeightedAverage = (grades: any[]) => {
    return grades.reduce((acc, grade) => acc + (grade.score * grade.weight), 0);
  };

  // Get overall attendance across all subjects
  const getOverallAttendance = () => {
    const sum = subjects.reduce((acc, subject) => acc + subject.attendance, 0);
    return (sum / subjects.length).toFixed(1);
  };

  // Get pending assignments count
  const getPendingAssignmentsCount = () => {
    return assignments.filter(a => a.status === 'pending').length;
  };

  // Get upcoming events (next 7 days)
  const getUpcomingEvents = () => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= today && eventDate <= nextWeek;
    });
  };

  const renderHighPriorityNotices = () => {
    const highPriorityNotices = notices.filter(notice => notice.priority === 'high');
    return (
      <div className="bg-white rounded-xl shadow p-3 text-xs">
        <div className="flex items-center mb-4">
          <Bell className="h-5 w-5 text-primary-700 mr-2" />
          <h3 className="font-semibold text-primary-900">Important Notices</h3>
        </div>
        <div className="space-y-3">
          {highPriorityNotices.map(notice => (
            <div key={notice.id} className="border-l-4 border-red-500 pl-3 py-2">
              <h4 className="font-medium text-primary-800">{notice.title}</h4>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notice.content}</p>
              <p className="text-xs text-primary-600 mt-1">
                {format(new Date(notice.date), 'MMM dd, yyyy')}
              </p>
            </div>
          ))}
          {highPriorityNotices.length === 0 && (
            <p className="text-sm text-gray-500">No important notices at this time</p>
          )}
        </div>
        <button 
          onClick={() => setActiveTab('notices')}
          className="mt-3 text-sm text-primary-700 hover:text-primary-900 flex items-center"
        >
          View all notices
        </button>
      </div>
    );
  };

  const renderCalendarWithEvents = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
  
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null); // Fill initial empty days
    }
  
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
  
    const dayHasEvent = (day: number) => {
      if (!day) return false;
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return events.some(event => event.date.startsWith(dateStr));
    };
  
    return (
      <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-primary-900">
            {format(new Date(currentYear, currentMonth), 'MMMM yyyy')}
          </h3>
          <div className="flex space-x-2">
            <button className="p-1 rounded hover:bg-gray-100">
              <Calendar className="h-5 w-5 text-primary-700" />
            </button>
          </div>
        </div>
  
        <div className="grid grid-cols-7 gap-0.5 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
  
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div
              key={index}
              className={`aspect-square p-1 rounded-full text-center flex flex-col justify-center items-center ${
                day === currentDate.getDate() ? 'border border-primary-500 bg-primary-50' : 'border border-transparent'
              } ${day ? 'hover:bg-gray-100 cursor-pointer' : ''}`}
            >
              {day && (
                <>
                  <div className={`text-sm leading-none ${
                    day === currentDate.getDate() ? 'font-bold text-primary-700' : 'text-gray-700'
                  }`}>
                    {day}
                  </div>
                  {dayHasEvent(day) && (
                    <div className="h-1.5 w-1.5 rounded-full bg-primary-500 mt-1" />
                  )}
                </>
              )}
            </div>
          ))}
        </div>
  
        <button
          onClick={() => setActiveTab('calendar')}
          className="mt-3 text-sm text-primary-700 hover:text-primary-900 flex items-center"
        >
          View all events
        </button>
      </div>
    );
  };

  const renderAttendanceSummary = () => {
    return (
      <div className="flex flex-col gap-4 w-full max-w-xs">
        {subjects.map(subject => (
          <div key={subject.id} className="bg-white rounded-lg shadow-md p-4">
            <h4 className="font-medium text-primary-800">{subject.name}</h4>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-600">Attendance</span>
              <span
                className={`text-sm font-medium ${
                  subject.attendance < 75
                    ? 'text-red-600'
                    : subject.attendance < 85
                    ? 'text-yellow-600'
                    : 'text-green-600'
                }`}
              >
                {subject.attendance}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div
                className={`rounded-full h-2 ${
                  subject.attendance < 75
                    ? 'bg-red-500'
                    : subject.attendance < 85
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${subject.attendance}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSubjectCard = (subject: Subject) => {
    const weightedAverage = calculateWeightedAverage(subject.grades || []);
    const gradeData = subject.grades?.map((g) => ({
      name: g.assessment,
      score: g.score,
      average: weightedAverage
    }));

    return (
      <div key={subject.id} className="bg-white p-4 rounded-xl shadow-sm transition transform hover:scale-[1.01]">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-primary-900">{subject.name}</h3>
            <p className="text-sm text-gray-600">Code: {subject.code}</p>
            <p className="text-sm text-gray-600">Teacher: {subject.teacher}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-700">{weightedAverage.toFixed(1)}%</div>
            <div className="text-sm text-gray-500">Overall Grade</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Attendance</span>
            <span className="text-sm font-semibold text-primary-700">{subject.attendance}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-500 rounded-full h-2 transition-all duration-300"
              style={{ width: `${subject.attendance}%` }}
            ></div>
          </div>
        </div>

        <div className="h-48 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gradeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="score" fill="#0077B6" name="Score" />
              <Line type="monotone" dataKey="average" stroke="#03045E" name="Average" strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          {subject.grades && subject.grades.map((grade, index) => (
            <div key={index} className="bg-primary-100 p-3 rounded-lg">
              <div className="text-sm font-medium text-primary-900">{grade.assessment}</div>
              <div className="text-lg font-semibold text-primary-700">{grade.score}%</div>
              <div className="text-xs text-gray-600">Weight: {grade.weight * 100}%</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderHomePage = () => {
    return (
      <div className="space-y-6">
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
            <div className="rounded-full bg-primary-100 p-3 mr-4">
              <BookOpen className="h-6 w-6 text-primary-700" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Overall Attendance</p>
              <p className="text-2xl font-bold text-primary-800">{getOverallAttendance()}%</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
            <div className="rounded-full bg-yellow-100 p-3 mr-4">
              <CheckSquare className="h-6 w-6 text-yellow-700" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Assignments</p>
              <p className="text-2xl font-bold text-yellow-800">{getPendingAssignmentsCount()}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <Calendar className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Upcoming Events</p>
              <p className="text-2xl font-bold text-green-800">{getUpcomingEvents().length}</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar (1/3 width) */}
          <div>
            {renderCalendarWithEvents()}
          </div>

          {/* Notices (1/3 width) */}
          <div>
            {renderHighPriorityNotices()}
          </div>

          {/* Attendance Summary (1/3 width) */}
          <div>
            <h3 className="font-semibold text-primary-900 mb-3">Attendance Summary</h3>
            {renderAttendanceSummary()}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHomePage();

      case 'subjects':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {subjects.map(renderSubjectCard)}
          </div>
        );

      case 'assignments':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-4 px-2">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-primary-900">
                      {assignment.title}
                    </h3>
                    <p className="text-sm text-primary-700 mt-1">{assignment.subject}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      assignment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : assignment.status === 'submitted'
                        ? 'bg-primary-100 text-primary-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {assignment.status}
                  </span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Due: {format(new Date(assignment.dueDate), 'MMM dd, yyyy')}
                  </p>
                  {assignment.grade && (
                    <span className="text-sm font-semibold text-primary-700">
                      Grade: {assignment.grade}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        );

      case 'calendar':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-primary-900">{event.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      event.type === 'academic'
                        ? 'bg-primary-100 text-primary-800'
                        : event.type === 'cultural'
                        ? 'bg-purple-100 text-purple-800'
                        : event.type === 'sports'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {event.type}
                  </span>
                </div>
                <p className="text-sm text-primary-700 mt-4">
                  {format(new Date(event.date), 'MMMM dd, yyyy')}
                </p>
              </div>
            ))}
          </div>
        );

      case 'notices':
        return (
          <div className="space-y-4">
            {notices.map((notice) => (
              <div key={notice.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-primary-900">{notice.title}</h3>
                    <p className="text-sm text-gray-600 mt-2">{notice.content}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      notice.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : notice.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {notice.priority}
                  </span>
                </div>
                <p className="text-sm text-primary-700 mt-4">
                  Posted: {format(new Date(notice.date), 'MMM dd, yyyy')}
                </p>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const navigation = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'subjects', icon: BookOpen, label: 'Subjects' },
    { id: 'assignments', icon: CheckSquare, label: 'Assignments' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'notices', icon: Bell, label: 'Notices' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Vertical Navigation - Desktop */}
      <div className="hidden md:flex flex-col w-64 bg-primary-900 text-white shadow-lg">
        <div className="p-4 border-b border-primary-700 flex items-center">
          <GraduationCap className="h-8 w-8 text-primary-300" />
          <div className="ml-3">
            <h1 className="text-lg font-bold">Student Portal</h1>
          </div>
        </div>
        
        <div className="p-4 border-b border-primary-700 flex flex-col">
          <p className="text-primary-300 text-sm">Welcome,</p>
          <p className="font-medium">{user.name}</p>
        </div>
        
        <div className="flex-1 py-4 overflow-y-auto">
          <ul>
            {navigation.map(({ id, icon: Icon, label }) => (
              <li key={id}>
                <button
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center px-4 py-3 text-sm ${
                    activeTab === id
                      ? 'bg-primary-800 text-white'
                      : 'text-primary-300 hover:bg-primary-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-4 border-t border-primary-700">
          <button
            onClick={onLogout}
            className="w-full flex items-center px-4 py-2 text-primary-300 hover:text-white transition-colors rounded-md hover:bg-primary-800"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation Toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-primary-900 p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center text-white">
          <GraduationCap className="h-6 w-6 text-primary-300" />
          <h1 className="ml-2 text-lg font-bold">Student Portal</h1>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white p-1"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-10 bg-black bg-opacity-50"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute top-14 left-0 bottom-0 w-64 bg-primary-900 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-primary-700">
              <p className="text-primary-300 text-sm">Welcome,</p>
              <p className="text-white font-medium">{user.name}</p>
            </div>
            
            <div className="py-4">
              <ul>
                {navigation.map(({ id, icon: Icon, label }) => (
                  <li key={id}>
                    <button
                      onClick={() => {
                        setActiveTab(id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center px-4 py-3 text-sm ${
                        activeTab === id
                          ? 'bg-primary-800 text-white'
                          : 'text-primary-300 hover:bg-primary-800 hover:text-white'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary-700">
              <button
                onClick={onLogout}
                className="w-full flex items-center px-4 py-2 text-primary-300 hover:text-white transition-colors rounded-md hover:bg-primary-800"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm md:mt-0 mt-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-xl font-bold text-primary-900">
              {navigation.find((item) => item.id === activeTab)?.label}
            </h1>
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {renderContent()}
        </main>
      </div>

      {/* Chatbot Widget (fixed at bottom-right) */}
      <ChatbotWidget />
    </div>
  );
};

export default StudentDashboard;