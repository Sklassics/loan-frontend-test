
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Register from "./components/customer/Register";
import EmailVerification from "./components/customer/EmailVerification";
import PersonalDetailsForm from "./components/customer/PersonalDetailsForm";
import CreditLimit from "./components/customer/CreditLimit";
import MessagePage from "./components/customer/MessagePage";
import Withdraw from "./components/customer/Withdraw";
import RepaymentSchedule from "./components/customer/RepaymentSchedule";
import BankDetailsForm from "./components/customer/BankDetails";
import LoanAgreement from "./components/customer/LoanAgreement";
import LoanAgreementPdf from "./components/customer/LoanAgreementPdf";
import PanCardVerification from "./components/customer/PanCardVerification";
import AdminLoginPage from "./components/admin/AdminLoginPage";
import AdminDashboard from "./components/admin/AdminDashboard";
import CustomerDetailsView from "./components/admin/CustomerDetailsView";
import SelfieUpload from "./components/customer/SelfieUpload";
import CreateAdminPage from "./components/admin/CreateAdminPage";


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />

        <Route path="/email-verification" element={<EmailVerification />} />

        <Route path="/personal-details" element={<PersonalDetailsForm />} />

        <Route path="/selfie" element={<SelfieUpload/>}/>


        <Route path="/kyc" element={<PanCardVerification/>} /> 

        <Route path="/credit" element={<CreditLimit/>}/>

        <Route path="/message" element={<MessagePage />} />

        <Route path="/withdraw" element={<Withdraw/>}/>

        <Route path="/repay" element={<RepaymentSchedule/>}/>

        <Route path="/bank-details" element={<BankDetailsForm/>}/>

        <Route path ="/loan" element={<LoanAgreement/>}/>

        <Route path ="/loan-agreement-pdf" element={<LoanAgreementPdf/>}/>




        
        <Route path="/admin-create" element={<CreateAdminPage/>}/>

        <Route path="/admin" element={<AdminLoginPage/>}/>

        <Route path="/admin-dashboard" element={<AdminDashboard/>}/>

        <Route path="/admin/view/:mobileNumber" element={<CustomerDetailsView/>} />




      </Routes>
    </Router>
  );
}

export default App;
