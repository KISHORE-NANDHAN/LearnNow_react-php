import React from "react";
import Navbar from "../components/Navbar";
import Slider from "react-slick";
import { FaGraduationCap, FaGlobe, FaUsers } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/slider.css"; // Custom CSS for better Tailwind styling

const Home = () => {
  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <div className="bg-gray-100">
      <Navbar />
      
      {/* Image Slider */}
      <section className="w-full max-w-screen-xl mx-auto overflow-hidden">
        <Slider {...settings}>
          <div>
            <img src="../Media/background-pro.jpeg" alt="Education Banner 1" className="w-full h-[500px] object-cover rounded-lg" />
          </div>
          <div>
            <img src="../Media/background-pro.jpeg" alt="Education Banner 2" className="w-full h-[500px] object-cover rounded-lg" />
          </div>
          <div>
            <img src="../Media/background-pro.jpeg" alt="Education Banner 3" className="w-full h-[500px] object-cover rounded-lg" />
          </div>
        </Slider>
      </section>

      {/* Features Section */}
      <section className="py-16 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-10">Why Choose Our Platform?</h2>
        <div className="flex justify-center gap-6 flex-wrap">
          <div className="bg-white p-6 shadow-lg rounded-lg w-80">
            <FaGraduationCap className="w-16 h-16 text-blue-500 mx-auto" />
            <h3 className="text-xl font-semibold mt-4">Expert Instructors</h3>
            <p className="text-gray-600 mt-2">Learn from industry professionals with real-world experience.</p>
          </div>
          <div className="bg-white p-6 shadow-lg rounded-lg w-80">
            <FaGlobe className="w-16 h-16 text-green-500 mx-auto" />
            <h3 className="text-xl font-semibold mt-4">Global Access</h3>
            <p className="text-gray-600 mt-2">Access courses anytime, anywhere, from any device.</p>
          </div>
          <div className="bg-white p-6 shadow-lg rounded-lg w-80">
            <FaUsers className="w-16 h-16 text-red-500 mx-auto" />
            <h3 className="text-xl font-semibold mt-4">Community Support</h3>
            <p className="text-gray-600 mt-2">Engage with peers and instructors through discussion forums.</p>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="bg-gray-900 text-white py-16 text-center">
        <h2 className="text-4xl font-bold mb-6">What Our Students Say</h2>
        <div className="flex justify-center gap-6 flex-wrap">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <p className="italic">"This platform changed my career! The courses are amazing and the instructors are top-notch."</p>
            <h3 className="mt-4 font-semibold">- Sarah Williams</h3>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <p className="italic">"The flexible learning options allowed me to upskill while working full-time. Highly recommended!"</p>
            <h3 className="mt-4 font-semibold">- James Anderson</h3>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
