import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import OAuthCallback from './pages/OAuthCallback';
import NotFound from './pages/NotFound';
import LoadingScreen from './components/ui/LoadingScreen';
import PageLoader from './components/ui/PageLoader';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Clients = lazy(() => import('./pages/Clients'));
const Projects = lazy(() => import('./pages/Projects'));
const Invoices = lazy(() => import('./pages/Invoices'));
const Reminders = lazy(() => import('./pages/Reminders'));
const Settings = lazy(() => import('./pages/Settings'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const CheckEmail = lazy(() => import('./pages/CheckEmail'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return !user ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/check-email" element={<CheckEmail />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/oauth-callback" element={<OAuthCallback />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><Layout><Suspense fallback={<PageLoader />}><Dashboard /></Suspense></Layout></ProtectedRoute>}
          />
          <Route
            path="/clients"
            element={<ProtectedRoute><Layout><Suspense fallback={<PageLoader />}><Clients /></Suspense></Layout></ProtectedRoute>}
          />
          <Route
            path="/projects"
            element={<ProtectedRoute><Layout><Suspense fallback={<PageLoader />}><Projects /></Suspense></Layout></ProtectedRoute>}
          />
          <Route
            path="/invoices"
            element={<ProtectedRoute><Layout><Suspense fallback={<PageLoader />}><Invoices /></Suspense></Layout></ProtectedRoute>}
          />
          <Route
            path="/reminders"
            element={<ProtectedRoute><Layout><Suspense fallback={<PageLoader />}><Reminders /></Suspense></Layout></ProtectedRoute>}
          />
          <Route
            path="/settings"
            element={<ProtectedRoute><Layout><Suspense fallback={<PageLoader />}><Settings /></Suspense></Layout></ProtectedRoute>}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
