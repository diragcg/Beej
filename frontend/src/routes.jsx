// Routes configuration for the Beej application

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';

// Lazy-loaded pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const SeedInspection = lazy(() => import('./pages/SeedInspection'));
const SeedSamples = lazy(() => import('./pages/SeedSamples'));
const Reports = lazy(() => import('./pages/Reports'));

// Loading component
const LoadingFallback = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">लोड हो रहा है...</span>
    </div>
    <span className="ms-2">लोड हो रहा है...</span>
  </div>
);

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  // In a real app, you would check if the user is authenticated
  const isAuthenticated = true; // This would be determined by checking auth state
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        
        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="seed-inspection" element={<SeedInspection />} />
          <Route path="seed-samples" element={<SeedSamples />} />
          <Route path="reports" element={<Reports />} />
        </Route>
        
        {/* 404 route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
