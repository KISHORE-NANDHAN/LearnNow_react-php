import React from "react";
import { IoMdRibbon } from "react-icons/io";
import logo from "../Media/logo2.png";

const Certificate = ({ recipientName, courseName, issuedAt, credentials }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "#F3F4F6", padding: "16px" }}>
      <div style={{ position: "relative", width: "100%", maxWidth: "900px", backgroundColor: "#FFFFFF", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", borderRadius: "16px", padding: "48px", border: "2px solid #D1D5DB" }}>
        
        {/* Logo & Title */}
        <div style={{ textAlign: "center", marginBottom: "32px", position: "relative", zIndex: 10 }}>
          <img src={logo} alt="LearnNow Logo" style={{ height: "64px", margin: "0 auto 16px" }} />
          <h2 style={{ fontSize: "32px", fontWeight: "800", color: "#1F2937", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "8px" }}>Certificate of Completion</h2>
          <p style={{ color: "#4B5563", fontSize: "14px", fontStyle: "italic" }}>Awarded by LearnNow</p>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "16px" }}>
            <IoMdRibbon style={{ color: "#FBBF24", fontSize: "48px" }} />
          </div>
        </div>

        {/* Recipient Name */}
        <div style={{ textAlign: "center", margin: "32px 0" }}>
          <p style={{ fontSize: "20px", color: "#374151" }}>This certificate is proudly presented to</p>
          <h3 style={{ fontSize: "40px", fontWeight: "600", color: "#2563EB", marginTop: "12px" }}>{recipientName}</h3>
        </div>

        {/* Course Information */}
        <div style={{ textAlign: "center", margin: "24px 0" }}>
          <p style={{ fontSize: "18px", color: "#374151" }}>For successfully completing the course</p>
          <h3 style={{ fontSize: "28px", fontWeight: "700", color: "#7C3AED", marginTop: "8px" }}>{courseName}</h3>
          <p style={{ color: "#6B7280", marginTop: "12px" }}>Issued on: <span style={{ fontWeight: "600" }}>{issuedAt}</span></p>
        </div>

        {/* Credentials */}
        <div style={{ textAlign: "center", margin: "32px 0" }}>
          <p style={{ fontSize: "18px", fontWeight: "500", color: "#1F2937" }}>
            Certificate ID: <span style={{ fontWeight: "700", color: "#111827" }}>{credentials}</span>
          </p>
        </div>

        {/* Signature & Authority */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "48px", position: "relative", zIndex: 10 }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "20px", fontWeight: "700", color: "#1F2937" }}>Kishore Nandhan</p>
            <p style={{ color: "#6B7280", fontSize: "14px", marginTop: "4px" }}>Founder & CEO, LearnNow</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#6B7280", fontSize: "14px", fontStyle: "italic" }}>Empowering learners worldwide.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
