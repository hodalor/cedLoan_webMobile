import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaHistory, FaUser } from 'react-icons/fa';

const BottomNavigation: React.FC = () => {
  return (
    <nav className="bottom-nav">
      <NavLink 
        to="/home" 
        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
      >
        <FaHome size={24} />
        <span>Home</span>
      </NavLink>
      <NavLink 
        to="/history" 
        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
      >
        <FaHistory size={24} />
        <span>History</span>
      </NavLink>
      <NavLink 
        to="/profile" 
        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
      >
        <FaUser size={24} />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};

export default BottomNavigation;