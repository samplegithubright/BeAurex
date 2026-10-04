import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/AdminLogin';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOtp from './pages/VerifyOtp';
import SetNewPassword from './pages/SetNewPassword';
import MerchantDashboard from './pages/MerchantDashboard';
import CustomerExperience from './pages/CustomerExperience';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import TeamManagement from './pages/TeamManagement';
import TeamAuthGate from './components/TeamAuthGate';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          {/* Super Admin Control Center & Team */}
          <Route path="/admin" element={<SuperAdminDashboard />} />
          <Route 
            path="/team" 
            element={
              <TeamAuthGate>
                <TeamManagement />
              </TeamAuthGate>
            } 
          />

          {/* Admin & Merchant Auth Wireframe Screens */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/merchant/login" element={<AdminLogin />} />
          <Route path="/admin/forgot-password" element={<ForgotPassword />} />
          <Route path="/merchant/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin/verify-otp" element={<VerifyOtp />} />
          <Route path="/merchant/verify-otp" element={<VerifyOtp />} />
          <Route path="/admin/set-password" element={<SetNewPassword />} />
          <Route path="/merchant/set-password" element={<SetNewPassword />} />
          
          {/* Merchant & Customer Portals */}
          <Route path="/merchant" element={<Navigate to="/merchant/dashboard" replace />} />
          <Route path="/merchant/dashboard" element={<MerchantDashboard />} />
          <Route path="/dashboard" element={<Navigate to="/merchant/dashboard" replace />} />
          <Route path="/customer" element={<CustomerExperience />} />
          <Route path="/scan/:slug" element={<CustomerExperience />} />

          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
