import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../../javascript/api";

const Register = () => {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    otp: ""
  });
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL;


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSendingOtp) return; // Prevent multiple clicks
    setIsSendingOtp(true); // Disable button after click

    try {
      const response = await api.post("/mobile/send-otp", {
        phoneNumber: formData.phoneNumber
      });

      if (response.data.status === 200) {
        alert(response.data.message);
        setIsOtpSent(true); // Hide mobile field after sending OTP
      } else {
        alert(response.data.message || "An unknown error occurred");
        setIsSendingOtp(false); // Re-enable if failed
      }
    } catch (error) {
      alert(error.response?.data?.message || "An unexpected error occurred");
      console.error("Error:", error);
      setIsSendingOtp(false); // Re-enable if error
    }
  };

  const handleOtpVerification = async () => {
    if (isVerifyingOtp) return; // Prevent multiple clicks
    setIsVerifyingOtp(true); // Disable button after click

    try {
      const response = await api.post("/mobile/verify-otp", formData);

      if (response.data.status === 200 && response.data.success) {
        alert("OTP Verified Successfully");

        // Store token in cookies
        document.cookie = `token=${response.data.token}; path=/;`;

        // Navigation logic based on verification status
        if (!response.data.isEmailVerified) {
          navigate("/email-verification");
        } else if (!response.data.isPersonalDetailsVerified) {
          navigate("/personal-details");
        } else if (!response.data.isPancardVerified) {
          navigate("/pancard-verification");
        } else if (response.data.mlApprovalStatus === "PENDING" || !response.data.isCreditLimit) {
          navigate("/credit");
        } else if (!response.data.isWithDrawAmount) {
          navigate("/withdraw");
        } else if (!response.data.isBankDetails) {
          navigate("/bank-details");
        } else if (!response.data.isRepaymentSchedule) {
          navigate("/repayment-schedule");
        } else {
          navigate("/email-verification");
        }
      } else {
        alert(response.data.message || "OTP verification failed");
        setIsVerifyingOtp(false); // Re-enable if failed
      }
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred during OTP verification");
      console.error("OTP Verification Error:", error);
      setIsVerifyingOtp(false); // Re-enable if error
    }
  };

  return (
    <div>
      <h2>Register User</h2>
      <form className="center" onSubmit={handleSubmit}>
        {!isOtpSent && (
          <div>
            <label>Mobile Number: </label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={isSendingOtp}>
              {isSendingOtp ? "Sending..." : "Send OTP"}
            </button>
          </div>
        )}
        {isOtpSent && (
          <div>
            <label>OTP: </label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={handleOtpVerification} disabled={isVerifyingOtp}>
              {isVerifyingOtp ? "Verifying..." : "Validate"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Register;
