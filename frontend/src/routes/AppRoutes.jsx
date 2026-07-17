import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Dashboard from '../pages/Dashboard/Dashboard';
import AssessmentPage from '../pages/Assessment/AssessmentPage';
import ResultsPage from '../pages/Results/ResultsPage';
import ProfilePage from '../pages/Profile/ProfilePage';
import VerifyPage from '../pages/Results/VerifyPage';
import Loader from '../components/Common/Loader';

// Route wrapper for authenticated users
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <Loader message="Verifying session credentials..." fullScreen />;
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
};

// Route wrapper for guest users (Login/Register)
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <Loader message="Verifying session credentials..." fullScreen />;
  if (user) return <Navigate to="/dashboard" replace />;
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Guest Routing */}
      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        }
      />

      {/* Public Certification Verification Router */}
      <Route path="/verify/:hash" element={<VerifyPage />} />

      {/* Protected Routing */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assessment"
        element={
          <ProtectedRoute>
            <AssessmentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/results/:id"
        element={
          <ProtectedRoute>
            <ResultsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Fallback Navigates */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
