import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CityProvider } from './context/CityContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import WeatherPage from './pages/WeatherPage';
import AQIPage from './pages/AQIPage';
import TrafficPage from './pages/TrafficPage';
import NewsPage from './pages/NewsPage';
import AlertsPage from './pages/AlertsPage';
import CityInfoPage from './pages/CityInfoPage';
import MapPage from './pages/MapPage';
import ComplaintsPage from './pages/ComplaintsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import PaymentPage from './pages/PaymentPage';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="loading-overlay" style={{ minHeight: '100vh' }}>
      <div className="loading-spinner" style={{ width: 32, height: 32 }} />
      <span className="loading-text">Loading Digital Twin...</span>
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? children : <Navigate to="/dashboard" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="weather" element={<WeatherPage />} />
        <Route path="aqi" element={<AQIPage />} />
        <Route path="traffic" element={<TrafficPage />} />
        <Route path="news" element={<NewsPage />} />
        <Route path="alerts" element={<AlertsPage />} />
        <Route path="city-info" element={<CityInfoPage />} />
        <Route path="map" element={<MapPage />} />
        <Route path="complaints" element={<ComplaintsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="payment" element={<PaymentPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CityProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#0d1f3c',
                color: '#f0f6ff',
                border: '1px solid rgba(0, 212, 255, 0.2)',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#22c55e', secondary: '#0d1f3c' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#0d1f3c' } },
            }}
          />
        </CityProvider>
      </AuthProvider>
    </Router>
  );
}
