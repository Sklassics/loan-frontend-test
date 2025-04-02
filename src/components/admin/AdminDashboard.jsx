import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../../javascript/api';

const AdminDashboard = () => {
  const [creditLimitStatus, setCreditLimitStatus] = useState(null);
  const [numbers, setNumbers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCreditLimit = async () => {
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('admintoken='))?.split('=')[1];
        if (!token) throw new Error('Token not found');

        const response = await api.get('/validate/creditLimit', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCreditLimitStatus(response.data);
        if (response.data.success && response.data.numbers) {
          setNumbers(response.data.numbers);
        }
      } catch (error) {
        console.error('Error fetching credit limit:', error);
        setCreditLimitStatus({ success: false, message: 'Error fetching credit limit.' });
      }
    };

    fetchCreditLimit();
  }, []);

  return (
    <div className="center">
      <h1>Admin Dashboard</h1>
      {creditLimitStatus ? (
        <div className="container">
          {creditLimitStatus.success && numbers.length > 0 ? (
            <table border="1" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Mobile</th>
                  <th>Credit Limit</th>
                  <th>Score</th>
                  <th>ML Status</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {numbers.map((num, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{num.number}</td>
                    <td>{num.creditLimit ?? 'N/A'}</td>
                    <td>{num.value ?? 'N/A'}</td>
                    <td>{num.mlApprovalStatus}</td>
                    <td>
                      <button
                        onClick={() => navigate(`/admin/view/${num.number}`)}
                        style={{ backgroundColor: 'blue', color: 'white', padding: '5px' }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No pending numbers for verification.</p>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AdminDashboard;
