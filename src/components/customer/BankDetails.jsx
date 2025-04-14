import { useState } from "react";

const BankDetailsForm = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        bankName: "",
        address: "",
        accountNumber: "",
        ifsc:"",
        
    });
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);

    const getTokenFromCookies = () => {
        const cookies = document.cookie.split("; ");
        const tokenCookie = cookies.find(row => row.startsWith("token="));
        return tokenCookie ? tokenCookie.split("=")[1] : null;
    };


    const BASE_URL = import.meta.env.VITE_BASE_URL;

    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const sendOtp = async () => {   
        const token = getTokenFromCookies();
        try {
            const response = await fetch(`${BASE_URL}/api/bank-details/send-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error("Failed to send OTP");

            alert("OTP sent successfully!");
            setOtpSent(true);
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to send OTP.");
        }
    };

    const verifyOtp = async () => {
        if (!otp) {
            alert("Please enter the OTP before verifying.");
            return;
        }

        const token = getTokenFromCookies();
        try {
            const response = await fetch(`${BASE_URL}/api/bank-details/verify-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ ...formData, otp }) // Send full form data including OTP
            });

            if (!response.ok) throw new Error("OTP verification failed");

            alert("OTP verified successfully! Bank details saved.");
            setOtpVerified(true);
        } catch (error) {
            console.error("Error:", error);
            alert("Invalid OTP. Please try again.");
        }
    };

    return ( 
        <form className="form-container">
            {Object.keys(formData).map((key) => (
                <div key={key} className="input-group">
                    <label>{key.replace(/([A-Z])/g, ' $1').trim()}:</label>
                    <input 
                        type="text" 
                        name={key} 
                        value={formData[key]} 
                        onChange={handleChange} 
                        required 
                        disabled={otpVerified} // Disable inputs after OTP verification
                    />
                </div>
            ))}

            {!otpSent ? (
                <button type="button" onClick={sendOtp} className="send-otp-button">
                    Send OTP
                </button>
            ) : (
                <div className="input-group">
                    <label>Enter OTP:</label>
                    <input 
                        type="text" 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                        required 
                        disabled={otpVerified} 
                    />
                    <button 
                        type="button" 
                        onClick={verifyOtp} 
                        className={otpVerified ? "verified-button" : "verify-otp-button"}
                        disabled={otpVerified}
                    >
                        {otpVerified ? "OTP Verified" : "Verify OTP"}
                    </button>
                </div>
            )}
        </form>
    );
};

export default BankDetailsForm;
