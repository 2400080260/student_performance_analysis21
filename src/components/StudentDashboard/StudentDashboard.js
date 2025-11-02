import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './StudentDashboard.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser || loggedInUser.role !== "student") {
      navigate('/');
      return;
    }

    const students = JSON.parse(localStorage.getItem("students"));
    const student = students.find(s => s.id === loggedInUser.id);
    setStudentData(student);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate('/');
  };

  if (!studentData) return <div>Loading...</div>;

  const chartData = {
    labels: Object.keys(studentData.subjects),
    datasets: [
      {
        label: 'Marks',
        data: Object.values(studentData.subjects).map(subject => subject.marks),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Attendance',
        data: Object.values(studentData.subjects).map(subject => subject.attendance),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      }
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="dashboard">
      <h2>Welcome, {studentData.name}</h2>
      <div className="subject-stats">
        <h3>Subject-wise Performance</h3>
        <div className="stats-grid">
          {Object.entries(studentData.subjects).map(([subject, data]) => (
            <div key={subject} className="stat-card">
              <h4>{subject}</h4>
              <div className="stat-details">
                <p>Marks: <span>{data.marks}%</span></p>
                <p>Attendance: <span>{data.attendance}%</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="chart-container">
        <h3>Performance Chart</h3>
        <Bar data={chartData} options={chartOptions} />
      </div>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default StudentDashboard;