import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import StudentDashboard from './components/StudentDashboard/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard/TeacherDashboard';
import './App.css';

function App() {
  useEffect(() => {
    // Initialize with empty data structure if not exists
    if (!localStorage.getItem('dataInitialized')) {
      // Clear any existing data
      localStorage.clear();
      
      // Initialize with empty arrays and proper structure
      localStorage.setItem('students', JSON.stringify([]));
      localStorage.setItem('teachers', JSON.stringify([]));
      localStorage.setItem('dataInitialized', 'true');
    }

    // Validate existing data structure
    try {
      const students = JSON.parse(localStorage.getItem('students') || '[]');
      const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');

      // Ensure each student has the correct data structure
      const validatedStudents = students.map(student => ({
        ...student,
        subjects: {
          Math: { marks: 0, attendance: 0 },
          Science: { marks: 0, attendance: 0 },
          English: { marks: 0, attendance: 0 },
          History: { marks: 0, attendance: 0 },
          Computer: { marks: 0, attendance: 0 },
          ...student.subjects
        }
      }));

      // Update storage with validated data
      localStorage.setItem('students', JSON.stringify(validatedStudents));
      localStorage.setItem('teachers', JSON.stringify(teachers));
    } catch (error) {
      console.error('Data structure validation failed:', error);
      localStorage.clear();
      localStorage.setItem('students', JSON.stringify([]));
      localStorage.setItem('teachers', JSON.stringify([]));
      localStorage.setItem('dataInitialized', 'true');
    }
  }, []);
  return (
    // Use PUBLIC_URL as basename so routing works when deployed to GitHub Pages
    <Router basename={process.env.PUBLIC_URL}>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
