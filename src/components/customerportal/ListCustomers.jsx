import React, { useState, useEffect } from 'react';
import api from '../../javascript/api';

const ListCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true); // Start with loading true

  const getTokenFromCookie = () => {
    const match = document.cookie.match(/(^|;) ?customerportaltoken=([^;]*)(;|$)/);
    return match ? match[2] : null;
  };

  const fetchCustomers = async () => {
    const token = getTokenFromCookie();

    if (!token) {
      setMessage('Error: Token not found in cookies');
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/api/customer-portal-customers/list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomers(response.data.customers || []);
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || 'Failed to fetch customers'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(); // Automatically fetch on mount
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Customer List</h2>

      {loading && <p>Loading...</p>}
      {message && <p style={{ color: 'red' }}>{message}</p>}

      {!loading && customers.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f0f0f0' }}>
              <tr>
                <th>Mobile</th>
                <th>Email Verified</th>
                <th>Selfie Verified</th>
                <th>PAN Verified</th>
                <th>Documents Verified</th>
                <th>Personal Details</th>
                <th>Agreement</th>
                <th>Repayment Schedule</th>
                <th>Withdraw Amount</th>
                <th>Bank Details</th>
                <th>Credit Limit</th>
                <th>All Verified</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr key={i}>
                  <td>{c.mobileNumber}</td>
                  <td>{c.isEmailVerified ? '✅' : '❌'}</td>
                  <td>{c.isSelfieVerified ? '✅' : '❌'}</td>
                  <td>{c.isPancardVerified ? '✅' : '❌'}</td>
                  <td>{c.isDocumentVerification ? '✅' : '❌'}</td>
                  <td>{c.isPersonalDetailsVerified ? '✅' : '❌'}</td>
                  <td>{c.isAgreement ? '✅' : '❌'}</td>
                  <td>{c.isRepaymentSchedule ? '✅' : '❌'}</td>
                  <td>{c.isWithDrawAmount ? '✅' : '❌'}</td>
                  <td>{c.isBankDetails ? '✅' : '❌'}</td>
                  <td>{c.isCreditLimit ? '✅' : '❌'}</td>
                  <td>{c.isAllVerified ? '✅' : '❌'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListCustomers;
