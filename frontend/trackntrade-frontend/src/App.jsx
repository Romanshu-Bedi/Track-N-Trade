import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import Header from './custom/Header';
import LandingPage from './LandingPage';
import SignInPage from './auth/sign-in/index';
import Dashboard from './dashboard';
import AddItemForm from './AddItemForm';
import AddSaleForm from './AddSaleForm';

function App() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      if (user) {
        const clerkId = user.id;
        try {
          const response = await fetch(`http://localhost:3001/api/user-id?clerk_id=${clerkId}`);
          const data = await response.json();
          if (response.ok) {
            setUserId(data.user_id);
          } else {
            console.error('Error fetching user_id:', data.error);
          }
        } catch (error) {
          console.error('Error fetching user_id:', error);
        }
      }
    };
    fetchUserId();
  }, [user]);

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
        <Route path="/add-item" element={isSignedIn && userId ? <AddItemForm userId={userId} /> : <Navigate to="/auth/sign-in" />} />
        <Route path="/add-sale" element={isSignedIn && userId ? <AddSaleForm userId={userId} /> : <Navigate to="/auth/sign-in" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
