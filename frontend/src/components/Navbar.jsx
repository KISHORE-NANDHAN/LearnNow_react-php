import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-black py-4 shadow-md fixed w-full top-0 z-10">
      <div className="container mx-auto flex justify-between items-center px-4">
        
        {/* Logo */}
        <div>
          <Link to="/home">
            <img src="/images/logo2.png" alt="Logo" className="h-12" />
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="flex space-x-6 text-yellow-400 text-lg font-semibold">
          <li>
            <Link to="/home" className="hover:text-white transition duration-300">
              Home
            </Link>
          </li>
          <li>
            <Link to="/home#about" className="hover:text-white transition duration-300">
              About Us
            </Link>
          </li>
          <li>
            <Link to="/explore" className="hover:text-white transition duration-300">
              Explore
            </Link>
          </li>
          <li>
            <Link to="/profile" className="hover:text-white transition duration-300">
              Profile
            </Link>
          </li>
          <li>
            <Link to="/logout" className="hover:text-red-400 transition duration-300">
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
