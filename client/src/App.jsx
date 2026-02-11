import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddEmployee from './pages/AddEmployee';
import PayslipView from './pages/PayslipView';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

import { ThemeProvider, useTheme } from './context/ThemeContext';

const AppContent = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 1000 }}>
        <button onClick={toggleTheme} className="btn" style={{ borderRadius: '50%', width: '3rem', height: '3rem', padding: 0, fontSize: '1.2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/add-employee" element={<PrivateRoute><AddEmployee /></PrivateRoute>} />
          <Route path="/payslip" element={<PrivateRoute><PayslipView /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
