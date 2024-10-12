import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'; // External CSS for styling

const LandingPage = () => {
  const navigate = useNavigate();

  // Navigate to the sign-in page (Login/Signup)
  const handleGetStarted = () => {
    navigate('/auth/sign-in');
  };

  return (
    <div className="landing-page">
      {/* Header Section */}
      <header className="landing-header">
        <div className="logo">
          <h2>TrackNTrade</h2> {/* Replace with a logo image if available */}
        </div>
        <button className="get-started-button" onClick={handleGetStarted}>
          Get Started
        </button>
      </header>

      {/* Main Section */}
      <section className="main-section">
        <h1>Manage Your Inventory, Sales, and Reports with Ease</h1>
        <p>Simplify business operations and reduce the workload of a Chartered Accountant.</p>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How It Works?</h2>
        <div className="features">
          <div className="feature-card">
            <h3>Inventory Management</h3>
            <p>Keep track of stock levels and inventory turnover in real-time.</p>
          </div>
          <div className="feature-card">
            <h3>Sales Tracking</h3>
            <p>Monitor your sales performance with real-time insights.</p>
          </div>
          <div className="feature-card">
            <h3>Automated Reports</h3>
            <p>Generate balance sheets, income statements, and sales reports automatically.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;