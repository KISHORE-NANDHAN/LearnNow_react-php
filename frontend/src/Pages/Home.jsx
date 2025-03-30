import React, { useState, useEffect } from 'react';
import { FaUsers, FaStar, FaArrowRight } from 'react-icons/fa';
import { MdOutlineSchool } from "react-icons/md";
import {GiGraduateCap} from "react-icons/gi"
import {AiOutlineBulb} from "react-icons/ai"
import Navbar from '../components/Navbar.jsx'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1503428593586-e225b39bddfe?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Unlock Your Potential with Expert Courses',
      description: 'Learn new skills and advance your career with our comprehensive online courses.',
    },
    {
      image: 'https://images.unsplash.com/photo-1550439062-609e1531270e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      title: 'Gain In-Demand Skills for the Future',
      description: 'Master the latest technologies and trends in software development, design, and more.',
    },
    {
      image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Learn at Your Own Pace, Anytime, Anywhere',
      description: 'Access our courses on any device and learn on your own schedule.',
    },
  ];
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
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
          setIsAuthenticated(true);
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
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval); // Cleanup the interval on unmount
  }, [slides.length]);

  return (
    <div className="bg-gray-50 font-sans">
      <Navbar/>
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden">
        <img
          src={slides[currentSlide].image}
          alt={slides[currentSlide].title}
          className="absolute w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: 1 }} // Keep opacity at 1 to ensure image visibility
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">{slides[currentSlide].title}</h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-8">{slides[currentSlide].description}</p>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full" onClick={()=>navigate('/explore')}>
              Explore Courses
            </button>
          </div>
        </div>
      </section>

      {/* Courses Overview Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">Our Top Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Course Card 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300" onClick={()=>navigate('/explore')}>
              <img
                src="https://miro.medium.com/v2/resize:fit:1200/0*M4bxiCIjcTK-2Xr6.jpeg"
                alt="Web Development Course"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Web Development Bootcamp</h3>
                <p className="text-gray-600 mb-4">Learn to build modern websites and web applications from scratch.</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500"><FaUsers className="inline-block mr-1" /> 12,345 Students</span>
                  <span className="text-sm text-yellow-500"><FaStar className="inline-block mr-1" /> 4.7 (1,234)</span>
                </div>
              </div>
            </div>

            {/* Course Card 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300" onClick={()=>navigate('/explore')}>
              <img
                src="https://www.mygreatlearning.com/blog/wp-content/uploads/2019/09/What-is-data-science-2.jpg"
                alt="Data Science Course"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Data Science Masterclass</h3>
                <p className="text-gray-600 mb-4">Master data analysis, machine learning, and data visualization techniques.</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500"><FaUsers className="inline-block mr-1" /> 8,765 Students</span>
                  <span className="text-sm text-yellow-500"><FaStar className="inline-block mr-1" /> 4.8 (987)</span>
                </div>
              </div>
            </div>

            {/* Course Card 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300" onClick={()=>navigate('/explore')}>
              <img
                src="https://img.freepik.com/free-vector/app-development-banner_33099-1720.jpg"
                alt="Mobile App Development Course"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Mobile App Development Course</h3>
                <p className="text-gray-600 mb-4">Build iOS and Android apps with React Native and become a mobile developer.</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500"><FaUsers className="inline-block mr-1" /> 5,432 Students</span>
                  <span className="text-sm text-yellow-500"><FaStar className="inline-block mr-1" /> 4.6 (654)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <MdOutlineSchool className="text-4xl text-blue-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">Expert Instructors</h3>
              </div>
              <p className="text-gray-600">Learn from industry experts with years of experience in their respective fields.</p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <GiGraduateCap className="text-4xl text-green-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">Practical Projects</h3>
              </div>
              <p className="text-gray-600">Gain hands-on experience by building real-world projects as you learn.</p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <AiOutlineBulb className="text-4xl text-yellow-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">Lifetime Access</h3>
              </div>
              <p className="text-gray-600">Enjoy lifetime access to course materials and updates, even after completion.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">Student Feedback</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-100 rounded-lg p-6 shadow-md">
              <p className="text-gray-700 mb-4">"This course was amazing! The instructor was very knowledgeable and the content was well-structured. I highly recommend it to anyone looking to learn web development."</p>
              <div className="flex items-center">
                <img
                  src="https://randomuser.me/api/portraits/men/1.jpg" // Replace with actual image URLs
                  alt="John Doe"
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div>
                  <p className="font-semibold text-gray-800">John Doe</p>
                  <p className="text-sm text-gray-500">Web Development Student</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gray-100 rounded-lg p-6 shadow-md">
              <p className="text-gray-700 mb-4">"I was a complete beginner to data science, but this course made it easy to understand complex concepts. The instructor was patient and helpful, and I learned a lot."</p>
              <div className="flex items-center">
                <img
                  src="https://randomuser.me/api/portraits/women/2.jpg" // Replace with actual image URLs
                  alt="Jane Smith"
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div>
                  <p className="font-semibold text-gray-800">Jane Smith</p>
                  <p className="text-sm text-gray-500">Data Science Student</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-700 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-4">Ready to Start Learning?</h2>
          <p className="text-lg mb-8">Join our community of learners and unlock your potential today!</p>
          <button className="bg-white text-blue-700 hover:bg-blue-100 font-bold py-3 px-6 rounded-full">
            Get Started Now <FaArrowRight className="inline-block ml-2" />
          </button>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 py-4 text-white text-center">
        <p>© 2025 LearnNow - It's Never Late to Learn. All rights reserved for KISHORE NANDHAN @LBRCE.</p>
      </footer>
    </div>
  );
}

export default Home;