// Layout.jsx
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function Layout({ isSidebarOpen }) {
  return (
    <div className="flex">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      {/* Adjust main content margin-left when sidebar is open */}
      <div className={`flex-1 ${isSidebarOpen ? 'ml-64' : ''} p-6 bg-gray-100 min-h-screen`}>
        <Outlet />
      </div>
    </div>
  );
}

Layout.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
};
