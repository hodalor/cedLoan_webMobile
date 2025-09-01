import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import pages - Login and Registration
import Login from './pages/Login';
import Register from './pages/Register/Register';
import SetPin from './pages/Register/SetPin';
import VerifyOTP from './pages/Register/VerifyOTP';
import PersonalInfo from './pages/Register/PersonalInfo';
import WorkInfo from './pages/Register/WorkInfo';
import EducationInfo from './pages/Register/EducationInfo';
import EmergencyContacts from './pages/Register/EmergencyContacts';
import IdVerification from './pages/Register/IdVerification';

// Import main app pages
import Home from './pages/Home/Home';
import LoanApplication from './pages/LoanApplication/LoanApplication';
import History from './pages/History/History';
import Profile from './pages/Profile/Profile';

// Components
import BottomNavigation from './components/BottomNavigation';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/verify-otp" element={<VerifyOTP />} />
          <Route path="/register/set-pin" element={<SetPin />} />
          <Route path="/register/personal-info" element={<PersonalInfo />} />
          <Route path="/register/work-info" element={<WorkInfo />} />
          <Route path="/register/education-info" element={<EducationInfo />} />
          <Route path="/register/emergency-contacts" element={<EmergencyContacts />} />
          <Route path="/register/id-verification" element={<IdVerification />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/loan-application"
            element={
              <ProtectedRoute>
                <LoanApplication />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
        
        {/* Bottom Navigation for Protected Routes */}
        <Routes>
          <Route
            path="/(home|apply|history|profile)"
            element={<BottomNavigation />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
