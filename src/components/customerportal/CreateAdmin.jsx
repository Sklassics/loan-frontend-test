import React, { useState } from 'react';
import api from '../../javascript/api';
import { useNavigate } from 'react-router-dom';

const CreateAdmin = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [message, setMessage] = useState('');
   
  const navigate = useNavigate();


  const handleCreateAdmin = async () => {
    try {
      const response = await api.post('/api/customer-portal-admin/create', null, {
        params: { mobileNumber },
      });
      alert(response.data.message || 'Admin created successfully!');
      navigate('/customerportal-login'); 
    } catch (error) {
      setMessage('Error: ' + error.response?.data?.message || 'Failed to create admin');
    }
  };

  return (
    <div>
      <h2>Create Customer Portal Admin</h2>
      <input
        type="text"
        value={mobileNumber}
        onChange={(e) => setMobileNumber(e.target.value)}
        placeholder="Enter mobile number"
      />
      <button onClick={handleCreateAdmin}>Create Admin</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateAdmin;
