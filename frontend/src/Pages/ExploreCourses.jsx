import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const ExploreCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filtering and Sorting States
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [priceFilter, setPriceFilter] = useState('All');
    const [levelFilter, setLevelFilter] = useState('All');
    const [sortOption, setSortOption] = useState('relevance');
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
                const response = await axios.get('http://localhost/onlineplatform/backend-php/getCourses.php');
                setCourses(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load courses.');
                setLoading(false);
                console.error('Error fetching courses:', err);
            }
        };

        fetchCourses();
    }, []);

    // Filtered Courses Logic
    const filteredCourses = courses.filter(course => {
        if (categoryFilter !== 'All' && course.category !== categoryFilter) {
            return false;
        }
        if (levelFilter !== 'All' && course.level !== levelFilter) {
            return false;
        }

        if (priceFilter === 'Free' && course.is_paid) {
            return false;
        } else if (priceFilter === 'Paid' && !course.is_paid) {
            return false;
        }
        return true;
    });

    // Sorting Logic
    const sortedCourses = [...filteredCourses].sort((a, b) => {
        if (sortOption === 'priceLowToHigh') {
            return a.price - b.price;
        } else if (sortOption === 'priceHighToLow') {
            return b.price - a.price;
        } else if (sortOption === 'durationShortToLong') {
            return a.total_duration - b.total_duration;
        } else if (sortOption === 'durationLongToShort') {
            return b.total_duration - a.total_duration;
        }
        return 0; // Default: no sorting (relevance)
    });

    const handleCategoryChange = (e) => {
        setCategoryFilter(e.target.value);
    };

    const handlePriceChange = (e) => {
        setPriceFilter(e.target.value);
    };
    const handleLevelChange = (e) => {
        setLevelFilter(e.target.value);
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };
    const handleAddCourse = async (course) => {
        try {
            const token = Cookies.get('session_id');
            if (!token) {
                alert('Please log in to add courses.');
                return;
            }

            // Send course details and the token to the backend
            const response = await axios.post(
                'http://localhost/onlineplatform/backend-php/addCourseToUser.php',
                {
                    token: token,
                    course_id: course.id, // Assuming the course object has an 'id' field
                    title: course.title, // Or the fields needed for your database
                    description: course.description,
                    instructor_name: course.instructor_name,
                    thumbnail_url: course.thumbnail_url,

                }, {
                withCredentials: true,
            }
            );

            if (response.data.success) {
                alert(`Course "${course.title}" added to your courses!`);
            } else {
                alert(response.data.message || 'Failed to add course. Please try again.');
            }
        } catch (error) {
            console.error('Error adding course:', error);
            alert('Error adding course. Please try again.');
        }
    };


    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading courses...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />
            <br /><br /><br />
            <div className=" container mx-auto py-10 px-4">
                <h1 className="text-3xl font-semibold mb-6 text-gray-800 text-center">Explore Our Courses</h1>

                {/* Filtering Options */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
                            Category:
                        </label>
                        <select
                            id="category"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={categoryFilter}
                            onChange={handleCategoryChange}
                        >
                            <option value="All">All Categories</option>
                            {/* Fetch categories dynamically from the backend, or hardcode here */}
                            <option value="Programming">Programming</option>
                            <option value="Web Development">Web Development</option>
                            <option value="Frontend Development">Frontend Development</option>
                            <option value="Mobile Development">Mobile Development</option>
                            <option value="Data Science">Data Science</option>
                            <option value="Artificial Intelligence">Artificial Intelligence</option>
                            <option value="Cloud Computing">Cloud Computing</option>
                            <option value="Cybersecurity">Cybersecurity</option>
                            <option value="DevOps">DevOps</option>
                            <option value="Blockchain">Blockchain</option>
                            <option value="Design">Design</option>
                            <option value="Database Management">Database Management</option>
                            <option value="Game Development">Game Development</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="level" className="block text-gray-700 text-sm font-bold mb-2">
                            Level:
                        </label>
                        <select
                            id="level"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={levelFilter}
                            onChange={handleLevelChange}
                        >
                            <option value="All">All Levels</option>
                            {/* Fetch levels dynamically from the backend, or hardcode here */}
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">
                            Price:
                        </label>
                        <select
                            id="price"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={priceFilter}
                            onChange={handlePriceChange}
                        >
                            <option value="All">All Prices</option>
                            <option value="Free">Free</option>
                            <option value="Paid">Paid</option>
                        </select>
                    </div>
                </div>

                {/* Sorting Options */}
                <div className="mb-6">
                    <label htmlFor="sort" className="block text-gray-700 text-sm font-bold mb-2">
                        Sort By:
                    </label>
                    <select
                        id="sort"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={sortOption}
                        onChange={handleSortChange}
                    >
                        <option value="relevance">Relevance</option>
                        <option value="priceLowToHigh">Price: Low to High</option>
                        <option value="priceHighToLow">Price: High to Low</option>
                        <option value="durationShortToLong">Duration: Short to Long</option>
                        <option value="durationLongToShort">Duration: Long to Short</option>
                    </select>
                </div>

                {/* Course Listing */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sortedCourses.map((course) => (
                        <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            <img
                                src={course.thumbnail_url}
                                alt={course.title}
                                className="w-full h-48 object-cover"
                                onError={(e) => {
                                    e.target.onerror = null; // Prevent infinite loop
                                    e.target.src = "https://via.placeholder.com/400x300"; // Placeholder image
                                }}
                            />
                            <div className="p-4">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h3>
                                <p className="text-gray-600 mb-4">{course.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">Instructor: {course.instructor_name}</span>
                                    <span className="text-sm font-semibold text-blue-500">${course.price}</span>

                                </div>
                                {/* Add Course Button */}
                                <button
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 w-full"
                                    onClick={() => handleAddCourse(course)}
                                >
                                    Add to My Courses
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExploreCourses;