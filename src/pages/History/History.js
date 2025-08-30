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
    <div className="history-container">
      <div className="page-header">
        <button 
          className="back-button"
          onClick={() => navigate('/')}
        >
          ← Back
        </button>
        <h1>Transaction History</h1>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <p>Loading transactions...</p>
        </div>
      ) : transactions.length > 0 ? (
        <div className="transactions-list">
          {transactions.map(transaction => (
            <div key={transaction.id} className="transaction-card">
              <div className="transaction-header">
                <div className={`transaction-type ${transaction.type}`}>
                  {transaction.type === 'loan' ? '💰 Loan' : '💸 Repayment'}
                </div>
                <div className={`transaction-status status-${transaction.status}`}>
                  {transaction.status.toUpperCase()}
                </div>
              </div>
              
              <div className="transaction-details">
                <div className="transaction-amount">
                  <span className="amount">
                    {transaction.type === 'repayment' ? '-' : '+'} {transaction.currency} {transaction.amount.toFixed(2)}
                  </span>
                </div>
                
                <div className="transaction-info">
                  <p className="transaction-description">{transaction.description}</p>
                  <p className="transaction-date">{formatDate(transaction.date)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No transaction history found.</p>
          <button 
            className="btn-primary"
            onClick={() => navigate('/loan-application')}
          >
            Apply for a Loan
          </button>
        </div>
      )}
    </div>
  );
};

export default History;