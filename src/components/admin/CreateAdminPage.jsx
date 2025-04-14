import React, { useState } from 'react';
import axios from 'axios';
import api from '../../javascript/api'; 
import { useNavigate } from 'react-router-dom';

const CreateAdminPage = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [responseMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate(); // Assuming you are using react-router-dom for navigation
  const handleCreateAdmin = async () => {
    if (!mobileNumber) {
      setErrorMessage('Mobile number is required.');
      return;
    }

    try {
      const response = await api.post('/admin/create', null, {
        params: { mobileNumber },
      });

      if (response.status === 200) {
        alert('Admin created successfully.');
        navigate('/admin'); 
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating admin.');
    }
  };

  return (
    <div>
      <h2>Create Admin</h2>

      <div>
        <label>Mobile Number</label>
        <input
          type="text"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          placeholder="Enter mobile number"
        />
      </div>

      <div>
        <button onClick={handleCreateAdmin}>Create Admin</button>
      </div>

      {responseMessage && <div style={{ color: 'green' }}>{responseMessage}</div>}
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
    </div>
  );
};

export default CreateAdminPage;
