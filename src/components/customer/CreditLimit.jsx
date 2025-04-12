import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../javascript/api";

const CreditLimit = () => {
    const [creditLimit, setCreditLimit] = useState(null);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [buttonVisible, setButtonVisible] = useState(true);
    const navigate = useNavigate();

    const getTokenFromCookies = () => {
        console.log("Retrieving token from cookies...");
        const cookies = document.cookie.split("; ");
        const tokenCookie = cookies.find(row => row.startsWith("token="));
        const token = tokenCookie ? tokenCookie.split("=")[1] : null;
        console.log("Token retrieved:", token);
        return token;
    };



    const fetchCreditLimit = async () => {
        console.log("Fetching credit limit....");
        const token = getTokenFromCookies();

        if (!token) {
            console.warn("No token found! Authentication required.");
            setMessage("Authentication required. Please log in.");
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            console.log("Sending request to API...");
            const response = await api.get("/api/credit-limit", {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            console.log("API Response:", response);
            
            if (response.status === 200) {
                console.log("Credit limit received:", response.creditLimit);
                setCreditLimit(response.data.creditLimit);
                setMessage("Credit limit retrieved successfully.");
                setButtonVisible(false);
            } else if (response.status === 202) {
                console.warn("Redirection message received:", response.data.message);
                window.location.href = `/message?message=${encodeURIComponent(response.data.message)}`;      
            }
        } catch (err) {
            console.error("Error occurred while fetching credit limit:", err);
            if (err.response && err.response.data) {
                const errorCode = err.response.data.code;
                const errorMessage = err.response.data.message;
                console.warn(`Error (${errorCode}): ${errorMessage}`);
                setMessage(`
                     ${errorMessage}`);
            }
        } finally {
            console.log("Finished fetching credit limit.");
            setLoading(false);
        }
    };

    const handleWithdraw = () => {
        console.log("Navigating to Withdraw page...");
        navigate("/withdraw");
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            {buttonVisible && (
                <button
                    onClick={fetchCreditLimit}
                    style={{
                        padding: "10px",
                        fontSize: "16px",
                        cursor: "pointer",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "5px"
                    }}
                >
                    {loading ? "Checking..." : "Check Eligibility"}
                </button>
            )}

            {message && <p style={{ color: "red", marginTop: "20px" }}>{message}</p>}

            {creditLimit !== null && (
                <div style={{ marginTop: "30px" }}>
                    <h2>Credit Limit</h2>
                    <h3>Your credit limit is: ₹{creditLimit}</h3>

                    <button
                        onClick={handleWithdraw}
                        style={{
                            marginTop: "20px",
                            padding: "10px",
                            fontSize: "16px",
                            cursor: "pointer",
                            backgroundColor: "#28a745",
                            color: "white",
                            border: "none",
                            borderRadius: "5px"
                        }}
                    >
                        Withdraw
                    </button>
                </div>
            )}
        </div>
    );
};

export default CreditLimit;
