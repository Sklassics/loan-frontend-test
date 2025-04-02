import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../../javascript/api";

const RepaymentSchedule = () => {
    const [schedule, setSchedule] = useState([]);
    const [totalPayable, setTotalPayable] = useState(0);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate(); // Initialize navigation

    const handlePaymentClick = () => {
        navigate("/bank-details"); // Redirect to Bank Details Page
    };

    useEffect(() => {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

        if (!token) {
            setError("Authentication token not found. Please log in.");
            setLoading(false);
            return;
        }

        const fetchRepaymentSchedule = async () => {
            try {
                console.log("Fetching repayment schedule from /api/get...");
                const response = await api.get("/api/get", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log("API Response:", response.data);

                if (!response.data.success || !Array.isArray(response.data.schedule) || response.data.schedule.length === 0) {
                    setError("No repayment schedule found.");
                    setSchedule([]);
                } else {
                    setSchedule(response.data.schedule);

                    // Calculate total payable amount
                    const total = response.data.schedule.reduce((acc, item) => acc + (item.repayableAmount || 0), 0);
                    setTotalPayable(total);
                }
            } catch (err) {
                console.error("Error fetching repayment schedule:", err);
                setError("Failed to generate or fetch repayment schedule. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchRepaymentSchedule();
    }, []);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Repayment Schedule</h2>

            {loading ? (
                <p>Loading repayment schedule...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : (
                <table border="1" style={{ margin: "auto", width: "80%", textAlign: "center" }}>
                    <thead>
                        <tr>
                            <th>Installment No.</th>
                            <th>Principal Amount</th>
                            <th>Interest</th>
                            <th>Due Date</th>
                            <th>Repayable Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedule.length > 0 ? (
                            schedule.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.sno}</td>
                                    <td>₹{item.principalAmount.toFixed(2)}</td>
                                    <td>₹{item.interest.toFixed(2)}</td>
                                    <td>{item.dueDate}</td>
                                    <td>₹{item.repayableAmount.toFixed(2)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: "center" }}>No repayment schedule available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            <h3>Total Payable: ₹{totalPayable.toFixed(2)}</h3>

            {totalPayable > 0 && (
                <button style={{ padding: "10px", marginTop: "20px" }} onClick={handlePaymentClick}>
                    Next 
                </button>
            )}
        </div>
    );
};

export default RepaymentSchedule;
