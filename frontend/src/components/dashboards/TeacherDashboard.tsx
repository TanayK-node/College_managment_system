import React, { useState, useEffect } from 'react';
import { ClipboardCheck, LogOut, Calendar, ClipboardList, Clock, CheckSquare, FileText, Home, PlusCircle, Users, Search } from 'lucide-react';
import { format } from 'date-fns';

type User = {
  id: string;
  name: string;
  email: string;
};

type TimeSlot = {
  id: string;
  day: string;
  time: string;
  subject: string;
  class: string;
  room: string;
};

type Assignment = {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'pending' | 'submitted';
  submissions: number;
  description: string;
  class: string;
};

type Test = {
  id: string;
  title: string;
  subject: string;
  date: string;
  duration: string;
  totalMarks: number;
  class: string;
  status: 'scheduled' | 'ongoing' | 'completed';
};

type StudentSubmission = {
  id: string;
  studentName: string;
  studentId: string;
  assignmentId: string;
  submissionDate: string;
  status: 'pending' | 'graded';
  grade?: string;
  feedback?: string;
};

type AssignmentFilter = 'all' | 'pending' | 'submitted';
type TestFilter = 'all' | 'scheduled' | 'completed';

interface TeacherDashboardProps {
  user: User;
  onLogout: () => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [showScheduleTest, setShowScheduleTest] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmission | null>(null);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [enteredMarks, setEnteredMarks] = useState<number>(0);
  const [assignmentFilter, setAssignmentFilter] = useState<AssignmentFilter>('all');
  const [testFilter, setTestFilter] = useState<TestFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [editingTest, setEditingTest] = useState<Test | null>(null);

  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    class: 'Class X-A'
  });

  const [newTest, setNewTest] = useState({
    title: '',
    date: '',
    duration: '1 hour',
    totalMarks: 100,
    class: 'Class X-A'
  });

  const [timetable] = useState<TimeSlot[]>([
    { id: '1', day: 'Monday', time: '09:00 AM', subject: 'Mathematics', class: 'Class X-A', room: 'Room 101' },
    { id: '2', day: 'Monday', time: '11:00 AM', subject: 'Mathematics', class: 'Class X-B', room: 'Room 102' },
    { id: '3', day: 'Tuesday', time: '10:00 AM', subject: 'Mathematics', class: 'Class XI-A', room: 'Room 201' },
    { id: '4', day: 'Wednesday', time: '09:00 AM', subject: 'Mathematics', class: 'Class XI-B', room: 'Room 202' },
  ]);

  const [assignments, setAssignments] = useState<Assignment[]>([
    { 
      id: '1', 
      title: 'Calculus Assignment', 
      subject: 'Mathematics', 
      dueDate: '2024-03-25', 
      status: 'pending',
      submissions: 15,
      description: 'Solve problems on differential equations',
      class: 'Class X-A'
    },
    { 
      id: '2', 
      title: 'Algebra Quiz', 
      subject: 'Mathematics', 
      dueDate: '2024-03-28', 
      status: 'submitted',
      submissions: 20,
      description: 'Complete the quiz on quadratic equations',
      class: 'Class X-B'
    },
  ]);

  const [tests, setTests] = useState<Test[]>([
    { 
      id: '1', 
      title: 'Mid-Term Test', 
      subject: 'Mathematics', 
      date: '2024-04-10', 
      duration: '2 hours',
      totalMarks: 50,
      class: 'Class X-A',
      status: 'scheduled'
    },
    { 
      id: '2', 
      title: 'Unit Test', 
      subject: 'Mathematics', 
      date: '2024-03-28', 
      duration: '1 hour',
      totalMarks: 25,
      class: 'Class XI-B',
      status: 'completed'
    },
  ]);

  const [submissions, setSubmissions] = useState<StudentSubmission[]>([
    {
      id: '1',
      studentName: 'Alice Johnson',
      studentId: 'STU001',
      assignmentId: '1',
      submissionDate: '2024-03-20',
      status: 'pending'
    },
    {
      id: '2',
      studentName: 'Bob Smith',
      studentId: 'STU002',
      assignmentId: '1',
      submissionDate: '2024-03-21',
      status: 'graded',
      grade: 'A',
      feedback: 'Excellent work on the problems!'
    },
  ]);

  useEffect(() => {
    if (selectedTest) {
      setEnteredMarks(selectedTest.totalMarks);
    }
  }, [selectedTest]);

  const handleCreateAssignment = () => {
    if (newAssignment.title && newAssignment.dueDate) {
      const newAssignmentWithId = {
        ...newAssignment,
        id: `A${assignments.length + 1}`,
        status: 'pending',
        submissions: 0,
        subject: 'Mathematics'
      };
      setAssignments([...assignments, newAssignmentWithId]);
      setShowCreateAssignment(false);
      setNewAssignment({ title: '', description: '', dueDate: '', class: 'Class X-A' });
    }
  };

  const handleScheduleTest = () => {
    if (newTest.title && newTest.date) {
      const newTestWithId = {
        ...newTest,
        id: `T${tests.length + 1}`,
        status: 'scheduled',
        subject: 'Mathematics'
      };
      setTests([...tests, newTestWithId]);
      setShowScheduleTest(false);
      setNewTest({ title: '', date: '', duration: '1 hour', totalMarks: 100, class: 'Class X-A' });
    }
  };

  const handleGradeSubmission = (grade: string, feedback: string) => {
    if (selectedSubmission) {
      const updatedSubmissions = submissions.map(sub => 
        sub.id === selectedSubmission.id ? { ...sub, grade, feedback, status: 'graded' } : sub
      );
      setSubmissions(updatedSubmissions);
      setSelectedSubmission(null);
    }
  };

  const handleMarkAsCompleted = (testId: string) => {
    const updatedTests = tests.map(test => 
      test.id === testId ? { ...test, status: 'completed' } : test
    );
    setTests(updatedTests);
  };

  const handleSaveMarks = () => {
    if (selectedTest) {
      const updatedTests = tests.map(test => 
        test.id === selectedTest.id ? { ...test, totalMarks: enteredMarks } : test
      );
      setTests(updatedTests);
      setSelectedTest(null);
    }
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    const filteredAssignments = assignments.filter(a => a.id !== assignmentId);
    setAssignments(filteredAssignments);
  };

  const handleDeleteTest = (testId: string) => {
    const filteredTests = tests.filter(t => t.id !== testId);
    setTests(filteredTests);
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setNewAssignment({
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      class: assignment.class
    });
    setShowCreateAssignment(true);
  };

  const handleEditTest = (test: Test) => {
    setEditingTest(test);
    setNewTest({
      title: test.title,
      date: test.date,
      duration: test.duration,
      totalMarks: test.totalMarks,
      class: test.class
    });
    setShowScheduleTest(true);
  };

  const filteredAssignments = assignments
    .filter(a => 
      (assignmentFilter === 'all' || a.status === assignmentFilter) &&
      a.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const filteredTests = tests
    .filter(t => 
      (testFilter === 'all' || t.status === testFilter) &&
      t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const renderDashboard = () => (
    <div className="p-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#1a237e]">Active Classes</h3>
              <p className="text-3xl font-bold text-[#1a237e] mt-2">4</p>
            </div>
            <Users className="h-12 w-12 text-[#1a237e]/30" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#1a237e]">Pending Submissions</h3>
              <p className="text-3xl font-bold text-[#1a237e] mt-2">
                {submissions.filter(s => s.status === 'pending').length}
              </p>
            </div>
            <CheckSquare className="h-12 w-12 text-[#1a237e]/30" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#1a237e]">Upcoming Tests</h3>
              <p className="text-3xl font-bold text-[#1a237e] mt-2">
                {tests.filter(t => t.status === 'scheduled').length}
              </p>
            </div>
            <FileText className="h-12 w-12 text-[#1a237e]/30" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#1a237e]">Recent Assignments</h2>
            <PlusCircle 
              className="h-6 w-6 text-[#1a237e] cursor-pointer hover:text-[#303f9f]"
              onClick={() => setShowCreateAssignment(true)}
            />
          </div>
          <div className="space-y-4">
            {assignments.slice(0, 3).map(assignment => (
              <div key={assignment.id} className="flex items-center justify-between p-4 bg-[#f5f5f5] rounded-xl">
                <div>
                  <h4 className="font-medium text-[#1a237e]">{assignment.title}</h4>
                  <p className="text-sm text-gray-500">{assignment.class}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  assignment.status === 'pending' 
                    ? 'bg-[#e8eaf6] text-[#1a237e]' 
                    : 'bg-[#1a237e] text-white'
                }`}>
                  {assignment.submissions} submissions
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#1a237e]">March 2025</h2>
            <Calendar className="h-6 w-6 text-[#1a237e]" />
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-sm font-medium text-[#1a237e] p-2">{day}</div>
            ))}
            {[
              2, 3, 4, 5, 6, 7, 8, 
              9, 10, 11, 12, 13, 14, 15,
              16, 17, 18, 19, 20, 21, 22,
              23, 24, 25, 26, 27, 28, 29,
              30, 31
            ].map(day => (
              <div 
                key={day} 
                className="h-8 w-8 flex items-center justify-center rounded-full text-sm 
                  hover:bg-[#1a237e] hover:text-white cursor-pointer transition-colors"
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#1a237e]">Upcoming Tests</h2>
          <PlusCircle 
            className="h-6 w-6 text-[#1a237e] cursor-pointer hover:text-[#303f9f]"
            onClick={() => setShowScheduleTest(true)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tests.slice(0, 2).map(test => (
            <div key={test.id} className="p-4 bg-[#f5f5f5] rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-medium text-[#1a237e]">{test.title}</h4>
                <p className="text-sm text-gray-500">{test.class}</p>
              </div>
              <span className="text-sm text-[#1a237e]">
                {format(new Date(test.date), 'MMM dd')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTimetable = () => (
    <div className="p-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#e8eaf6]">
            <tr>
              <th className="p-4 text-left text-[#1a237e]">Day</th>
              <th className="p-4 text-left text-[#1a237e]">Time</th>
              <th className="p-4 text-left text-[#1a237e]">Class</th>
              <th className="p-4 text-left text-[#1a237e]">Room</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {timetable.map((slot) => (
              <tr key={slot.id} className="hover:bg-gray-50">
                <td className="p-4 text-[#1a237e]">{slot.day}</td>
                <td className="p-4 text-[#1a237e]">{slot.time}</td>
                <td className="p-4 text-[#1a237e]">{slot.class}</td>
                <td className="p-4 text-[#1a237e]">{slot.room}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAssignments = () => (
    <div className="p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-[#1a237e]">Assignments Management</h2>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search assignments..."
              className="w-full p-2 pl-10 border rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          </div>
          <select
            className="p-2 border rounded-lg"
            value={assignmentFilter}
            onChange={(e) => setAssignmentFilter(e.target.value as AssignmentFilter)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="submitted">Submitted</option>
          </select>
          <button
            onClick={() => {
              setEditingAssignment(null);
              setShowCreateAssignment(true);
            }}
            className="px-4 py-2 bg-[#1a237e] text-white rounded-lg hover:bg-[#303f9f] flex items-center gap-2"
          >
            <PlusCircle className="h-5 w-5" />
            <span>New Assignment</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#e8eaf6]">
            <tr>
              <th className="p-4 text-left text-[#1a237e]">Title</th>
              <th className="p-4 text-left text-[#1a237e]">Class</th>
              <th className="p-4 text-left text-[#1a237e]">Due Date</th>
              <th className="p-4 text-left text-[#1a237e]">Submissions</th>
              <th className="p-4 text-left text-[#1a237e]">Status</th>
              <th className="p-4 text-left text-[#1a237e]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAssignments.map(assignment => (
              <tr key={assignment.id} className="hover:bg-gray-50">
                <td className="p-4 text-[#1a237e] font-medium">{assignment.title}</td>
                <td className="p-4 text-[#1a237e]">{assignment.class}</td>
                <td className="p-4 text-[#1a237e]">
                  {format(new Date(assignment.dueDate), 'MMM dd, yyyy')}
                </td>
                <td className="p-4 text-[#1a237e]">{assignment.submissions}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    assignment.status === 'pending' 
                      ? 'bg-[#e8eaf6] text-[#1a237e]' 
                      : 'bg-[#1a237e] text-white'
                  }`}>
                    {assignment.status}
                  </span>
                </td>
                <td className="p-4 flex items-center gap-3">
                  <button
                    onClick={() => handleEditAssignment(assignment)}
                    className="text-[#1a237e] hover:text-[#303f9f]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAssignment(assignment.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('submissions');
                      setSelectedSubmission(submissions.find(s => s.assignmentId === assignment.id) || null);
                    }}
                    className="text-[#1a237e] hover:text-[#303f9f]"
                  >
                    View Submissions
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTests = () => (
    <div className="p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-[#1a237e]">Tests Management</h2>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search tests..."
              className="w-full p-2 pl-10 border rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          </div>
          <select
            className="p-2 border rounded-lg"
            value={testFilter}
            onChange={(e) => setTestFilter(e.target.value as TestFilter)}
          >
            <option value="all">All</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
          </select>
          <button
            onClick={() => {
              setEditingTest(null);
              setShowScheduleTest(true);
            }}
            className="px-4 py-2 bg-[#1a237e] text-white rounded-lg hover:bg-[#303f9f] flex items-center gap-2"
          >
            <PlusCircle className="h-5 w-5" />
            <span>New Test</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#e8eaf6]">
            <tr>
              <th className="p-4 text-left text-[#1a237e]">Title</th>
              <th className="p-4 text-left text-[#1a237e]">Class</th>
              <th className="p-4 text-left text-[#1a237e]">Date</th>
              <th className="p-4 text-left text-[#1a237e]">Duration</th>
              <th className="p-4 text-left text-[#1a237e]">Marks</th>
              <th className="p-4 text-left text-[#1a237e]">Status</th>
              <th className="p-4 text-left text-[#1a237e]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredTests.map(test => (
              <tr key={test.id} className="hover:bg-gray-50">
                <td className="p-4 text-[#1a237e] font-medium">{test.title}</td>
                <td className="p-4 text-[#1a237e]">{test.class}</td>
                <td className="p-4 text-[#1a237e]">
                  {format(new Date(test.date), 'MMM dd, yyyy')}
                </td>
                <td className="p-4 text-[#1a237e]">{test.duration}</td>
                <td className="p-4 text-[#1a237e]">{test.totalMarks}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    test.status === 'scheduled' 
                      ? 'bg-[#e8eaf6] text-[#1a237e]' 
                      : 'bg-[#1a237e] text-white'
                  }`}>
                    {test.status}
                  </span>
                </td>
                <td className="p-4 flex items-center gap-3">
                  <button
                    onClick={() => handleEditTest(test)}
                    className="text-[#1a237e] hover:text-[#303f9f]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTest(test.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                  {test.status === 'scheduled' && (
                    <button
                      onClick={() => handleMarkAsCompleted(test.id)}
                      className="text-[#1a237e] hover:text-[#303f9f]"
                    >
                      Mark Completed
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSubmissions = () => (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold text-[#1a237e]">Student Submissions</h2>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#e8eaf6]">
            <tr>
              <th className="p-4 text-left text-[#1a237e]">Student</th>
              <th className="p-4 text-left text-[#1a237e]">Assignment</th>
              <th className="p-4 text-left text-[#1a237e]">Submission Date</th>
              <th className="p-4 text-left text-[#1a237e]">Status</th>
              <th className="p-4 text-left text-[#1a237e]">Grade</th>
              <th className="p-4 text-left text-[#1a237e]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {submissions.map(submission => (
              <tr key={submission.id} className="hover:bg-gray-50">
                <td className="p-4 text-[#1a237e]">
                  <div className="font-medium">{submission.studentName}</div>
                  <div className="text-sm text-gray-500">{submission.studentId}</div>
                </td>
                <td className="p-4 text-[#1a237e]">
                  {assignments.find(a => a.id === submission.assignmentId)?.title}
                </td>
                <td className="p-4 text-[#1a237e]">
                  {format(new Date(submission.submissionDate), 'MMM dd, yyyy')}
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    submission.status === 'pending' 
                      ? 'bg-[#e8eaf6] text-[#1a237e]' 
                      : 'bg-[#1a237e] text-white'
                  }`}>
                    {submission.status}
                  </span>
                </td>
                <td className="p-4 text-[#1a237e]">{submission.grade || '-'}</td>
                <td className="p-4">
                  <button
                    onClick={() => setSelectedSubmission(submission)}
                    className="text-[#1a237e] hover:text-[#303f9f]"
                  >
                    {submission.status === 'pending' ? 'Grade' : 'View'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderNavbar = () => (
    <nav className="w-20 lg:w-64 h-screen bg-white shadow-xl fixed left-0 flex flex-col">
      <div className="p-4 mb-8 flex items-center justify-center lg:justify-start">
        <ClipboardCheck className="h-8 w-8 text-[#1a237e] mr-2" />
        <span className="hidden lg:inline text-xl font-bold text-[#1a237e]">TeachPortal</span>
      </div>

      <div className="flex-1 space-y-2 px-2">
        {[
          { id: 'dashboard', icon: Home, label: 'Dashboard' },
          { id: 'timetable', icon: Clock, label: 'Timetable' },
          { id: 'assignments', icon: ClipboardList, label: 'Assignments' },
          { id: 'tests', icon: FileText, label: 'Tests' },
          { id: 'submissions', icon: CheckSquare, label: 'Submissions' },
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all
              ${activeTab === id 
                ? 'bg-[#1a237e] text-white shadow-md' 
                : 'text-[#1a237e] hover:bg-[#e8eaf6] hover:shadow-sm'}`}
          >
            <Icon className="h-6 w-6 min-w-[24px]" />
            <span className="hidden lg:inline text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>

      <div className="p-4 mt-auto">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 p-3 text-[#1a237e] hover:bg-[#e8eaf6] rounded-xl"
        >
          <LogOut className="h-6 w-6" />
          <span className="hidden lg:inline text-sm font-medium">Logout</span>
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {renderNavbar()}
      
      <main className="ml-20 lg:ml-64 min-h-screen">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'timetable' && renderTimetable()}
        {activeTab === 'assignments' && renderAssignments()}
        {activeTab === 'tests' && renderTests()}
        {activeTab === 'submissions' && renderSubmissions()}
      </main>

      {showCreateAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl w-96 space-y-4">
            <h3 className="text-xl font-bold text-[#1a237e]">
              {editingAssignment ? 'Edit Assignment' : 'Create Assignment'}
            </h3>
            <input
              type="text"
              placeholder="Assignment Title"
              className="w-full p-3 border rounded-lg"
              value={newAssignment.title}
              onChange={e => setNewAssignment({...newAssignment, title: e.target.value})}
            />
            <textarea
              placeholder="Description"
              className="w-full p-3 border rounded-lg"
              value={newAssignment.description}
              onChange={e => setNewAssignment({...newAssignment, description: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                className="p-3 border rounded-lg"
                value={newAssignment.dueDate}
                onChange={e => setNewAssignment({...newAssignment, dueDate: e.target.value})}
              />
              <select
                className="p-3 border rounded-lg"
                value={newAssignment.class}
                onChange={e => setNewAssignment({...newAssignment, class: e.target.value})}
              >
                <option>Class X-A</option>
                <option>Class X-B</option>
                <option>Class XI-A</option>
                <option>Class XI-B</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => {
                  setShowCreateAssignment(false);
                  setEditingAssignment(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (editingAssignment) {
                    setAssignments(assignments.map(a => 
                      a.id === editingAssignment.id ? { ...a, ...newAssignment } : a
                    ));
                  } else {
                    handleCreateAssignment();
                  }
                  setShowCreateAssignment(false);
                  setEditingAssignment(null);
                }}
                className="px-4 py-2 bg-[#1a237e] text-white rounded-lg"
              >
                {editingAssignment ? 'Save Changes' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showScheduleTest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl w-96 space-y-4">
            <h3 className="text-xl font-bold text-[#1a237e]">
              {editingTest ? 'Edit Test' : 'Schedule New Test'}
            </h3>
            <input
              type="text"
              placeholder="Test Title"
              className="w-full p-3 border rounded-lg"
              value={newTest.title}
              onChange={e => setNewTest({...newTest, title: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                className="p-3 border rounded-lg"
                value={newTest.date}
                onChange={e => setNewTest({...newTest, date: e.target.value})}
              />
              <select
                className="p-3 border rounded-lg"
                value={newTest.class}
                onChange={e => setNewTest({...newTest, class: e.target.value})}
              >
                <option>Class X-A</option>
                <option>Class X-B</option>
                <option>Class XI-A</option>
                <option>Class XI-B</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Duration"
                className="p-3 border rounded-lg"
                value={newTest.duration}
                onChange={e => setNewTest({...newTest, duration: e.target.value})}
              />
              <input
                type="number"
                placeholder="Total Marks"
                className="p-3 border rounded-lg"
                value={newTest.totalMarks}
                onChange={e => setNewTest({...newTest, totalMarks: Number(e.target.value)})}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => {
                  setShowScheduleTest(false);
                  setEditingTest(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (editingTest) {
                    setTests(tests.map(t => 
                      t.id === editingTest.id ? { ...t, ...newTest } : t
                    ));
                  } else {
                    handleScheduleTest();
                  }
                  setShowScheduleTest(false);
                  setEditingTest(null);
                }}
                className="px-4 py-2 bg-[#1a237e] text-white rounded-lg"
              >
                {editingTest ? 'Save Changes' : 'Schedule'}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl w-96 space-y-4">
            <h3 className="text-xl font-bold text-[#1a237e]">Grade Submission</h3>
            <div className="space-y-2">
              <p className="font-medium text-[#1a237e]">{selectedSubmission.studentName}</p>
              <p className="text-sm text-gray-500">{selectedSubmission.studentId}</p>
              <select
                className="w-full p-3 border rounded-lg"
                value={selectedSubmission.grade || ''}
                onChange={e => handleGradeSubmission(e.target.value, selectedSubmission.feedback || '')}
              >
                <option value="">Select Grade</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
              <textarea
                placeholder="Add feedback..."
                className="w-full p-3 border rounded-lg"
                value={selectedSubmission.feedback || ''}
                onChange={e => handleGradeSubmission(selectedSubmission.grade || '', e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleGradeSubmission(selectedSubmission.grade || '', selectedSubmission.feedback || '')}
                className="px-4 py-2 bg-[#1a237e] text-white rounded-lg"
              >
                Save Grade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;