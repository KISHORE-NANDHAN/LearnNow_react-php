import React, { useEffect, useState, useRef } from "react";
import Certificate from "../components/Certificate";
import { FaDownload } from "react-icons/fa";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Navbar from "../components/Navbar";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Certifications = () => {
  const [loading, setLoading] = useState(true);
  const [certifications, setCertifications] = useState([]);
  const certificateRefs = useRef({});
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

  // Fetch certificates from backend
  useEffect(() => {
    axios
      .get("http://localhost/OnlinePlatform/Backend-PHP/getCertificate.php")
      .then((response) => {
        console.log("Certificates API Response:", response.data);
        
        // Ensure the response is an array
        const data = response.data;
        if (Array.isArray(data)) {
          setCertifications(data);
        } else if (data && Array.isArray(data.data)) {
          setCertifications(data.data);
        } else {
          setCertifications([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching certificates:", error);
        setCertifications([]); // Ensure state remains an array on error
      });
  }, []);

  // Generate PDF and Download
  const handleDownloadPDF = async (id) => {
    const element = certificateRefs.current[id]; // Get the correct certificate ref
    if (!element) return;

    try {
      const canvas = await html2canvas(element, { scale: 2 }); // Capture as high-res image
      const imgData = canvas.toDataURL("image/png"); // Convert to image

      const pdf = new jsPDF("landscape", "mm", "a4");
      const imgWidth = 297; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Certificate_${id}.pdf`); // Download the PDF
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 md:p-12 lg:p-20 bg-gray-100 min-h-screen">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">Your Certifications</h1>

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : certifications.length === 0 ? (
          <p className="text-center text-gray-600">No certifications available.</p>
        ) : (
          <div>
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="relative bg-white shadow-lg p-6 rounded-lg flex flex-col items-center"
              >
                {/* Assign a unique ref for each certificate */}
                <div ref={(el) => (certificateRefs.current[cert.id] = el)}>
                  <Certificate
                    recipientName={cert.email}
                    courseName={cert.Course_Name}
                    credentials={cert.Certificate_Credential}
                    issuedAt={cert.issued_at}
                  />
                </div>

                {/* Download PDF Button */}
                <button
                  onClick={() => handleDownloadPDF(cert.id)}
                  className="mt-4 flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all"
                >
                  <FaDownload className="mr-2" /> Download PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Certifications;
