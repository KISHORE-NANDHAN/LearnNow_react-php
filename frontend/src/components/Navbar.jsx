import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from '../Media/logo2.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav
      className={`fixed w-full top-0 z-20 transition-all duration-300 ${
        isScrolled ? "bg-black/70 backdrop-blur-md shadow-md" : "bg-black/50 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="Logo"
            className="h-10 md:h-14 transform scale-150 md:scale-150" // Zoom in without increasing height
          />
          <span className="ml-2 text-xl font-semibold text-blue-300">LearnNow</span>
        </Link>


        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-white focus:outline-none"
          aria-label="Menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>

        {/* Navigation Links */}
        <div
          className={`md:flex items-center space-x-6 text-yellow-400 text-lg font-semibold ${
            isMenuOpen ? "flex flex-col absolute top-full left-0 w-full bg-black/80 backdrop-blur-md py-4 px-4 md:static md:bg-transparent md:py-0 md:px-0" : "hidden md:flex"
          }`}
        >
          <Link to="/" className="hover:text-white transition duration-300 block py-2 md:inline-block">
            Home
          </Link>
          <Link to="/MyCourses" className="hover:text-white transition duration-300 block py-2 md:inline-block">
            MyCourses
          </Link>
          <Link to="/explore" className="hover:text-white transition duration-300 block py-2 md:inline-block">
            Explore Courses
          </Link>
          <Link to="/profile" className="hover:text-white transition duration-300 block py-2 md:inline-block">
            Profile
          </Link>
          <Link to="/certifications" className="hover:text-white transition duration-300 block py-2 md:inline-block">
            My Certifications
          </Link>
          <Link to="/logout" className="hover:text-red-400 transition duration-300 block py-2 md:inline-block">
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;