import React, { useState } from 'react';
import axios from 'axios';

const RepaymentList = () => {
  const [dues, setDues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const baseUrl= import.meta.env.VITE_BASE_URL;
  const getTokenFromCookie = () => {
    const match = document.cookie.match(/(^|;) ?repaymentportaltoken=([^;]*)(;|$)/);
    return match ? match[2] : null;
  };

  const fetchDues = async (path) => {
    setLoading(true);
    const token = getTokenFromCookie();

    if (!token) {
      setMessage('Error: Token not found in cookies');
      setLoading(false);
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
       "ngrok-skip-browser-warning": "true"
    };

    try {
      const response = await axios.get(`${baseUrl}/api/repayments/${path}`, {
        headers,
      });
      setDues(response.data);
      setMessage('');
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage(error.response?.data || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Repayment Dues</h2>

      {message && <p style={{ color: 'red' }}>{message}</p>}

      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => fetchDues('all-dues')}>All Dues</button>{' '}
        <button onClick={() => fetchDues('dues-30-days')}>Dues in 30 Days</button>{' '}
        <button onClick={() => fetchDues('dues-7-days')}>Dues in 7 Days</button>{' '}
        <button onClick={() => fetchDues('dues-3-days')}>Dues in 3 Days</button>{' '}
        <button onClick={() => fetchDues('dues-1-day')}>Dues in 1 Day</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : dues.length === 0 ? (
        <p>No data to show</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Current Date</th>
              <th>Repayment Type</th>
              <th>Mobile No</th>
              <th>Due Date</th>
              <th>Due Amount</th>
            </tr>
          </thead>
          <tbody>
            {dues.map((item, idx) => (
              <tr key={idx}>
                <td>{item.currentDate}</td>
                <td>{item.repaymentType}</td>
                <td>{item.mobileNo}</td>
                <td>{item.dueDate}</td>
                <td>{item.dueAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RepaymentList;
