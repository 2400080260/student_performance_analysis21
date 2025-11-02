import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState('student');
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Get data from localStorage
  const getData = () => {
    return {
      students: JSON.parse(localStorage.getItem("students")) || [],
      teachers: JSON.parse(localStorage.getItem("teachers")) || []
    };
  };

  const handleSignUp = () => {
    if (!id || !name || !password || !confirmPassword) {
      setErrorMessage("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    const { students, teachers } = getData();

    if (role === "student") {
      const existingStudent = students.find(s => s.id === id);
      if (existingStudent) {
        setErrorMessage("Student ID already exists");
        return;
      }

      const newStudent = {
        id,
        name,
        password,
        subjects: {
          Math: { marks: 0, attendance: 0 },
          Science: { marks: 0, attendance: 0 },
          English: { marks: 0, attendance: 0 },
          History: { marks: 0, attendance: 0 },
          Computer: { marks: 0, attendance: 0 }
        }
      };

      const updatedStudents = [...students, newStudent];
      localStorage.setItem("students", JSON.stringify(updatedStudents));
    } else {
      const existingTeacher = teachers.find(t => t.id === id);
      if (existingTeacher) {
        setErrorMessage("Teacher ID already exists");
        return;
      }

      const newTeacher = {
        id,
        name,
        password // Store the actual password
      };

      const updatedTeachers = [...teachers, newTeacher];
      localStorage.setItem("teachers", JSON.stringify(updatedTeachers));
    }
    
    setSuccessMessage("Registration successful! You can now login");
    setTimeout(() => {
      setIsSignUp(false);
      setSuccessMessage("");
      clearForm();
    }, 2000);
  };

  const handleLogin = () => {
    const { students, teachers } = getData();

    if (role === "student") {
      const student = students.find(s => s.id === id);
      if (!student) {
        setErrorMessage("Invalid Student ID");
        return;
      }
      if (password === student.password) {
        localStorage.setItem("loggedInUser", JSON.stringify({ role, id }));
        navigate('/student-dashboard');
      } else {
        setErrorMessage("Incorrect Password");
      }
    } else if (role === "teacher") {
      const teacher = teachers.find(t => t.id === id);
      if (!teacher) {
        setErrorMessage("Invalid Teacher ID");
        return;
      }
      if (password === teacher.password) {
        localStorage.setItem("loggedInUser", JSON.stringify({ role, id }));
        navigate('/teacher-dashboard');
      } else {
        setErrorMessage("Incorrect Password");
      }
    }
  };

  const clearForm = () => {
    setId('');
    setName('');
    setPassword('');
    setConfirmPassword('');
    setErrorMessage('');
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    clearForm();
  };

  return (
    <div className="container login-page">
      <h1>Student Performance Analysis</h1>
      <div className="form-container">
        <div className="form-header">
          <button 
            className={!isSignUp ? 'active' : ''} 
            onClick={() => setIsSignUp(false)}
          >
            Login
          </button>
          <button 
            className={isSignUp ? 'active' : ''} 
            onClick={() => setIsSignUp(true)}
          >
            Sign Up
          </button>
        </div>

        <select 
          value={role} 
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
        <br />

        <input
          type="text"
          placeholder="Enter ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <br />

        {isSignUp && (
          <>
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <br />
          </>
        )}

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />

        {isSignUp && (
          <>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <br />
          </>
        )}

        <button onClick={isSignUp ? handleSignUp : handleLogin}>
          {isSignUp ? 'Sign Up' : 'Login'}
        </button>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
    </div>
  );
};

export default Login;