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
        name: 'John Doe',
        email: 'john.doe@example.com',
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
    <div className="profile-container">
      <div className="page-header">
        <button 
          className="back-button"
          onClick={() => navigate('/')}
        >
          ← Back
        </button>
        <h1>My Profile</h1>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <p>Loading profile...</p>
        </div>
      ) : user ? (
        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                {user.name.charAt(0)}
              </div>
              <div className="profile-name">
                <h2>{user.name}</h2>
                <p className="profile-id">ID: {user.id}</p>
              </div>
            </div>
            
            <div className="profile-details">
              <div className="detail-item">
                <span className="detail-label">Email</span>
                <span className="detail-value">{user.email}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Phone</span>
                <span className="detail-value">{user.phone}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">ID Verification</span>
                <span className={`detail-value verification-status ${user.idVerified ? 'verified' : 'unverified'}`}>
                  {user.idVerified ? 'Verified ✓' : 'Not Verified ✗'}
                </span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Account Created</span>
                <span className="detail-value">
                  {user.accountCreated.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Credit Score</span>
                <div className="credit-score">
                  <div className="score-bar">
                    <div 
                      className="score-fill" 
                      style={{ width: `${(user.creditScore / 1000) * 100}%` }}
                    ></div>
                  </div>
                  <span className="score-value">{user.creditScore}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="profile-actions">
            <button className="btn-secondary" onClick={() => navigate('/edit-profile')}>
              Edit Profile
            </button>
            <button className="btn-secondary" onClick={() => navigate('/change-password')}>
              Change Password
            </button>
            <button className="btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="error-state">
          <p>Could not load profile information.</p>
          <button 
            className="btn-primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;