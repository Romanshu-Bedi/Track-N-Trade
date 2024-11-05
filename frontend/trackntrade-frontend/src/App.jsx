import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import Header from './custom/Header';
import LandingPage from './LandingPage';
import SignInPage from './auth/sign-in/index';
import Dashboard from './dashboard';
import AddItemForm from './AddItemForm'; // Import the Add Item form component

function App() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={isSignedIn ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route path="/auth/sign-in" element={<SignInPage />} />
        <Route path="/dashboard" element={isSignedIn ? <Dashboard /> : <Navigate to="/auth/sign-in" />} />
        <Route path="/add-item" element={isSignedIn ? <AddItemForm /> : <Navigate to="/auth/sign-in" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
