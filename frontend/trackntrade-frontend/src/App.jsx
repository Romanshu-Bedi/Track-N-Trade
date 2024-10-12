import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import Header from './custom/Header';
import LandingPage from './LandingPage'; // Import your landing page
import SignInPage from './auth/sign-in/index';

function App() {
  const { isLoaded, isSignedIn } = useUser();

  // If Clerk is not yet loaded, show a loading message
  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <Router>
      <Header />
      <Routes>
        {/* Route for the home/landing page */}
        <Route 
          path="/" 
          element={isSignedIn ? <Navigate to="/dashboard" /> : <LandingPage />} 
        />

        {/* Route for the sign-in page */}
        <Route path="/auth/sign-in" element={<SignInPage />} />

        {/* Protected route - Only accessible if the user is signed in */}
        <Route 
          path="/dashboard" 
          element={isSignedIn ? <h1>Welcome to the Dashboard!</h1> : <Navigate to="/auth/sign-in" />} 
        />

        {/* Catch-all route for non-existent paths */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;