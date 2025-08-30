import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { loansAPI, usersAPI } from '../../services/api';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userStats, setUserStats] = useState({
    availableCredit: 0,
    loansCompleted: 0,
    creditScore: 750
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userProfile, userLoans] = await Promise.all([
           usersAPI.getProfile(),
           loansAPI.getUserLoans()
         ]);
        
        const completedLoans = userLoans.filter(loan => loan.status === 'completed').length;
        const availableCredit = userProfile.creditLimit || 5000;
        
        setUserStats({
          availableCredit,
          loansCompleted: completedLoans,
          creditScore: userProfile.creditScore || 750
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body text-center">
              <h2 className="card-title mb-4">Welcome{user?.firstName ? `, ${user.firstName}` : ''}</h2>
              <p className="card-text mb-4">
                Your trusted partner for quick and easy loans
              </p>
              
              <div className="row g-3">
                <div className="col-6">
                  <div className="card bg-primary text-white h-100">
                    <div className="card-body d-flex flex-column justify-content-center">
                      <h5 className="card-title">Apply for Loan</h5>
                      <p className="card-text">Get instant loans up to GHS 5,000</p>
                      <button 
                        className="btn btn-light btn-sm mt-auto"
                        onClick={() => navigate('/loan-application')}
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="col-6">
                  <div className="card bg-success text-white h-100">
                    <div className="card-body d-flex flex-column justify-content-center">
                      <h5 className="card-title">Loan History</h5>
                      <p className="card-text">View your loan transactions</p>
                      <button 
                        className="btn btn-light btn-sm mt-auto"
                        onClick={() => navigate('/history')}
                      >
                        View History
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="card bg-light">
                  <div className="card-body">
                    <h6 className="card-title">Quick Stats</h6>
                    <div className="row text-center">
                      <div className="col-4">
                        <div className="fw-bold text-primary">
                          {loading ? '...' : `GHS ${userStats.availableCredit.toLocaleString()}`}
                        </div>
                        <small className="text-muted">Available Credit</small>
                      </div>
                      <div className="col-4">
                        <div className="fw-bold text-success">
                          {loading ? '...' : userStats.loansCompleted}
                        </div>
                        <small className="text-muted">Loans Completed</small>
                      </div>
                      <div className="col-4">
                        <div className="fw-bold text-info">
                          {loading ? '...' : userStats.creditScore}
                        </div>
                        <small className="text-muted">Credit Score</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;