import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!phone) {
      setError('Please enter your phone number');
      return;
    }

    if (phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('registrationPhone', phone);
      navigate('/verify-otp');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cedi-blue to-cedi-dark flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-cedi p-8 w-full max-w-md border border-cedi-light">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-cedi-blue to-cedi-gold rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-bold text-xl">CEDI</span>
          </div>
          <h1 className="text-3xl font-bold text-cedi-dark mb-2">Create Account</h1>
          <p className="text-gray-600">Join CEDI and start your loan journey</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cedi-blue focus:border-cedi-blue transition-all duration-200 bg-gray-50 focus:bg-white"
              placeholder="Enter your phone number"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              We'll send you a verification code
            </p>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cedi-blue to-cedi-dark text-white py-3 rounded-xl font-semibold hover:from-cedi-dark hover:to-cedi-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            {loading ? 'Sending Code...' : 'Continue'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-cedi-blue hover:text-cedi-dark font-semibold transition-colors duration-200"
            >
              Sign In
            </button>
          </p>
        </div>

        <div className="mt-6 text-xs text-gray-500 text-center">
          By continuing, you agree to our{' '}
          <a href="#" className="text-cedi-blue hover:underline transition-colors duration-200">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-cedi-blue hover:underline transition-colors duration-200">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;