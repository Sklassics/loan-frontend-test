import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../../javascript/api";


const BASE_URL = import.meta.env.VITE_BASE_URL;


const PersonalDetailsForm = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    marital_status: "",
    father_name: "",
    address: "",
    pincode: "",
    country: "",
    alternate_number: "",
    employment_type: "Salaried",
    annual_income: "",
    college_id: "",
    college_address: "",
    college_name: "",
    company_id: "",
    company_address: "",
    company_name: "",
  });

  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    if (date) {
      const formattedDate = `${date
        .getDate()
        .toString()
        .padStart(2, "0")}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getFullYear()}`;
      setFormData({ ...formData, date_of_birth: formattedDate });
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true); 

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      alert("Token not found. Please log in.");
      setIsSubmitting(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("data", JSON.stringify(formData));

    if (formData.employment_type !== "Self-Employed" && file) {
      formDataToSend.append(
        formData.employment_type === "Student"
          ? "student_id_card"
          : "employee_id_card",
        file
      );
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/save-personal-details`,
        formDataToSend,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        document.cookie = `token=${response.data.token}; path=/;`;
        alert(response.data.message);
        navigate("/selfie");
      }
    } catch (error) {
      alert(error.response?.data?.message || "An unexpected error occurred.");
      setIsSubmitting(false); // Re-enable button on failure
    }
  };

  return (
    <div className="center container">
      <h2>Personal Details Form</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((field) => {
          if (
            [
              "college_id",
              "college_address",
              "college_name",
              "company_id",
              "company_address",
              "company_name",
            ].includes(field)
          ) {
            return null;
          }

          return (
            <div key={field}>
              <label>{field.replaceAll("_", " ").toUpperCase()}</label>
              {field === "date_of_birth" ? (
                <DatePicker
                  selected={
                    formData.date_of_birth
                      ? new Date(
                          formData.date_of_birth.split("-").reverse().join("-")
                        )
                      : null
                  }
                  onChange={handleDateChange}
                  dateFormat="dd-MM-yyyy"
                  className="border p-2 rounded w-full"
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                />
              ) : ["gender", "marital_status", "country", "employment_type"].includes(
                  field
                ) ? (
                <select
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full"
                >
                  {field === "gender" && (
                    <>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </>
                  )}
                  {field === "marital_status" && (
                    <>
                      <option value="">Select Marital Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </>
                  )}
                  {field === "country" && <option value="India">India</option>}
                  {field === "employment_type" && (
                    <>
                      <option value="Salaried">Salaried</option>
                      <option value="Self-Employed">Self-Employed</option>
                      <option value="Student">Student</option>
                    </>
                  )}
                </select>
              ) : (
                <input
                  type="text"
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full"
                />
              )}
            </div>
          );
        })}

        {/* Conditional Fields for Student */}
        {formData.employment_type === "Student" && (
          <>
            <label>College ID</label>
            <input
              type="text"
              name="college_id"
              value={formData.college_id || ""}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />

            <label>College Address</label>
            <input
              type="text"
              name="college_address"
              value={formData.college_address || ""}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />

            <label>College Name</label>
            <input
              type="text"
              name="college_name"
              value={formData.college_name || ""}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </>
        )}

        {/* Conditional Fields for Salaried */}
        {formData.employment_type === "Salaried" && (
          <>
            <label>Company ID</label>
            <input
              type="text"
              name="company_id"
              value={formData.company_id || ""}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />

            <label>Company Address</label>
            <input
              type="text"
              name="company_address"
              value={formData.company_address || ""}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />

            <label>Company Name</label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name || ""}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </>
        )}

        {/* File Upload Section */}
        {formData.employment_type !== "Self-Employed" && (
          <>
            <label>
              Upload{" "}
              {formData.employment_type === "Student"
                ? "Student ID Card"
                : "Employee ID Card"}
            </label>
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              className="border p-2 rounded w-full"
            />
          </>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default PersonalDetailsForm;
