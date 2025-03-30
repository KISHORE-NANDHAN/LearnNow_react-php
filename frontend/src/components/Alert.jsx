import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const Alert = ({ message, type, duration = 1200, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100); // Initial progress: 100%

  const progressBarRef = useRef(null); // Ref to the progress bar element

  useEffect(() => {
    if (message && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) {
          onClose(); // Call the onClose prop function
        }
      }, duration);

      const animationDuration = duration / 1000; // Duration in seconds for CSS animation

      // Set CSS variable for animation duration
      if (progressBarRef.current) {
        progressBarRef.current.style.setProperty('--animation-duration', `${animationDuration}s`);
      }

      return () => {
        clearTimeout(timer);
      };
    }
  }, [message, duration, onClose, isVisible]);

  if (!message || !isVisible) {
    return null;
  }

  let bgColor, textColor, icon;

  switch (type) {
    case 'success':
      bgColor = 'bg-green-100';
      textColor = 'text-green-700';
      icon = <FaCheckCircle />;
      break;
    case 'error':
      bgColor = 'bg-red-100';
      textColor = 'text-red-700';
      icon = <FaExclamationTriangle />;
      break;
    case 'warning':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-700';
      icon = <FaExclamationTriangle />;
      break;
    case 'info':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-700';
      icon = <FaInfoCircle />;
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-700';
      icon = <FaInfoCircle />;
  }

  return (
    <div
      className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50 ${bgColor} ${textColor} border rounded-md shadow-lg flex items-center justify-between py-2 px-4 w-3/4 sm:w-1/2 md:w-1/3 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        <span>{message}</span>
      </div>
      <button className="text-gray-500 hover:text-gray-700 focus:outline-none" onClick={() => {setIsVisible(false); if (onClose) onClose();}}>
        <FaTimes />
      </button>
      <div
        ref={progressBarRef}
        className="absolute bottom-0 left-0 h-1 bg-gray-300 overflow-hidden w-full"
      >
        <div className="h-1 bg-gray-700 progress-bar" style={{ width: '100%', animation: 'progress-bar var(--animation-duration) linear', transformOrigin: 'left' }} ></div>
      </div>

    </div>
  );
};

export default Alert;