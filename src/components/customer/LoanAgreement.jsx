import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../javascript/api";

const LoanAgreement = () => {
  const [agreements, setAgreements] = useState({
    term1: false,
    term2: false,
    term3: false,
    term4: false,
  });
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleCheckboxChange = (e) => {
    setAgreements({ ...agreements, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async () => {
    if (!Object.values(agreements).every(Boolean)) {
      alert("Please agree to all terms.");
      return;
    }

    try {
      await api.post("/api/loan-agreement/agree-to-terms", agreements);
      setShowPopup(true);

      // Navigate to the PDF page after 2 seconds
      setTimeout(() => {
        navigate("/loan-agreement-pdf");
      }, 5);
    } catch (error) {
      console.error("Error submitting agreement:", error);
    }
  };

  return (
    <div>
      <h2>Loan Agreement Terms</h2>
      <label><input type="checkbox" name="term1" onChange={handleCheckboxChange} /> I agree to Term 1</label><br/>
      <label><input type="checkbox" name="term2" onChange={handleCheckboxChange} /> I agree to Term 2</label><br/>
      <label><input type="checkbox" name="term3" onChange={handleCheckboxChange} /> I agree to Term 3</label><br/>
      <label><input type="checkbox" name="term4" onChange={handleCheckboxChange} /> I agree to Term 4</label><br/>
      
      <button onClick={handleSubmit}>Submit Agreement</button>

      {showPopup && (
        <div className="popup">
          <p>Loan has been approved by Sklassics Finance Company.</p>
        </div>
      )}
    </div>
  );
};

export default LoanAgreement;