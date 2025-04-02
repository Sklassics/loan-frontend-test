import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../../javascript/api';

const AdminLoginPage = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [token, setToken] = useState(''); // Add this state to store the token
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!mobileNumber) {
      setErrorMessage('Mobile number is required.');
      return;
    }

    try {
      const response = await api.post('/admin/login/send-otp', { phoneNumber: mobileNumber });
      if (response.status === 200) {
        setOtpSent(true);
        alert('OTP sent successfully!');
        setErrorMessage('');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'An error occurred while sending OTP');
      setSuccessMessage('');
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setErrorMessage('OTP is required.');
      return;
    }

    try {
      const response = await api.post('/admin/login/verify-otp', { phoneNumber: mobileNumber, otp });
      if (response.status === 200) {
        // Store token in cookies
        document.cookie = `admintoken=${response.data.token}; path=/;`;
        setToken(response.data.token); // Store the token in state
        alert('OTP Verified Successfully');
        setErrorMessage('');
        navigate("/admin-dashboard");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'OTP verification failed');
      setSuccessMessage('');
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>

      <div>
        <label>Mobile Number</label>
        <input
          type="text"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          placeholder="Enter your mobile number"
        />
      </div>

      {otpSent ? (
        <div>
          <label>OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />
        </div>
      ) : null}

      <div>
        {otpSent ? (
          <button onClick={handleVerifyOtp}>Verify OTP</button>
        ) : (
          <button onClick={handleSendOtp}>Send OTP</button>
        )}
      </div>

      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}

      {token && (
        <div>
          <h3>Login Successful!</h3>
          <p>Your Token: {token}</p>
        </div>
      )}
    </div>
  );
};

export default AdminLoginPage;
