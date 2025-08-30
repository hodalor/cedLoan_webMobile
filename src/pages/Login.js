import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const Login = () => {
  const [phone, setPhone] = useState('0244123456');
  const [pin, setPin] = useState('1234');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!phone || !pin) {
      setError('Please enter both phone number and PIN');
      return;
    }

    setLoading(true);
    
    try {
      const credentials = {
        phone,
        pin
      };
      await login(credentials);
      showToast('Login successful!', 'success');
      navigate('/home');
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
      showToast(error.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cedi-gradient min-vh-100">
      <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100 p-3">
        <div className="row w-100 justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-12 col-xl-12">
            <div className="card cedi-shadow border-0 rounded-4">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div 
                    className="cedi-gradient-gold d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{ 
                      width: '64px', 
                      height: '64px', 
                      borderRadius: '16px' 
                    }}
                  >
                    <span className="text-white fw-bold fs-4">CEDI</span>
                  </div>
                  <h1 className="cedi-text-dark fw-bold mb-2" style={{ fontSize: '2rem' }}>Welcome Back</h1>
                  <p className="text-muted">Sign in to your CEDI account</p>
                </div>

                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label fw-medium text-dark">
                      Phone Number
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-telephone"></i>
                      </span>
                      <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                        required
                        className="form-control cedi-border border-start-0"
                        style={{ 
                          padding: '12px 16px',
                          borderRadius: '0 12px 12px 0',
                          backgroundColor: '#f8f9fa',
                          border: '1px solid #dee2e6'
                        }}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="pin" className="form-label fw-medium text-dark">
                      PIN
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-lock"></i>
                      </span>
                      <input
                        type="password"
                        id="pin"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="Enter your 4-digit PIN"
                        maxLength="4"
                        required
                        className="form-control cedi-border border-start-0"
                        style={{ 
                          padding: '12px 16px',
                          borderRadius: '0 12px 12px 0',
                          backgroundColor: '#f8f9fa',
                          border: '1px solid #dee2e6'
                        }}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="alert alert-danger text-center py-2">
                      <i className="bi bi-exclamation-circle me-2"></i>
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn w-100 cedi-btn fw-semibold"
                    style={{ 
                      padding: '12px',
                      borderRadius: '12px',
                      fontSize: '1rem'
                    }}
                  >
                    {loading ? (
                      <>
                        <i className="bi bi-arrow-clockwise spin me-2"></i>
                        Signing In...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Sign In
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <p className="text-muted mb-2">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/register')}
                      className="btn btn-link cedi-text-blue fw-semibold p-0 text-decoration-none"
                    >
                      Sign Up
                    </button>
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-pin')}
                    className="btn btn-link text-muted p-0 text-decoration-none"
                    style={{ fontSize: '0.875rem' }}
                  >
                    Forgot PIN?
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;