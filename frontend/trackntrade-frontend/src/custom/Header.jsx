// Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';

function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-blue-600 text-white">
      <div className="text-lg font-bold">
        <Link to="/">TracknTrade</Link>
      </div>
      <nav className="flex items-center space-x-4">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/profile">Profile</Link>
        <UserButton />
      </nav>
    </header>
  );
}

export default Header;
