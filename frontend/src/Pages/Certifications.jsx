import React, { useEffect, useState, useRef } from "react";
import Certificate from "../components/Certificate";
import { FaDownload } from "react-icons/fa";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Navbar from "../components/Navbar";

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);
  const certificateRefs = useRef({});

  // Fetch certificates from backend
  useEffect(() => {
    axios
      .get("http://localhost/OnlinePlatform/Backend-PHP/getCertificate.php")
      .then((response) => {
        console.log("Certificates:", response.data);
        setCertifications(response.data);
      })
      .catch((error) => console.error("Error fetching certificates:", error));
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

        {certifications.length === 0 ? (
          <p className="text-center text-gray-600">No certifications available.</p>
        ) : (
          <div className="">
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
