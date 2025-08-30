import React, { useState, useEffect } from 'react';
import { FaExclamationCircle, FaCheckCircle, FaHourglassHalf, FaUndoAlt } from 'react-icons/fa';

interface LoanRecord {
  id: string;
  status: 'under_review' | 'rejected' | 'reverted' | 'approved';
  amount: number;
  period: number;
  dueDate?: string;
  amountOwed?: number;
  appliedAt: string;
}

const History: React.FC = () => {
  const [loanHistory, setLoanHistory] = useState<LoanRecord[]>([]);

  useEffect(() => {
    // Get loan history from localStorage (in a real app, this would come from an API)
    const storedHistory = localStorage.getItem('loanHistory');
    if (storedHistory) {
      setLoanHistory(JSON.parse(storedHistory));
    }
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'under_review':
        return <FaHourglassHalf className="text-yellow-500" />;
      case 'rejected':
        return <FaExclamationCircle className="text-red-500" />;
      case 'reverted':
        return <FaUndoAlt className="text-orange-500" />;
      case 'approved':
        return <FaCheckCircle className="text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'under_review':
        return 'Under Review';
      case 'rejected':
        return 'Rejected';
      case 'reverted':
        return 'Reverted';
      case 'approved':
        return 'Approved';
      default:
        return status;
    }
  };

  return (
    <div className="page-container">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-2">Loan History</h1>
        <p className="text-gray-600 mb-6">View all your past loan applications</p>

        {loanHistory.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">No Loan History</h2>
            <p className="text-gray-600">You haven't applied for any loans yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {loanHistory.map((loan) => (
              <div key={loan.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {getStatusIcon(loan.status)}
                    <span className="ml-2 font-medium">{getStatusText(loan.status)}</span>
                  </div>
                  <span className="text-sm text-gray-500">{formatDate(loan.appliedAt)}</span>
                </div>
                
                <div className="border-t border-gray-100 pt-2 mt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-600">Loan Amount:</div>
                    <div className="text-right font-medium">{formatCurrency(loan.amount)}</div>
                    
                    <div className="text-gray-600">Period:</div>
                    <div className="text-right">{loan.period} {loan.period === 1 ? 'month' : 'months'}</div>
                    
                    {loan.status === 'approved' && loan.amountOwed && (
                      <>
                        <div className="text-gray-600">Amount to Repay:</div>
                        <div className="text-right font-medium">{formatCurrency(loan.amountOwed)}</div>
                        
                        <div className="text-gray-600">Due Date:</div>
                        <div className="text-right">{loan.dueDate ? formatDate(loan.dueDate) : 'N/A'}</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;