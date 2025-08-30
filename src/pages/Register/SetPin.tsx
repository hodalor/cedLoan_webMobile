import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SetPin: React.FC = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const phoneNumber = localStorage.getItem('registrationPhone') || '';

  // Handle PIN input change
  const handlePinChange = (index: number, value: string, isPinConfirm: boolean) => {
    if (value.length > 1) return; // Only allow one character
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newPin = isPinConfirm ? [...confirmPin] : [...pin];
    newPin[index] = value;
    
    if (isPinConfirm) {
      setConfirmPin(newPin);
    } else {
      setPin(newPin);
    }

    // Auto-focus next input
    if (value && index < 3) {
      const nextInputId = isPinConfirm ? `confirm-pin-${index + 1}` : `pin-${index + 1}`;
      const nextInput = document.getElementById(nextInputId);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle key press for backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent, isPinConfirm: boolean) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInputId = isPinConfirm ? `confirm-pin-${index - 1}` : `pin-${index - 1}`;
      const prevInput = document.getElementById(prevInputId);
      if (prevInput) prevInput.focus();
    }
  };

  // Save PIN and continue
  const handleSavePin = () => {
    const enteredPin = pin.join('');
    const enteredConfirmPin = confirmPin.join('');

    if (enteredPin !== enteredConfirmPin) {
      setError('PINs do not match. Please try again.');
      return;
    }

    if (enteredPin.length !== 4) {
      setError('PIN must be 4 digits.');
      return;
    }

    // Store PIN in localStorage (in a real app, this would be securely stored)
    localStorage.setItem('userPin', enteredPin);
    
    // Navigate to next step
    navigate('/register/personal-info');
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>Set PIN</h1>
        <p>Please create a PIN for +{phoneNumber}</p>
      </div>

      {error && <div className="text-red-500 text-center mt-4">{error}</div>}

      <div className="mt-4">
        <p className="text-center mb-2">Enter 4 Digital PIN Code</p>
        <div className="pin-container">
          {pin.map((digit, index) => (
            <input
              key={index}
              id={`pin-${index}`}
              type="password"
              className="pin-input"
              value={digit}
              onChange={(e) => handlePinChange(index, e.target.value, false)}
              onKeyDown={(e) => handleKeyDown(index, e, false)}
              maxLength={1}
              autoFocus={index === 0}
            />
          ))}
        </div>

        <p className="text-center mb-2 mt-6">Re-enter The 4-digit PIN Code</p>
        <div className="pin-container">
          {confirmPin.map((digit, index) => (
            <input
              key={index}
              id={`confirm-pin-${index}`}
              type="password"
              className="pin-input"
              value={digit}
              onChange={(e) => handlePinChange(index, e.target.value, true)}
              onKeyDown={(e) => handleKeyDown(index, e, true)}
              maxLength={1}
            />
          ))}
        </div>

        <button
          onClick={handleSavePin}
          className="btn-primary mt-8"
          disabled={pin.some(digit => !digit) || confirmPin.some(digit => !digit)}
        >
          Save and Continue
        </button>
      </div>
    </div>
  );
};

export default SetPin;