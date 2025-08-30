import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoanApplication = () => {
  const navigate = useNavigate();
  const [loanAmount, setLoanAmount] = useState(500);
  const [loanTerm, setLoanTerm] = useState(14); // days
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fee structure based on local law compliance
  const calculateFees = () => {
    let interestRate = 0;
    let serviceFeeRate = 20; // 20%
    let adminFeeRate = 10; // 10%
    let commitmentFeeRate = 6; // 6%
    
    // Set interest rates based on loan term
    if (loanTerm === 7) {
      interestRate = 1; // 1% for 7 days
      // Target: 22% total (1% interest + 21% other fees)
      let targetOtherFees = 22 - interestRate;
      let adjustmentFactor = targetOtherFees / (serviceFeeRate + adminFeeRate + commitmentFeeRate);
      serviceFeeRate *= adjustmentFactor;
      adminFeeRate *= adjustmentFactor;
      commitmentFeeRate *= adjustmentFactor;
    } else if (loanTerm === 14) {
      interestRate = 2; // 2% for 14 days
      // Target: 26% total (2% interest + 24% other fees)
      let targetOtherFees = 26 - interestRate;
      let adjustmentFactor = targetOtherFees / (serviceFeeRate + adminFeeRate + commitmentFeeRate);
      serviceFeeRate *= adjustmentFactor;
      adminFeeRate *= adjustmentFactor;
      commitmentFeeRate *= adjustmentFactor;
    } else if (loanTerm === 30) {
      interestRate = 4; // 4% for 30 days
      // Target: 30% total (4% interest + 26% other fees)
      let targetOtherFees = 30 - interestRate;
      let adjustmentFactor = targetOtherFees / (serviceFeeRate + adminFeeRate + commitmentFeeRate);
      serviceFeeRate *= adjustmentFactor;
      adminFeeRate *= adjustmentFactor;
      commitmentFeeRate *= adjustmentFactor;
    }
    
    // Calculate actual amounts
    const interestAmount = loanAmount * interestRate / 100;
    const adjustedServiceFee = loanAmount * serviceFeeRate / 100;
    const adjustedAdminFee = loanAmount * adminFeeRate / 100;
    const adjustedCommitmentFee = loanAmount * commitmentFeeRate / 100;
    
    return {
      interestAmount,
      serviceFee: adjustedServiceFee,
      adminFee: adjustedAdminFee,
      commitmentFee: adjustedCommitmentFee,
      totalFees: interestAmount + adjustedServiceFee + adjustedAdminFee + adjustedCommitmentFee
    };
  };
  
  // Calculate total repayment amount
  const calculateTotalRepayment = () => {
    const fees = calculateFees();
    return loanAmount + fees.totalFees;
  };
  
  const handleSliderChange = (e) => {
    setLoanAmount(parseInt(e.target.value));
  };
  
  const handleTermChange = (days) => {
    setLoanTerm(days);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Navigate to success page or back to home
      navigate('/');
    }, 2000);
  };
  
  return (
    <div className="container mt-4">
      <div className="page-header">
        <button 
          className="btn btn-outline-light btn-sm mb-3"
          onClick={() => navigate('/home')}
        >
          ← Back
        </button>
        <h1 className="page-title">Apply for a Loan</h1>
        <p className="page-subtitle">Get instant loans up to GHS 5,000</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="card custom-card">
          <div className="card-body">
            <h3 className="card-title text-primary mb-4">💰 Loan Amount</h3>
            <div className="text-center mb-4">
              <div className="display-4 text-primary fw-bold">GHS {loanAmount.toFixed(2)}</div>
            </div>
            
            <div className="mb-4">
              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={loanAmount}
                onChange={handleSliderChange}
                className="form-range"
              />
              <div className="d-flex justify-content-between mt-2">
                <small className="text-muted">GHS 100</small>
                <small className="text-muted">GHS 5,000</small>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card custom-card">
          <div className="card-body">
            <h3 className="card-title text-success mb-4">📅 Loan Term</h3>
            <div className="row g-2">
              <div className="col-4">
                <button
                  type="button"
                  className={`btn w-100 ${loanTerm === 7 ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => handleTermChange(7)}
                >
                  7 days
                </button>
              </div>
              <div className="col-4">
                <button
                  type="button"
                  className={`btn w-100 ${loanTerm === 14 ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => handleTermChange(14)}
                >
                  14 days
                </button>
              </div>
              <div className="col-4">
                <button
                  type="button"
                  className={`btn w-100 ${loanTerm === 30 ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => handleTermChange(30)}
                >
                  30 days
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card custom-card">
          <div className="card-body">
            <h3 className="card-title text-info mb-4">📊 Loan Summary</h3>
            <div className="row mb-3">
              <div className="col-6">Loan Amount:</div>
              <div className="col-6 text-end fw-bold">GHS {loanAmount.toFixed(2)}</div>
            </div>
            
            {/* Fee Breakdown */}
            <div className="mb-3">
              <h6 className="text-muted mb-2">Fee Breakdown:</h6>
              <div className="row mb-2">
                <div className="col-8">Interest ({loanTerm === 7 ? '1' : loanTerm === 14 ? '2' : '4'}%):</div>
                <div className="col-4 text-end text-warning">GHS {calculateFees().interestAmount.toFixed(2)}</div>
              </div>
              {calculateFees().serviceFee > 0 && (
                <div className="row mb-2">
                  <div className="col-8">Service Fee:</div>
                  <div className="col-4 text-end text-info">GHS {calculateFees().serviceFee.toFixed(2)}</div>
                </div>
              )}
              {calculateFees().adminFee > 0 && (
                <div className="row mb-2">
                  <div className="col-8">Administration Fee:</div>
                  <div className="col-4 text-end text-info">GHS {calculateFees().adminFee.toFixed(2)}</div>
                </div>
              )}
              {calculateFees().commitmentFee > 0 && (
                <div className="row mb-2">
                  <div className="col-8">Commitment Fee:</div>
                  <div className="col-4 text-end text-info">GHS {calculateFees().commitmentFee.toFixed(2)}</div>
                </div>
              )}
            </div>
            
            <hr />
            <div className="row mb-3">
              <div className="col-6 fw-bold text-primary">Total Repayment:</div>
              <div className="col-6 text-end fw-bold text-primary fs-5">GHS {calculateTotalRepayment().toFixed(2)}</div>
            </div>
            <div className="row mb-2">
              <div className="col-6">Total Fee Rate:</div>
              <div className="col-6 text-end fw-bold text-success">{((calculateFees().totalFees / loanAmount) * 100).toFixed(1)}%</div>
            </div>
            <div className="row">
              <div className="col-6">Due Date:</div>
              <div className="col-6 text-end fw-bold text-success">{new Date(Date.now() + loanTerm * 24 * 60 * 60 * 1000).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
        
        <div className="d-grid gap-2 mt-4 page-bottom-actions">
          <button 
            type="submit" 
            className="btn btn-primary btn-lg btn-custom"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Processing...
              </>
            ) : (
              '🚀 Apply Now'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoanApplication;