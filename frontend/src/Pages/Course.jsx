import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Course = () => {
  const { courseId } = useParams(); // Get course ID from URL
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const courseResponse = await axios.get(`http://localhost/onlineplatform/backend-php/getCourseDetails.php?course_id=${courseId}`, {
          withCredentials: true,
        });

        console.log("Course Details Response:", courseResponse.data);

        if (courseResponse.data.success) {
          setCourse(courseResponse.data.course);
          setVideos(courseResponse.data.videos); // Assuming the API returns a 'videos' array
        } else {
          setError(courseResponse.data.message || 'Failed to fetch course details.');
        }
      } catch (error) {
        setError(error.response?.data?.message || 'An error occurred while fetching course details.');
        console.error("Error fetching course details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  if (loading) return <div className="text-center text-gray-600 text-lg py-5">Loading course details...</div>;
  if (error) return <div className="text-center text-red-600 font-semibold bg-red-100 border border-red-400 rounded p-3">{error}</div>;

  if (!course) return <div className="text-center text-gray-500 italic">Course not found.</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <Navbar />
      <div className="w-4/5 mt-20 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-5">{course.title}</h2>
        <p className="text-gray-700 mb-4 text-center">{course.description}</p>
        <div className="mb-6 text-center">
          <span className="text-gray-500 mr-3"><strong>Instructor:</strong> {course.instructor_name}</span>
          <span className="text-gray-500 mr-3"><strong>Category:</strong> {course.category}</span>
          <span className="text-gray-500"><strong>Level:</strong> {course.level}</span>
        </div>

        <h3 className="text-xl font-semibold text-gray-700 mb-3">Course Videos</h3>
        {videos.length > 0 ? (
          <ul className="space-y-4">
            {videos.map(video => (
              <li key={video.id} className="bg-gray-50 shadow p-4 rounded-lg flex items-center">
                 {/* Placeholder video thumbnail - replace with actual image URL or embed code */}
                 <img src={`http://via.placeholder.com/160x90/007bff/FFFFFF?text=Video+${video.id}`} alt={video.title} className="w-40 h-24 object-cover rounded-md mr-4" />
                <div>
                  <h4 className="text-lg font-medium text-gray-800">{video.title}</h4>
                  <p className="text-gray-600 text-sm">Duration: {video.duration}</p> {/*Assuming duration is returned from API*/}
                  {/* Add video player or link here */}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No videos found for this course.</p>
        )}
      </div>
    </div>
  );
};

export default Course;