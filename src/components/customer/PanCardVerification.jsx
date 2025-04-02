import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../../javascript/api';

const PanCardVerification = () => {
    const [pancardNumber, setPancardNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const navigate=useNavigate();
    const [loading, setLoading] = useState(false);

    const BASE_URL = import.meta.env.VITE_BASE_URL;


    const cibilData = {
        decentroTxnId: "XXXXXXXX",
        status: "SUCCESS",
        responseCode: "S00000",
        message: "Credit Report fetched successfully",
        data: {
            cCRResponse: {
                status: "1",
                cIRReportDataLst: [
                    {
                        cIRReportData: {
                            iDAndContactInfo: {
                                personalInfo: {
                                    name: {
                                        fullName: "VIJAY MALLYA",
                                        firstName: "VIJAY",
                                        lastName: "MALLYA "
                                    },
                                    dateOfBirth: "YYYY-MM-DD",
                                    gender: "Male",
                                    age: {
                                        age: "26"
                                    },
                                    totalIncome: "20412541",
                                    occupation: "SALARIED"
                                },
                                identityInfo: {
                                    pANId: [
                                        {
                                            seq: "1",
                                            reportedDate: "XXXX-XX-XX",
                                            idNumber: "XXXXXX"
                                        }
                                    ],
                                    passport: [
                                        {
                                            seq: "1",
                                            reportedDate: "XXXX-XX-XX",
                                            idNumber: "XXXXXXXX"
                                        }
                                    ]
                                },
                                addressInfo: [
                                    {
                                        seq: "1",
                                        reportedDate: "YYYY-MM-DD",
                                        address: "siddanthi, shamshbad",
                                        state: "telangana",
                                        postal: "501218",
                                        type: "Primary"
                                    }
                                ],
                                phoneInfo: [
                                    {
                                        seq: "1",
                                        typeCode: "H",
                                        reportedDate: "YYYY-MM-DD",
                                        number: "9945236585 "
                                    }
                                ],
                                emailAddressInfo: [
                                    {
                                        seq: "1",
                                        reportedDate: "YYYY-MM-DD",
                                        emailAddress: "example@email.com"
                                    }
                                ]
                            },
                         retailAccountsSummary: {
                                    noOfAccounts: "2",
                                    noOfActiveAccounts: "5",
                                    noOfWriteOffs: "7",
                                    totalPastDue: "3",
                                    mostSevereStatusWithIn24Months: "Delinquent",
                                    singleHighestCredit: "150000",
                                    singleHighestSanctionAmount: "200000",
                                    totalHighCredit: "500000",
                                    averageOpenBalance: "75000",
                                    singleHighestBalance: "120000",
                                    noOfPastDueAccounts: "2",
                                    noOfZeroBalanceAccounts: "3",
                                    recentAccount: "2024-01-15",
                                    oldestAccount: "2015-06-10",
                                    totalBalanceAmount: "900000",
                                    totalSanctionAmount: "1200000",
                                    totalCreditLimit: "600000",
                                    totalMonthlyPaymentAmount: "25000"
                                },

                            scoreDetails: [
                                {
                                    type: "ERS",
                                    version: "4.0",
                                    name: "ERS4.0",
                                    value: "849",
                                    scoringElements: [
                                        {
                                            type: "RES",
                                            seq: "1",
                                            code: "803",
                                            description: "Total Utilization"
                                        },
                                        {
                                            type: "RES",
                                            seq: "2",
                                            code: "802",
                                            description: "Total Credit Exposure"
                                        },
                                        {
                                            type: "RES",
                                            seq: "3",
                                            code: "804",
                                            description: "Credit Card Utilization"
                                        }
                                    ]
                                }
                            ],
                            otherKeyInd: {
                                ageOfOldestTrade: "XX",
                                numberOfOpenTrades: "X",
                                allLinesEVERWritten: "XXX",
                                allLinesEVERWrittenIn9Months: "X",
                                allLinesEVERWrittenIn6Months: "X"
                            },
                            recentActivities: {
                                accountsDeliquent: "X",
                                accountsOpened: "X",
                                totalInquiries: "X",
                                accountsUpdated: "X"
                            }
                        }
                    }
                ]
            }
        },
        responseKey: "success_credit_report"
    };
    const getToken = () => {
        console.log("Fetching token from cookies...");
        return document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    };

    const sendOtp = async () => {
        console.log("Sending OTP request...");
        const token = getToken();
        if (!token) {
            setMessage('Token not found. Please log in.');
            console.log("Token not found.");
            return;
        }
        const formData = new FormData();
        formData.append('pancardNumber', pancardNumber);

        try {
            const response = await api.post('/api/pancard/sendOtp', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log("OTP Sent Successfully:", response.data);
            alert(response.data.message);
        } catch (error) {
            console.error("Error sending OTP:", error.response?.data);
            alert(error.response?.data?.message);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        console.log("Uploading PAN Card...");
        const token = getToken();
        if (!token) {
            setMessage('Token not found. Please log in.');
            console.log("Token not found.");
            return;
        }
    
        const formData = new FormData();
        formData.append('pan_card_image', image);
        formData.append('otp', otp);
        formData.append('pancardNumber', pancardNumber);
    
        try {
            console.log("Making API call for PAN card upload...");
            const uploadResponse = await api.post('/api/verify-upload', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log("PAN Card uploaded successfully:", uploadResponse.data);
            alert(uploadResponse.data.message);
            navigate("/credit");   
        } catch (error) {
            console.error("Error processing request:", error.response?.data);
            setMessage(error.response?.data?.message || 'Error processing request');
        }
    };
    
    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
            <h2>PAN Card Verification</h2>
            <input
                type="text"
                placeholder="PAN Card Number"
                value={pancardNumber}
                onChange={(e) => setPancardNumber(e.target.value)}
                style={{ margin: '10px 0', padding: '8px', width: '100%' }}
            />
            <button onClick={sendOtp} style={{ padding: '8px', margin: '10px 0' }}>Send OTP</button>
            <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{ margin: '10px 0', padding: '8px', width: '100%' }}
            />
            <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                style={{ margin: '10px 0' }}
            />
            <button onClick={handleUpload} style={{ padding: '8px', margin: '10px 0' }}>Upload PAN Card</button>
            {message && <p style={{ color: 'red', margin: '10px 0' }}>{message}</p>}
            {loading && <div className="loading-overlay">Fetching CreditLimit </div>}

        </div>
    );
};

export default PanCardVerification;