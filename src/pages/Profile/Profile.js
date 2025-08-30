import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockUser = {
        id: 'U12345',
        name: 'Prince H',
        email: 'prince@quickmul.com',
        phone: '+233 50 123 4567',
        idVerified: true,
        accountCreated: new Date(2023, 5, 10),
        creditScore: 750
      };
      setUser(mockUser);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleLogout = () => {
    // In a real app, this would clear authentication tokens
    navigate('/login');
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
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Manage your account information</p>
      </div>

      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading profile...</p>
        </div>
      ) : user ? (
        <div className="row">
          <div className="col-12">
            <div className="card custom-card mb-4">
              <div className="card-body">
                <div className="d-flex align-items-center mb-4">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '80px', height: '80px', fontSize: '2rem', fontWeight: 'bold'}}>
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="card-title mb-1">{user.name}</h2>
                    <p className="text-muted mb-0">ID: {user.id}</p>
                  </div>
                </div>
                
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded">
                      <h6 className="text-muted mb-1">Email</h6>
                      <p className="mb-0 fw-medium">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded">
                      <h6 className="text-muted mb-1">Phone</h6>
                      <p className="mb-0 fw-medium">{user.phone}</p>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded">
                      <h6 className="text-muted mb-1">ID Verification</h6>
                      <span className={`status-badge ${user.idVerified ? 'status-completed' : 'status-pending'}`}>
                        {user.idVerified ? 'Verified ✓' : 'Not Verified ✗'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded">
                      <h6 className="text-muted mb-1">Account Created</h6>
                      <p className="mb-0 fw-medium">
                        {user.accountCreated.toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="col-12">
                    <div className="p-3 bg-light rounded">
                      <h6 className="text-muted mb-2">Credit Score</h6>
                      <div className="d-flex align-items-center">
                        <div className="progress flex-grow-1 me-3" style={{height: '10px'}}>
                          <div 
                            className="progress-bar bg-success" 
                            role="progressbar" 
                            style={{ width: `${(user.creditScore / 1000) * 100}%` }}
                            aria-valuenow={user.creditScore}
                            aria-valuemin="0"
                            aria-valuemax="1000"
                          ></div>
                        </div>
                        <span className="fw-bold text-success fs-5">{user.creditScore}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="row g-3 page-bottom-actions">
              <div className="col-md-4">
                <button className="btn btn-outline-primary btn-custom w-100" onClick={() => navigate('/edit-profile')}>
                  ✏️ Edit Profile
                </button>
              </div>
              <div className="col-md-4">
                <button className="btn btn-outline-secondary btn-custom w-100" onClick={() => navigate('/change-password')}>
                  🔒 Change Password
                </button>
              </div>
              <div className="col-md-4">
                <button className="btn btn-outline-danger btn-custom w-100" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-5">
          <div className="card custom-card">
            <div className="card-body">
              <div className="mb-4">
                <div className="display-1 text-muted">⚠️</div>
              </div>
              <h4 className="card-title text-muted">Profile Load Error</h4>
              <p className="card-text text-muted mb-4">Could not load profile information. Please try again.</p>
              <button 
                className="btn btn-primary btn-lg btn-custom"
                onClick={() => window.location.reload()}
              >
                🔄 Retry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;