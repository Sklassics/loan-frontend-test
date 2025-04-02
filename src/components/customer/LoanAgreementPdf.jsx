import React, { useEffect, useState } from "react";
import axios from "axios";

const LoanAgreementPdf = () => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await axios.get("https://loanapp-x5qm.onrender.com/api/loan-agreement/generate-pdf", {
          responseType: "blob",
        });
        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        setPdfUrl(URL.createObjectURL(pdfBlob));
      } catch (error) {
        console.error("Error fetching PDF:", error);
      }
    };

    fetchPdf();
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await axios.post("https://loanapp-x5qm.onrender.com0/api/loan-agreement/submit-agreement");
      alert("Agreement PDF saved successfully in DB!");
    } catch (error) {
      console.error("Error saving agreement:", error);
      alert("Failed to save agreement PDF.");
    }
    setIsSubmitting(false);
  };

  return (
    <div>
      <h2>Loan Agreement Document</h2>
      {pdfUrl ? (
        <iframe src={pdfUrl} width="100%" height="600px" title="Loan Agreement"></iframe>
      ) : (
        <p>Loading PDF...</p>
      )}
      <br />
      <button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Agreement"}
      </button>
    </div>
  );
};

export default LoanAgreementPdf;