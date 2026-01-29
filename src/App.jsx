import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AIProvider } from './context/AIContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProductivityProvider } from './context/ProductivityContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import SocialHub from './pages/SocialHub';
import MediaHub from './pages/MediaHub';
import DesignHub from './pages/DesignHub';
import TechHub from './pages/TechHub';
import ContentHub from './pages/ContentHub';
import HRHub from './pages/HRHub';
import OperationsHub from './pages/OperationsHub';
import FinanceHub from './pages/FinanceHub';
import InvoicesHub from './pages/InvoicesHub';
import ProposalsHub from './pages/ProposalsHub';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, profile, loading, companies } = useAuth();
  const location = useLocation();
  
  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  
  if (!user) {
    return <Navigate to="/landing" replace />;
  }

  // If user has no companies and is not on onboarding page, send them there
  if (companies.length === 0 && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  if (allowedRoles && profile?.role) {
    if (profile.role !== 'admin' && !allowedRoles.includes(profile.role)) {
       return <Navigate to="/" replace />;
    }
  }

  return <Layout />;
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AIProvider>
          <ProductivityProvider>
            <Router>
              <Routes>
                <Route path="/landing" element={<LandingPage />} />
                
                {/* Onboarding Route - Protected but separate from layout logic */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/onboarding" element={<Onboarding />} />
                </Route>
                
                {/* Protected Routes with Layout */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/social" element={<SocialHub />} />
                  <Route path="/media" element={<MediaHub />} />
                  <Route path="/design" element={<DesignHub />} />
                  <Route path="/tech" element={<TechHub />} />
                  <Route path="/content" element={<ContentHub />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['admin', 'hr', 'hod', 'user']} />}>
                  <Route path="/hr" element={<HRHub />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['admin', 'hr', 'hod', 'user']} />}>
                  <Route path="/ops" element={<OperationsHub />} />
                  <Route path="/finance" element={<FinanceHub />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['admin', 'hr', 'hod', 'user']} />}>
                  <Route path="/invoices" element={<InvoicesHub />} />
                  <Route path="/proposals" element={<ProposalsHub />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </ProductivityProvider>
        </AIProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
