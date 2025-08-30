import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoanApplication = () => {
  const navigate = useNavigate();
  const [loanAmount, setLoanAmount] = useState(500);
  const [loanTerm, setLoanTerm] = useState(14); // days
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Interest rate (5% for this example)
  const interestRate = 5;
  
  // Calculate interest amount
  const calculateInterest = () => {
    return (loanAmount * interestRate / 100) * (loanTerm / 30);
  };
  
  // Calculate total repayment amount
  const calculateTotalRepayment = () => {
    return loanAmount + calculateInterest();
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
            <div className="row mb-3">
              <div className="col-6">Interest ({interestRate}%):</div>
              <div className="col-6 text-end fw-bold text-warning">GHS {calculateInterest().toFixed(2)}</div>
            </div>
            <hr />
            <div className="row mb-3">
              <div className="col-6 fw-bold text-primary">Total Repayment:</div>
              <div className="col-6 text-end fw-bold text-primary fs-5">GHS {calculateTotalRepayment().toFixed(2)}</div>
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