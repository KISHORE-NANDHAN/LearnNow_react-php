import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = Cookies.get('session_id'); 
        console.log("Token Retrieved:", token); // Debugging
  
        if (!token) {
          console.log("No token found, redirecting to login.");
          navigate('/login');
          return;
        }
  
        const response = await axios.post(
          "http://localhost/onlineplatform/backend-php/sessionCheck/sessionValid.php",
          { token },
          { withCredentials: true } // Ensure credentials (cookies) are included
        );
        console.log("Response:", response); // Debugging
  
        if (response.data.success) {
          console.log("Session validated");
        } else {
          console.log("Invalid session, clearing token.");
          Cookies.remove('session_id');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error verifying session:', error);
        Cookies.remove('session_id');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
  
    verifyUser();
  }, [navigate]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost/onlineplatform/backend-php/myCourses.php', {
          withCredentials: true,
        });

        console.log("API Response:", response.data);

        if (response.data.success) {
          setCourses(response.data.courses);
        } else {
          setError(response.data.message || 'Failed to fetch courses.');
        }
      } catch (error) {
        setError(error.response?.data?.message || 'An error occurred while fetching courses.');
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div className="text-center text-gray-600 text-lg py-5">Loading courses...</div>;
  if (error) return <div className="text-center text-red-600 font-semibold bg-red-100 border border-red-400 rounded p-3">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <Navbar />
      <div className="w-4/5 mt-20 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-5">My Courses</h2>
        {courses.length > 0 ? (
          <ul className="space-y-6">
            {courses.map(course => (
              <li key={course.id} className="flex items-center bg-gray-50 shadow p-4 rounded-lg">
                <img 
                  src={course.thumbnail_url} 
                  alt={course.title} 
                  className="w-52 h-32 object-cover rounded-lg shadow-md mr-6" 
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{course.description}</p>
                  <p className="text-gray-500 text-sm"><strong>Instructor:</strong> {course.instructor_name}</p>
                  <p className="text-gray-500 text-sm"><strong>Category:</strong> {course.category}</p>
                  <p className="text-gray-500 text-sm"><strong>Level:</strong> {course.level}</p>
                  <p className="text-gray-500 text-sm"><strong>Progress:</strong> {course.progress_percentage}%</p>
                  <Link 
                    to={`/course/${course.id}`} 
                    className="mt-3 inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
                  >
                    See Course
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 italic">You are not enrolled in any courses yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyCourses;