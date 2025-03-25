import React from "react";
import { IoMdRibbon } from "react-icons/io";
import logo from "../Media/logo2.png";

const Certificate = ({ recipientName, courseName, issuedAt, credentials }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-lightgray p-4">
      <div className="relative w-full max-w-4xl bg-white shadow-lg rounded-lg p-8 border border-black">
        {/* Inner Border */}
        <div className="absolute inset-0 border-4 border-gray m-4 rounded-lg"></div>

        {/* Logo & Title */}
        <div className="text-center mb-6 relative z-10">
          <img src={logo} alt="Logo" className="h-12 mx-auto mb-2" />
          <h2 className="text-3xl font-bold text-black uppercase">
            LearnNow Certificate of Completion
          </h2>
          <IoMdRibbon className="text-black text-5xl mx-auto mt-2" />
        </div>

        {/* Recipient Name */}
        <div className="text-center my-6">
          <p className="text-xl text-black">This is to certify that</p>
          <h3 className="text-4xl font-bold text-black underline mt-2">
            {recipientName}
          </h3>
        </div>

        {/* Course Information */}
        <div className="text-center my-4">
          <p className="text-lg text-black">Has successfully completed</p>
          <h3 className="text-2xl font-bold text-black mt-2">{courseName}</h3>
          <p className="text-md text-black mt-2">Issued on: {issuedAt}</p>
        </div>

        {/* Credentials */}
        <div className="text-center my-6">
          <p className="text-lg font-semibold text-black">
            Certificate ID: <span className="text-black font-bold">{credentials}</span>
          </p>
        </div>

        {/* Signature */}
        <div className="text-center mt-10 relative z-10">
          <p className="text-xl font-bold text-black underline">Kishore Nandhan</p>
          <p className="text-md text-black">Founder & CEO, LearnNow</p>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
