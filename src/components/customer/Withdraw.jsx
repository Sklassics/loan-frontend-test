import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import calculateFees from "../../javascript/fees"; // Import fee calculation logic
import api from "../../javascript/api";

const Withdraw = () => {
    const [creditLimit, setCreditLimit] = useState(null);
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [tenure, setTenure] = useState("");
    const [fees, setFees] = useState({ processingFee: 0, onboardingFee: 0, documentationFee: 0 });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCreditLimit = async () => {
            try {
                const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
                const response = await api.get("/api/credit-limit", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log("Credit Limit API Response:", response.data);

                if (response.data.success) {
                    setCreditLimit(response.data.creditLimit);
                } else {
                    setError(response.data.message || "Failed to fetch credit limit.");
                }
            } catch (error) {
                setError("Failed to fetch credit limit");
                console.error("Error fetching credit limit:", error);
            }
        };
        fetchCreditLimit();
    }, []);

    useEffect(() => {
        if (withdrawAmount && tenure) {
            setFees(calculateFees(Number(withdrawAmount), tenure));
        }
    }, [withdrawAmount, tenure]);

    const availableAmounts = [2000, 5000, 10000, 20000];

    const getWithdrawOptions = (creditLimit) => {
        if (!creditLimit) return [];
        
        let filteredAmounts = availableAmounts.filter(amount => amount <= creditLimit);
        console.log("Filtered Amounts:", filteredAmounts);

        if (filteredAmounts.length === 0) return [];
        
        let closestLowerAmount = Math.max(...filteredAmounts, 0);
        console.log("Closest Lower Amount:", closestLowerAmount);

        return [...new Set(filteredAmounts.map(amount => (amount === closestLowerAmount ? creditLimit : amount)))].sort((a, b) => a - b);
    };

    const withdrawOptions = getWithdrawOptions(creditLimit);

    const getTenureOptions = (amount) => {
        amount = Number(amount);
        console.log("Checking tenure for amount:", amount);

        if (amount >= 500 && amount <= 2000) return ["1 month"];
        if (amount > 1000 && amount <= 3000) return ["1 month", "2 months"];
        if (amount > 3000 && amount <= 8000) return ["1 month", "2 months", "3 months"];
        if (amount > 8000 && amount <= 10000) return ["1 month", "2 months", "3 months", "5 months"];
        if (amount > 10000) return ["3 months", "6 months", "9 months"]; // ✅ Added tenure for >10K

        console.log("No tenure options found for amount:", amount);
        return [];
    };

    const handleWithdraw = async () => {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        const withdrawalDetails = { withdrawAmount, tenure, ...fees };

        try {
            console.log("Submitting Withdrawal:", withdrawalDetails);

            await api.post("/api/withdraw", withdrawalDetails, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("Calling /api/generate for repayment schedule...");
            console.log("Withdraw amount = " + withdrawAmount, "Tenure = " + tenure);

            // ✅ Re-added Repayment Schedule API Call
            await api.post("/api/generate", { withdrawAmount, tenure }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Navigate to Repayment Schedule after 500ms delay
            setTimeout(() => {
                navigate("/repay");
            }, 500);
        } catch (error) {
            setError("Failed to process withdrawal.");
            console.error("Error processing withdrawal:", error);
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Withdraw Funds</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <p>Available Credit Limit: ₹{creditLimit !== null ? creditLimit : "Loading..."}</p>

            <label>Amount to Withdraw:</label>
            <select 
                value={withdrawAmount} 
                onChange={(e) => {
                    const selectedValue = Number(e.target.value);
                    console.log("Selected Withdraw Amount:", selectedValue); 
                    setWithdrawAmount(selectedValue);
                }} 
                disabled={!creditLimit}
            >
                <option value="">Select Amount</option>
                {withdrawOptions.length > 0 ? (
                    withdrawOptions.map(amount => (
                        <option key={amount} value={amount}>₹{amount}</option>
                    ))
                ) : (
                    <option value="" disabled>No available amounts</option>
                )}
            </select>

            <label>Tenure:</label>
            <select 
                value={tenure} 
                onChange={(e) => {
                    console.log("Selected Tenure:", e.target.value);
                    setTenure(e.target.value);
                }} 
                disabled={!withdrawAmount}
            >
                <option value="">Select Tenure</option>
                {getTenureOptions(withdrawAmount).map(months => (
                    <option key={months} value={months}>{months}</option>
                ))}
            </select>

            <h3>Fees:</h3>
            <p>Processing Fee: ₹{fees.processingFee}</p>
            <p>Onboarding Fee: ₹{fees.onboardingFee}</p>
            <p>Loan Documentation Fee: ₹{fees.documentationFee}</p>

            <button 
                onClick={handleWithdraw} 
                style={{ padding: "10px", marginTop: "20px" }} 
                disabled={!withdrawAmount || !tenure}
            >
                View Repayment Schedule
            </button>
        </div>
    );
};

export default Withdraw;
