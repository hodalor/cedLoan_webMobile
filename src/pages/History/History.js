import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockTransactions = [
        {
          id: 'T12345',
          type: 'loan',
          amount: 2000,
          currency: 'GHS',
          status: 'completed',
          date: new Date(2023, 6, 15),
          description: 'Loan disbursement'
        },
        {
          id: 'T12346',
          type: 'repayment',
          amount: 2100,
          currency: 'GHS',
          status: 'completed',
          date: new Date(2023, 6, 29),
          description: 'Loan repayment'
        },
        {
          id: 'T12347',
          type: 'loan',
          amount: 3000,
          currency: 'GHS',
          status: 'active',
          date: new Date(2023, 7, 10),
          description: 'Loan disbursement'
        }
      ];
      setTransactions(mockTransactions);
      setIsLoading(false);
    }, 1000);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
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
        <h1 className="page-title">Transaction History</h1>
        <p className="page-subtitle">View all your loan transactions</p>
      </div>

      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading transactions...</p>
        </div>
      ) : transactions.length > 0 ? (
        <div className="row">
          {transactions.map(transaction => (
            <div key={transaction.id} className="col-12 mb-3">
              <div className="card custom-card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        {transaction.type === 'loan' ? (
                          <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                            💰
                          </div>
                        ) : (
                          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                            💸
                          </div>
                        )}
                      </div>
                      <div>
                        <h6 className="card-title mb-1">
                          {transaction.type === 'loan' ? 'Loan' : 'Repayment'}
                        </h6>
                        <span className={`status-badge status-${transaction.status}`}>
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-end">
                      <div className={`fs-5 fw-bold ${transaction.type === 'loan' ? 'text-success' : 'text-primary'}`}>
                        {transaction.type === 'repayment' ? '-' : '+'} {transaction.currency} {transaction.amount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-8">
                      <p className="card-text text-muted mb-1">{transaction.description}</p>
                    </div>
                    <div className="col-4 text-end">
                      <small className="text-muted">{formatDate(transaction.date)}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <div className="card custom-card">
            <div className="card-body">
              <div className="mb-4">
                <div className="display-1 text-muted">📜</div>
              </div>
              <h4 className="card-title text-muted">No Transaction History</h4>
              <p className="card-text text-muted mb-4">You haven't made any transactions yet. Start by applying for your first loan!</p>
              <button 
                className="btn btn-primary btn-lg btn-custom"
                onClick={() => navigate('/loan-application')}
              >
                🚀 Apply for a Loan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;