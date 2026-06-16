import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { useAuth } from './context/AuthContext';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';

import AdminDashboard from './pages/admin/DashboardPage';
import AdminMembers from './pages/admin/MembersPage';
import AdminClientPayment from './pages/admin/ClientPaymentPage';
import AdminTrainers from './pages/admin/TrainersPage';
import AdminPackages from './pages/admin/PackagesPage';
import AdminQRRegister from './pages/admin/QRRegistrationPage';
import AdminQRAttendance from './pages/admin/QRAttendancePage';

import SuperOverview from './pages/super/OverviewPage';
import SuperGyms from './pages/super/GymsPage';

function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to={requiredRole === 'super' ? '/super-admin/login' : '/login'} replace />;
  }
  if (requiredRole && role !== requiredRole) {
    return <Navigate to={role === 'super' ? '/super' : '/admin'} replace />;
  }
  return children;
}

function RoleRedirect() {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={role === 'super' ? '/super' : '/admin'} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage fixedRole="admin" />} />
      <Route path="/super-admin/login" element={<LoginPage fixedRole="super" />} />

      <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/clients/onboarding" element={<ProtectedRoute requiredRole="admin"><AdminMembers /></ProtectedRoute>} />
      <Route path="/admin/clients/payments" element={<ProtectedRoute requiredRole="admin"><AdminClientPayment /></ProtectedRoute>} />
      <Route path="/admin/trainers" element={<ProtectedRoute requiredRole="admin"><AdminTrainers /></ProtectedRoute>} />
      <Route path="/admin/members" element={<Navigate to="/admin/clients/onboarding" replace />} />
      <Route path="/admin/create-client" element={<Navigate to="/admin/clients/onboarding" replace />} />
      <Route path="/admin/client-payment" element={<Navigate to="/admin/clients/payments" replace />} />
      <Route path="/admin/packages" element={<ProtectedRoute requiredRole="admin"><AdminPackages /></ProtectedRoute>} />
      <Route path="/admin/qr-register" element={<ProtectedRoute requiredRole="admin"><AdminQRRegister /></ProtectedRoute>} />
      <Route path="/admin/qr-attendance" element={<ProtectedRoute requiredRole="admin"><AdminQRAttendance /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<Navigate to="/admin" replace />} />
      <Route path="/admin/sms" element={<Navigate to="/admin" replace />} />
      <Route path="/admin/sms-templates" element={<Navigate to="/admin" replace />} />

      <Route path="/super" element={<ProtectedRoute requiredRole="super"><SuperOverview /></ProtectedRoute>} />
      <Route path="/super/gyms" element={<ProtectedRoute requiredRole="super"><SuperGyms /></ProtectedRoute>} />
      <Route path="/super/members" element={<Navigate to="/super" replace />} />
      <Route path="/super/subs" element={<Navigate to="/super" replace />} />
      <Route path="/super/sms" element={<Navigate to="/super" replace />} />
      <Route path="/super/analytics" element={<Navigate to="/super" replace />} />

      <Route path="/dashboard" element={<RoleRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
