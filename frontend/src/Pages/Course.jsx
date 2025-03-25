import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Course = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [completedVideos, setCompletedVideos] = useState([]);
  const userEmail = localStorage.getItem('email');

  const extractYouTubeVideoId = (url) => {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get('http://localhost/onlineplatform/backend-php/getCourseDetails.php', {
          params: { course_id: courseId },
          withCredentials: true,
        });

        if (response.data.success) {
          setCourse(response.data.course);
          setVideos(response.data.videos);

          if (response.data.videos.length > 0) {
            setCurrentVideoUrl(response.data.videos[0].video_url);
            setCurrentVideoId(response.data.videos[0].id);
          }

          // Fetch completed videos
          fetchCompletedVideos();
        } else {
          setError(response.data.message || 'Failed to fetch course details.');
        }
      } catch (error) {
        setError(error.response?.data?.message || 'An error occurred while fetching course details.');
        console.error('Error fetching course details:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCompletedVideos = async () => {
      try {
        const response = await axios.get('http://localhost/onlineplatform/backend-php/getCompletedVideos.php', {
          params: { user_email: userEmail, course_id: courseId },
          withCredentials: true,
        });

        if (response.data.success) {
          setCompletedVideos(response.data.completedVideos || []);
        }
      } catch (error) {
        console.error('Error fetching completed videos:', error);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleVideoClick = (video) => {
    setCurrentVideoUrl(video.video_url);
    setCurrentVideoId(video.id);
    updateCourseProgress(video.id);
  };

  const updateCourseProgress = async (videoId) => {
    if (!userEmail || completedVideos.includes(videoId)) return;

    try {
      const response = await axios.post(
        'http://localhost/onlineplatform/backend-php/updateCourseProgress.php',
        { user_email: userEmail, course_id: courseId, video_id: videoId },
        { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.success) {
        setCompletedVideos((prev) => [...prev, videoId]);
      } else {
        console.error('Failed to update course progress:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating course progress:', error);
    }
  };

  const calculateProgressPercentage = () => {
    if (videos.length === 0) return 0;
    return Math.round((completedVideos.length / videos.length) * 100);
  };

  if (loading) return <div className="text-center text-gray-600 text-lg py-5">Loading course details...</div>;
  if (error) return <div className="text-center text-red-600 font-semibold bg-red-100 border border-red-400 rounded p-3">{error}</div>;
  if (!course) return <div className="text-center text-gray-500 italic">Course not found.</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto mt-20 p-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-5">{course.title}</h2>
        <p className="text-gray-700 mb-4 text-center">{course.description}</p>
        <div className="mb-6 text-center">
          <span className="text-gray-500 mr-3"><strong>Instructor:</strong> {course.instructor_name}</span>
          <span className="text-gray-500 mr-3"><strong>Category:</strong> {course.category}</span>
          <span className="text-gray-500"><strong>Level:</strong> {course.level}</span>
        </div>

        <div className="flex">
          {/* Video Player */}
          <div className="w-3/4 pr-4">
            {currentVideoUrl ? (
              <iframe
              key={currentVideoUrl}
              width="100%"
              height="500"
              src={`https://www.youtube.com/embed/${extractYouTubeVideoId(currentVideoUrl)}`}
              title="YouTube Video Player"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            ></iframe>            

            ) : (
              <div className="text-gray-500 italic">No video selected.</div>
            )}
            <p className="mt-2 text-sm text-gray-600">Progress: {calculateProgressPercentage()}%</p>
          </div>

          {/* Video Sidebar */}
          <div className="w-1/4 bg-gray-50 p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Course Videos</h3>
            <ul>
              {videos.map(video => (
                <li
                  key={video.id}
                  className={`mb-2 p-2 rounded-md cursor-pointer hover:bg-gray-200 ${currentVideoId === video.id ? 'bg-gray-200' : ''} ${completedVideos.includes(video.id) ? 'opacity-50 line-through' : ''}`}
                  onClick={() => handleVideoClick(video)}
                >
                  <div className="flex items-center">
                    <img
                      src={`https://img.youtube.com/vi/${extractYouTubeVideoId(video.video_url)}/hqdefault.jpg`}
                      alt={video.video_title}
                      className="w-20 h-12 object-cover rounded-md mr-2"
                    />
                    <span>{video.video_title}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course;
