import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import api from "../../javascript/api";

const CustomerDetailsView = () => {
  const { mobileNumber } = useParams();
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionType, setActionType] = useState(null);
  const [reason, setReason] = useState("");

  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("admintoken="))
          ?.split("=")[1];

        if (!token) throw new Error("Token not found");

        const response = await api.get(
          `/admin/customers/${mobileNumber}`,
          { headers: { Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
           }
         }
        );

        if (response.data?.length > 0) {
          setCustomerData(response.data[0]);
        } else {
          setCustomerData(null);
        }
      } catch (error) {
        console.error("Error fetching customer details:", error);
        setCustomerData(null);
      }
      setLoading(false);
    };

    fetchCustomerDetails();
  }, [mobileNumber]);

  const handleAction = (type) => {
    setActionType(type);
  };
  const handleSubmit = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("admintoken="))
        ?.split("=")[1];
  
      if (!token) throw new Error("Token not found");
  
      await api.post(
        "/validate/save-approval",
        {
          mobileNumber,
          actionType,
          reason,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          "ngrok-skip-browser-warning": "true",
        }
      );
  
      alert(`Customer ${actionType} successful!`);
      setActionType(null);
      setReason("");
      navigate("/admin-dashboard")
    } catch (error) {
      console.error("Error submitting action:", error);
      alert("Failed to submit action");
    }
  };
  
  

  if (loading) return <p>Loading customer details...</p>;
  if (!customerData) return <p>No customer data found.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Customer Details</h2>

      {/* Image Display Section */}
      <div style={{ display: "flex", justifyContent: "center", gap: "30px", marginBottom: "20px" }}>
        {customerData.pancardImage && (
          <div>
            <h3>PAN Card</h3>
            <img src={customerData.pancardImage} alt="PAN Card" style={imageStyle} />
          </div>
        )}
        {customerData.selfieImage && (
          <div>
            <h3>Selfie</h3>
            <img src={customerData.selfieImage} alt="Selfie" style={imageStyle} />
          </div>
        )}
        {customerData.employeementType && (
          <div>
            <h3>ID Proof</h3>
            <img src={customerData.employeementType} alt="ID Proof" style={imageStyle} />
          </div>
        )}
      </div>

      {/* Customer Details Table */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(customerData).map(([key, value]) =>
            !["pancardImage", "selfieImage", "employeementType"].includes(key) ? (
              <tr key={key}>
                <td><strong>{formatFieldName(key)}</strong></td>
                <td>{typeof value === "object" ? JSON.stringify(value) : value || "N/A"}</td>
              </tr>
            ) : null
          )}
        </tbody>
      </table>

      {/* Approval & Rejection Buttons */}
      <div style={{ marginTop: "20px" }}>
        <button style={approveStyle} onClick={() => handleAction("APPROVED")}>
          Approve
        </button>
        <button style={rejectStyle} onClick={() => handleAction("REJECTED")}>
          Reject
        </button>
      </div>

      {/* Reason Input Field (Shows only when an action is selected) */}
      {actionType && (
        <div style={{ marginTop: "20px" }}>
          <label>Reason for {actionType}:</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={textareaStyle}
          ></textarea>
          <button onClick={handleSubmit} style={submitStyle}>
            Send
          </button>
        </div>
      )}
    </div>
  );
};

// Format field names nicely
const formatFieldName = (field) =>
  field.replace(/([A-Z])/g, " $1").replace(/_/g, " ").replace(/^./, (str) => str.toUpperCase());

// Styles
const imageStyle = {
  width: "250px",
  height: "auto",
  borderRadius: "10px",
  boxShadow: "0px 4px 6px rgba(0,0,0,0.2)",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "left",
};

// Button Styles
const approveStyle = {
  backgroundColor: "green",
  color: "white",
  padding: "10px 20px",
  marginRight: "10px",
  border: "none",
  cursor: "pointer",
};

const rejectStyle = {
  backgroundColor: "red",
  color: "white",
  padding: "10px 20px",
  border: "none",
  cursor: "pointer",
};

const textareaStyle = {
  width: "100%",
  height: "80px",
  marginTop: "10px",
  padding: "10px",
};

const submitStyle = {
  backgroundColor: "blue",
  color: "white",
  padding: "10px 20px",
  marginTop: "10px",
  border: "none",
  cursor: "pointer",
};

export default CustomerDetailsView;
