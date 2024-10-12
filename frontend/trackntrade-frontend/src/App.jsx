// App.jsx
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import Header from './custom/Header';
import SignInPage from './auth/sign-in/index';

function App() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <Router>
      <Header />
      <Routes>
        {/* Route for the home page */}
        <Route path="/" element={isSignedIn ? <h1>Home Page</h1> : <Navigate to="/auth/sign-in" />} />
        {/* Route for the sign-in page */}
        <Route path="/auth/sign-in" element={<SignInPage />} />
        {/* Catch-all route for non-existent paths */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
