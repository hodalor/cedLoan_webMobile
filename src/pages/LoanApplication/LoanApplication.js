import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { useSocket } from '../../contexts/SocketContext';
import { loansAPI } from '../../services/api';

const LoanApplication = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  useSocket(); // Initialize socket connection
  const [loanAmount, setLoanAmount] = useState(100);
  const [loanTerm, setLoanTerm] = useState(14);
  const [loanStatus, setLoanStatus] = useState(null); // null, 'under_review', 'rejected', 'approved'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [remainingBalance, setRemainingBalance] = useState(0);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Listen for real-time loan status updates
  useEffect(() => {
    const handleLoanStatusUpdate = (event) => {
      const { status, message } = event.detail;
      console.log('📋 Received loan status update:', event.detail);
      
      // Update loan status if it matches current application
      setLoanStatus(status);
      
      // Show toast notification
      if (message) {
        showToast(message, 'info');
      }
    };

    // Add event listener for loan status updates
    window.addEventListener('loanStatusUpdate', handleLoanStatusUpdate);

    // Cleanup event listener
    return () => {
      window.removeEventListener('loanStatusUpdate', handleLoanStatusUpdate);
    };
  }, [showToast]);
  
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const fees = calculateFees();
      const totalRepayment = calculateTotalRepayment();
      
      const loanData = {
        amount: loanAmount,
        duration: loanTerm,
        purpose: 'Personal loan',
        interestRate: fees.interestRate,
        totalRepayment: totalRepayment,
        fees: {
          serviceFee: fees.serviceFeeAmount,
          adminFee: fees.adminFeeAmount,
          commitmentFee: fees.commitmentFeeAmount
        }
      };
      
      await loansAPI.applyForLoan(loanData);
      setLoanStatus('under_review');
      showToast('Loan application submitted successfully!', 'success');
      navigate('/history');
    } catch (error) {
      showToast(error.message || 'Failed to submit loan application', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleMakePayment = () => {
    setShowPaymentModal(true);
  };
  
  const [paymentType, setPaymentType] = useState('full');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('mtn');
  
  const handlePaymentSubmit = () => {
    const amount = paymentType === 'full' ? remainingBalance : parseFloat(paymentAmount);
    
    // Validation
    if (paymentType === 'partial' && (!paymentAmount || amount <= 0)) {
      alert('Please enter a valid payment amount.');
      return;
    }
    
    if (amount > remainingBalance) {
      alert(`Payment amount (GHS ${amount.toFixed(2)}) cannot exceed remaining balance (GHS ${remainingBalance.toFixed(2)}).`);
      return;
    }
    
    if (!mobileNumber || mobileNumber.length < 10) {
      alert('Please enter a valid mobile number.');
      return;
    }
    
    // Process payment
    const newBalance = remainingBalance - amount;
    setRemainingBalance(newBalance);
    
    // Add to payment history
    const payment = {
      id: Date.now(),
      amount: amount,
      date: new Date().toLocaleDateString(),
      provider: selectedProvider.toUpperCase(),
      number: mobileNumber,
      type: paymentType
    };
    setPaymentHistory([...paymentHistory, payment]);
    
    // Check if fully paid
    if (newBalance <= 0) {
      setLoanStatus(null);
      setTermsAccepted(false);
      alert(`Payment successful! GHS ${amount.toFixed(2)} paid via ${selectedProvider.toUpperCase()}. Loan fully repaid!`);
    } else {
      alert(`Payment successful! GHS ${amount.toFixed(2)} paid via ${selectedProvider.toUpperCase()}. Remaining balance: GHS ${newBalance.toFixed(2)}`);
    }
    
    setShowPaymentModal(false);
    setPaymentAmount('');
    setMobileNumber('');
  };
  
  // Simulate admin actions for demo purposes
  const simulateAdminReject = () => {
    setLoanStatus('rejected');
    alert('Loan application has been rejected. You can apply for a new loan.');
  };
  
  const simulateAdminApprove = () => {
    const totalAmount = calculateTotalRepayment();
    setLoanStatus('approved');
    setRemainingBalance(totalAmount);
    alert('Congratulations! Your loan has been approved. You can now make payment.');
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
                  <div className="col-8">Service Fee ({((calculateFees().serviceFee / loanAmount) * 100).toFixed(1)}%):</div>
                  <div className="col-4 text-end text-info">GHS {calculateFees().serviceFee.toFixed(2)}</div>
                </div>
              )}
              {calculateFees().adminFee > 0 && (
                <div className="row mb-2">
                  <div className="col-8">Administration Fee ({((calculateFees().adminFee / loanAmount) * 100).toFixed(1)}%):</div>
                  <div className="col-4 text-end text-info">GHS {calculateFees().adminFee.toFixed(2)}</div>
                </div>
              )}
              {calculateFees().commitmentFee > 0 && (
                <div className="row mb-2">
                  <div className="col-8">Commitment Fee ({((calculateFees().commitmentFee / loanAmount) * 100).toFixed(1)}%):</div>
                  <div className="col-4 text-end text-info">GHS {calculateFees().commitmentFee.toFixed(2)}</div>
                </div>
              )}
            </div>
            
            <hr />
            <div className="row mb-3">
              <div className="col-6 fw-bold text-primary">Total Repayment:</div>
              <div className="col-6 text-end fw-bold text-primary fs-5">GHS {calculateTotalRepayment().toFixed(2)}</div>
            </div>
            
            <div className="alert alert-warning mt-3">
              <small>
                <strong>⚠️ Important:</strong> Overdue penalty of <strong>2% per day</strong> applies to late payments.
              </small>
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
        
        {/* Loan Status Display */}
        {loanStatus && (
          <div className={`alert ${loanStatus === 'approved' ? 'alert-success' : loanStatus === 'rejected' ? 'alert-danger' : 'alert-info'} mb-3`}>
            <strong>Loan Status: </strong>
            {loanStatus === 'under_review' && '🔍 Under Review - Please wait for admin approval'}
            {loanStatus === 'rejected' && '❌ Rejected - You can apply for a new loan'}
            {loanStatus === 'approved' && '✅ Approved - Ready for payment'}
          </div>
        )}
        
        {/* Terms and Conditions */}
         {!loanStatus && (
           <div className="card mb-4">
             <div className="card-header">
               <h6 className="mb-0">📋 Terms and Conditions</h6>
             </div>
             <div className="card-body" style={{maxHeight: '200px', overflowY: 'auto'}}>
               <div className="small">
                 <h6>CEDI Loan Terms and Conditions</h6>
                 <p><strong>1. Loan Agreement:</strong> By applying for this loan, you agree to repay the full amount plus applicable fees within the specified term.</p>
                 
                 <p><strong>2. Interest Rates:</strong></p>
                 <ul>
                   <li>7-day loans: 1% interest + applicable fees = 22% total</li>
                   <li>14-day loans: 2% interest + applicable fees = 26% total</li>
                   <li>30-day loans: 4% interest + applicable fees = 30% total</li>
                 </ul>
                 
                 <p><strong>3. Overdue Penalties:</strong> A penalty of 2% per day will be charged on the remaining outstanding loan balance for overdue payments.</p>
                 
                 <p><strong>4. Payment Methods:</strong> Payments can be made via mobile money (MTN, Airtel, Hubtel) in full or partial amounts.</p>
                 
                 <p><strong>5. Partial Payments:</strong> Partial payments are accepted, but overdue penalties apply to the remaining balance.</p>
                 
                 <p><strong>6. Loan Approval:</strong> All loans are subject to approval. Rejected applications can reapply immediately.</p>
                 
                 <p><strong>7. Data Privacy:</strong> Your personal and financial information is protected and used only for loan processing.</p>
                 
                 <p><strong>8. Default:</strong> Failure to repay may result in additional penalties and affect future loan eligibility.</p>
                 
                 <p><strong>9. Contact:</strong> For support, contact our customer service team.</p>
                 
                 <p><strong>10. Agreement:</strong> By checking the box below, you acknowledge that you have read, understood, and agree to these terms.</p>
               </div>
             </div>
             <div className="card-footer">
               <div className="form-check">
                 <input 
                   className="form-check-input" 
                   type="checkbox" 
                   id="termsCheck"
                   checked={termsAccepted}
                   onChange={(e) => setTermsAccepted(e.target.checked)}
                 />
                 <label className="form-check-label" htmlFor="termsCheck">
                   I have read and agree to the Terms and Conditions
                 </label>
               </div>
             </div>
           </div>
         )}
         
         {/* Admin Simulation Buttons (for demo purposes) */}
         {loanStatus === 'under_review' && (
           <div className="mb-3">
             <small className="text-muted">Admin Actions (Demo):</small>
             <div className="d-flex gap-2 mt-1">
               <button className="btn btn-sm btn-outline-success" onClick={simulateAdminApprove}>
                 Approve Loan
               </button>
               <button className="btn btn-sm btn-outline-danger" onClick={simulateAdminReject}>
                 Reject Loan
               </button>
             </div>
           </div>
         )}
        
        <div className="d-grid gap-2 mt-4 page-bottom-actions">
          {loanStatus === 'approved' ? (
            <div>
              <div className="alert alert-info mb-3">
                ✅ <strong>Loan Approved!</strong><br/>
                Outstanding Balance: <strong>GHS {remainingBalance.toFixed(2)}</strong>
              </div>
              <button 
                className="btn btn-success btn-lg btn-custom" 
                onClick={handleMakePayment}
              >
                💳 Make Payment
              </button>
            </div>
          ) : loanStatus === 'rejected' ? (
            <div>
              <div className="alert alert-danger mb-3">
                ❌ <strong>Application Rejected</strong><br/>
                Your loan application has been rejected. Please review your information and try again.
              </div>
              <button 
                type="submit" 
                className="btn btn-primary btn-lg btn-custom"
                disabled={isSubmitting || !termsAccepted}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Processing...
                  </>
                ) : !termsAccepted ? (
                  '📋 Accept Terms to Continue'
                ) : (
                  '🔄 Reapply'
                )}
              </button>
            </div>
          ) : (
            <button 
               type="submit" 
               className="btn btn-primary btn-lg btn-custom"
               disabled={isSubmitting || loanStatus === 'under_review' || !termsAccepted}
             >
               {isSubmitting ? (
                 <>
                   <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                   Processing...
                 </>
               ) : loanStatus === 'under_review' ? (
                 '⏳ Application Under Review'
               ) : !termsAccepted ? (
                 '📋 Accept Terms to Continue'
               ) : (
                 '🚀 Apply Now'
               )}
             </button>
          )}
        </div>
      </form>
      
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">💳 Make Payment</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowPaymentModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Outstanding Balance: <span className="text-danger">GHS {remainingBalance.toFixed(2)}</span></h6>
                    
                    <div className="mb-3">
                      <label className="form-label">Payment Type</label>
                      <div>
                        <div className="form-check">
                          <input 
                            className="form-check-input" 
                            type="radio" 
                            name="paymentType" 
                            id="fullPayment"
                            value="full"
                            checked={paymentType === 'full'}
                            onChange={(e) => setPaymentType(e.target.value)}
                          />
                          <label className="form-check-label" htmlFor="fullPayment">
                            💰 Full Payment (GHS {remainingBalance.toFixed(2)})
                          </label>
                        </div>
                        <div className="form-check">
                          <input 
                            className="form-check-input" 
                            type="radio" 
                            name="paymentType" 
                            id="partialPayment"
                            value="partial"
                            checked={paymentType === 'partial'}
                            onChange={(e) => setPaymentType(e.target.value)}
                          />
                          <label className="form-check-label" htmlFor="partialPayment">
                            💸 Partial Payment
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    {paymentType === 'partial' && (
                      <div className="mb-3">
                        <label className="form-label">Payment Amount (GHS)</label>
                        <input 
                          type="number" 
                          className="form-control" 
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          placeholder="Enter amount"
                          min="0.01"
                          max={remainingBalance}
                          step="0.01"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Mobile Money Provider</label>
                      <select 
                        className="form-select" 
                        value={selectedProvider}
                        onChange={(e) => setSelectedProvider(e.target.value)}
                      >
                        <option value="mtn">📱 MTN Mobile Money</option>
                        <option value="hubtel">💳 Hubtel</option>
                        <option value="airtel">📞 AirtelTigo Money</option>
                      </select>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Mobile Number</label>
                      <input 
                        type="tel" 
                        className="form-control" 
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="e.g., 0241234567"
                        maxLength="10"
                      />
                    </div>
                  </div>
                </div>
                
                {paymentHistory.length > 0 && (
                  <div className="mt-4">
                    <h6>📋 Payment History</h6>
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Provider</th>
                            <th>Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paymentHistory.map(payment => (
                            <tr key={payment.id}>
                              <td>{payment.date}</td>
                              <td>GHS {payment.amount.toFixed(2)}</td>
                              <td>{payment.provider}</td>
                              <td>
                                <span className={`badge ${payment.type === 'full' ? 'bg-success' : 'bg-warning'}`}>
                                  {payment.type === 'full' ? 'Full' : 'Partial'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowPaymentModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-success" 
                  onClick={handlePaymentSubmit}
                >
                  🚀 Process Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanApplication;