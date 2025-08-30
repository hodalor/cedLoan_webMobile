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
    <div className="loan-application-container">
      <div className="page-header">
        <button 
          className="back-button"
          onClick={() => navigate('/')}
        >
          ← Back
        </button>
        <h1>Apply for a Loan</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="loan-form">
        <div className="loan-amount-section">
          <h2>Loan Amount</h2>
          <div className="amount-display">
            <span className="currency">GHS</span>
            <span className="amount">{loanAmount.toFixed(2)}</span>
          </div>
          
          <div className="slider-container">
            <input
              type="range"
              min="100"
              max="5000"
              step="100"
              value={loanAmount}
              onChange={handleSliderChange}
              className="amount-slider"
            />
            <div className="slider-labels">
              <span>GHS 100</span>
              <span>GHS 5,000</span>
            </div>
          </div>
        </div>
        
        <div className="loan-term-section">
          <h2>Loan Term</h2>
          <div className="term-options">
            <button
              type="button"
              className={`term-option ${loanTerm === 7 ? 'active' : ''}`}
              onClick={() => handleTermChange(7)}
            >
              7 days
            </button>
            <button
              type="button"
              className={`term-option ${loanTerm === 14 ? 'active' : ''}`}
              onClick={() => handleTermChange(14)}
            >
              14 days
            </button>
            <button
              type="button"
              className={`term-option ${loanTerm === 30 ? 'active' : ''}`}
              onClick={() => handleTermChange(30)}
            >
              30 days
            </button>
          </div>
        </div>
        
        <div className="loan-summary">
          <h2>Loan Summary</h2>
          <div className="summary-item">
            <span>Loan Amount:</span>
            <span>GHS {loanAmount.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span>Interest ({interestRate}%):</span>
            <span>GHS {calculateInterest().toFixed(2)}</span>
          </div>
          <div className="summary-item total">
            <span>Total Repayment:</span>
            <span>GHS {calculateTotalRepayment().toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span>Due Date:</span>
            <span>{new Date(Date.now() + loanTerm * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="btn-primary submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Apply Now'}
        </button>
      </form>
    </div>
  );
};

export default LoanApplication;