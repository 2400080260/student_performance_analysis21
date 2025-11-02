import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
  const [students, setStudents] = useState([]);
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!loggedInUser || loggedInUser.role !== "teacher") {
        navigate('/');
        return;
      }

      const studentsData = JSON.parse(localStorage.getItem("students") || '[]');
      
      // Validate and fix student data structure if needed
      const validatedStudents = studentsData.map(student => ({
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

      setStudents(validatedStudents);
      
      // Update storage with validated data
      localStorage.setItem('students', JSON.stringify(validatedStudents));
    } catch (error) {
      console.error('Error loading student data:', error);
      setStudents([]);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate('/');
  };

  const startEditing = (studentId, subject, type) => {
    try {
      const student = students.find(s => s.id === studentId);
      if (!student || !student.subjects || !student.subjects[subject]) {
        throw new Error('Invalid student data structure');
      }

      const value = student.subjects[subject][type];
      if (typeof value !== 'number') {
        throw new Error('Invalid value type');
      }

      setEditValue(value.toString());
      setEditingCell({ studentId, field: subject, type });
    } catch (error) {
      console.error('Error starting edit:', error);
      // Initialize the value as 0 if there's an error
      setEditValue('0');
      setEditingCell({ studentId, field: subject, type });
    }
  };

  const handleEdit = (e) => {
    if (e.key === 'Enter' || e.type === 'blur') {
      try {
        if (!editingCell) {
          console.error('No cell is being edited');
          return;
        }

        const { studentId, field, type } = editingCell;
        const value = Number(editValue);

        if (isNaN(value) || value < 0 || value > 100) {
          alert('Please enter a valid number between 0 and 100');
          return;
        }

        const studentToUpdate = students.find(s => s.id === studentId);
        if (!studentToUpdate) {
          throw new Error('Student not found');
        }

        const updatedStudents = students.map(student => {
          if (student.id === studentId) {
            const updatedSubjects = {
              ...student.subjects,
              [field]: {
                ...student.subjects[field],
                [type]: value
              }
            };

            // Validate the updated structure
            if (!updatedSubjects[field] || typeof updatedSubjects[field][type] !== 'number') {
              throw new Error('Invalid data structure after update');
            }

            return {
              ...student,
              subjects: updatedSubjects
            };
          }
          return student;
        });

        setStudents(updatedStudents);
        localStorage.setItem('students', JSON.stringify(updatedStudents));
        setEditingCell(null);
        setEditValue('');
      } catch (error) {
        console.error('Error updating student data:', error);
        alert('An error occurred while updating the data. Please try again.');
        setEditingCell(null);
        setEditValue('');
      }
    }
  };

  return (
    <div className="teacher-dashboard">
      <h2>Teacher Dashboard</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Subjects, Marks & Attendance</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td className="subjects-cell">
                  {Object.entries(student.subjects).map(([subject, data]) => (
                    <div key={subject} className="subject-row">
                      <span className="subject-name">{subject}</span>
                      <div className="subject-data">
                        <div 
                          className="data-item editable"
                          onClick={() => startEditing(student.id, subject, 'marks')}
                        >
                          {editingCell?.studentId === student.id && 
                           editingCell?.field === subject && 
                           editingCell?.type === 'marks' ? (
                            <input
                              type="number"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleEdit(e)}
                              onBlur={handleEdit}
                              autoFocus
                              min="0"
                              max="100"
                            />
                          ) : (
                            <span className="mark-value">
                              Marks: {data.marks}
                            </span>
                          )}
                        </div>
                        <div 
                          className="data-item editable"
                          onClick={() => startEditing(student.id, subject, 'attendance')}
                        >
                          {editingCell?.studentId === student.id && 
                           editingCell?.field === subject && 
                           editingCell?.type === 'attendance' ? (
                            <input
                              type="number"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleEdit(e)}
                              onBlur={handleEdit}
                              autoFocus
                              min="0"
                              max="100"
                            />
                          ) : (
                            <span className="attendance-value">
                              Attendance: {data.attendance}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default TeacherDashboard;