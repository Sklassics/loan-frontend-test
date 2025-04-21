import React, { useState } from 'react';
import api from '../../javascript/api';
import { useNavigate } from 'react-router-dom';

const CustomerPortalLogin = () => {
  const [step, setStep] = useState('send'); // 'send' or 'verify'
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      const response = await api.post('/api/customer-portal/login/send-otp', {
        phoneNumber: mobileNumber,
      });
      setMessage(response.data.message || 'OTP sent successfully!');
      setStep('verify');
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || 'Failed to send OTP'));
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await api.post('/api/customer-portal/login/verify-otp', {
        phoneNumber: mobileNumber,
        otp,
      });
  
      const token = response.data.token;
  
      if (token) {
        // Set token in cookie with an expiry of 1 day
        document.cookie = `customerportaltoken=${token}; path=/; max-age=86400`; 
      }
  
      setMessage(response.data.message || 'OTP verified successfully!');
      navigate('/customerportal-dashboard'); // Redirect to dashboard after successful login
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || 'Failed to verify OTP'));
    }
  };
  

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '2rem', textAlign: 'center' }}>
      <h2>Customer Portal Login</h2>
      
      <input
        type="text"
        value={mobileNumber}
        onChange={(e) => setMobileNumber(e.target.value)}
        placeholder="Enter mobile number"
        disabled={step === 'verify'}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />
      
      {step === 'verify' && (
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
      )}
      
      <button
        onClick={step === 'send' ? handleSendOtp : handleVerifyOtp}
        style={{ width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: '#fff', border: 'none' }}
      >
        {step === 'send' ? 'Send OTP' : 'Verify OTP'}
      </button>

      {message && <p style={{ marginTop: '1rem', color: message.startsWith('Error') ? 'red' : 'green' }}>{message}</p>}
    </div>
  );
};

export default CustomerPortalLogin;
