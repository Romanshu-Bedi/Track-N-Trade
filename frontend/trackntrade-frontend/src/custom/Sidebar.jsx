// Sidebar.jsx
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Sidebar.css';

export default function Sidebar({ isSidebarOpen }) {
  if (!isSidebarOpen) return null; // Don't render if sidebar is closed

  return (
    <div className="sidebar fixed top-0 left-0 h-full w-64 bg-gray-800 text-white z-50">
      <div className="p-4 text-2xl font-bold">Track-N-Trade</div>
      <nav className="mt-6">
        <ul className="space-y-4">
          <li>
            <Link to="/dashboard" className="flex items-center p-2 hover:bg-gray-700 rounded-md">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/add-item" className="flex items-center p-2 hover:bg-gray-700 rounded-md">
              Inventory
            </Link>
          </li>
          <li>
            <Link to="/add-sale" className="flex items-center p-2 hover:bg-gray-700 rounded-md">
              Sales
            </Link>
          </li>
          <li>
            <Link to="/balance-sheet" className="flex items-center p-2 hover:bg-gray-700 rounded-md">
              Reports
            </Link>
          </li>
          <li>
            <Link to="/profile" className="flex items-center p-2 hover:bg-gray-700 rounded-md">
              Profile
            </Link>
          </li>
          <li>
            <Link to="/logout" className="flex items-center p-2 hover:bg-gray-700 rounded-md">
              Logout
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

Sidebar.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
};
