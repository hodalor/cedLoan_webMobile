import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';

const VerifyOTP: React.FC = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const phoneNumber = localStorage.getItem('registrationPhone') || '';

  // Handle OTP input change
  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow one character
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle key press for backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Resend OTP
  const handleResendOTP = async () => {
    if (timer === 0) {
      setIsResending(true);
      try {
        await authAPI.sendOTP(phoneNumber);
        setTimer(60);
      } catch (error) {
        console.error('Error resending OTP:', error);
        alert('Failed to resend OTP. Please try again.');
      } finally {
        setIsResending(false);
      }
    }
  };

  // Verify OTP
  const handleVerify = async () => {
    const enteredOTP = otp.join('');
    if (enteredOTP.length === 4) {
      try {
        const response = await authAPI.verifyOTP(phoneNumber, enteredOTP);
        if (response.success) {
          navigate('/register/set-pin');
        } else {
          alert('Invalid OTP. Please try again.');
        }
      } catch (error) {
        console.error('Error verifying OTP:', error);
        alert('Failed to verify OTP. Please try again.');
      }
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>Verify Phone Number</h1>
      </div>

      <div className="mt-4">
        <p className="text-center">
          We've sent a verification code to <br />
          <strong>+{phoneNumber}</strong>
        </p>

        <div className="pin-container mt-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              className="pin-input"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              maxLength={1}
              autoFocus={index === 0}
            />
          ))}
        </div>

        <div className="mt-6 text-center">
          {timer > 0 ? (
            <p>Resend code in {timer} seconds</p>
          ) : (
            <button
              onClick={handleResendOTP}
              disabled={isResending}
              className="text-blue-600"
            >
              {isResending ? 'Sending...' : 'Resend Code'}
            </button>
          )}
        </div>

        <button
          onClick={handleVerify}
          disabled={otp.some(digit => !digit)}
          className="btn-primary mt-8"
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default VerifyOTP;