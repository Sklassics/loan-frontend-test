import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../javascript/api";

export default function SelfieUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getTokenFromCookies = () => {
    const match = document.cookie.match(/(?:^|; )token=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  };

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setMessage("");
    setError("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image file.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    const formData = new FormData();
    formData.append("selfie_image", file);

    try {
      const token = getTokenFromCookies();
      const response = await api.post("/selfie/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        alert(response.data.message); // "Selfie uploaded successfully"
        navigate("/kyc");
      } else {
        setError(response.data.message || "Failed to upload selfie.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while uploading.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container center">
      <h2>Upload Selfie</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
