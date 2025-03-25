import { useState } from "react";
import axios from "axios";

export default function PasswordReset() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpCooldown, setOtpCooldown] = useState(false);

  const handleSendOTP = async () => {
    if (otpCooldown) {
      alert("OTP already sent. Please wait 3 minutes.");
      return;
    }

    try {
      const response = await axios.post("http://localhost/onlineplatform/backend-php/password_reset.php", {
        email,
        action: "send_otp",
      });

      alert(response.data.message);
      if (response.data.success) {
        setStep(2);
        setOtpCooldown(true);
        setTimeout(() => setOtpCooldown(false), 180000); // Reset after 3 minutes
      }
    } catch (error) {
      alert("Error sending OTP");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post("http://localhost/onlineplatform/backend-php/password_reset.php", {
        email,
        otp,
        action: "verify_otp",
      });

      alert(response.data.message);
      if (response.data.success) setStep(3);
    } catch (error) {
      alert("Error verifying OTP");
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost/onlineplatform/backend-php/password_reset.php", {
        email,
        newPassword,
        action: "reset_password",
      });

      alert(response.data.message);
      if (response.data.success) setStep(1);
    } catch (error) {
      alert("Error resetting password");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
            <input type="email" className="w-full p-2 border rounded mb-3" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button className="w-full bg-blue-500 text-white p-2 rounded" onClick={handleSendOTP} disabled={otpCooldown}>
              {otpCooldown ? "Wait 3 min..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Verify OTP</h2>
            <input type="text" className="w-full p-2 border rounded mb-3" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
            <button className="w-full bg-green-500 text-white p-2 rounded" onClick={handleVerifyOTP}>Verify OTP</button>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
            <input type="password" className="w-full p-2 border rounded mb-3" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <input type="password" className="w-full p-2 border rounded mb-3" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <button className="w-full bg-purple-500 text-white p-2 rounded" onClick={handleResetPassword}>Reset Password</button>
          </>
        )}
      </div>
    </div>
  );
}
