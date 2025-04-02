import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../../javascript/api";

const EmailVerification = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const getTokenFromCookies = () => {
    const match = document.cookie.match(/(?:^|; )token=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  };

  const sendOtp = async () => {
    if (isSendingOtp) return;
    setIsSendingOtp(true); // Disable button

    try {
      const token = getTokenFromCookies();
      const response = await api.post(
        "/email/send-otp",
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message);
      setIsOtpSent(true); // Hide email field
    } catch (error) {
      alert(error.response?.data?.message || "Error sending OTP.");
      setIsSendingOtp(false); // Re-enable if error occurs
    }
  };

  const verifyOtp = async () => {
    if (isVerifyingOtp) return;
    setIsVerifyingOtp(true); // Disable button

    try {
      const token = getTokenFromCookies();
      const response = await api.post(
        "/email/verify-otp",
        { email, otp },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message);
      setIsVerified(true); // Hide OTP field
      navigate("/personal-details");
    } catch (error) {
      alert(error.response?.data?.message || "Error verifying OTP.");
      setIsVerifyingOtp(false); // Re-enable if error occurs
    }
  };

  return (
    <div className="center">
      <div className="container">
        <h2>Email Authentication</h2>

        {!isOtpSent && (
          <>
            <label>Email:</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button onClick={sendOtp} disabled={isSendingOtp}>
              {isSendingOtp ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {isOtpSent && !isVerified && (
          <>
            <label>OTP:</label>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button onClick={verifyOtp} disabled={isVerifyingOtp}>
              {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
