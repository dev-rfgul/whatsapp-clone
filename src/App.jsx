import React from 'react';
import { Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './Components/AuthPage';
import Login from './Components/Login';
import Home from './Components/Home';
import { auth } from './Components/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const App = () => {
  const [user] = useAuthState(auth);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/login" element={<Login />} />
        App.js
        <Route
          path="/home"
          element={user ? <Home /> : <Navigate to="/home" />}
        />

      </Routes>
    </Router>
  );
};

export default App;
