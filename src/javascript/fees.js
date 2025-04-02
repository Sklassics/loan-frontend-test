const calculateFees = (withdrawAmount, tenure) => {
    let processingFee = 0;
    let onboardingFee = 0;
    let documentationFee = 0;

    // Example calculation logic (customize as needed)
    if (withdrawAmount && tenure) {
        processingFee = withdrawAmount * 0.02; // 2% processing fee
        onboardingFee = withdrawAmount * 0.01; // 1% onboarding fee
        documentationFee = tenure > 12 ? 500 : 300; // Fixed fee based on tenure
    }

    return {
        processingFee: Math.round(processingFee),
        onboardingFee: Math.round(onboardingFee),
        documentationFee
    };
};

export default calculateFees;