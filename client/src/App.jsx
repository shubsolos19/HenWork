import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Toaster } from 'sonner';

import AppLayout from '@/components/layout/AppLayout';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import SignupSuccessPage from '@/pages/auth/SignupSuccessPage';
import AuthCallback from '@/pages/auth/AuthCallback';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import OrganizationPage from '@/pages/organizations/OrganizationPage';
import NewOrgPage from '@/pages/organizations/NewOrgPage';
import MembersPage from '@/pages/organizations/MembersPage';
import ProjectPage from '@/pages/projects/ProjectPage';
import TaskDetailPage from '@/pages/tasks/TaskDetailPage';
import ProfilePage from '@/pages/profile/ProfilePage';
import LandingPage from '@/pages/LandingPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-text-muted">Loading...</p>
        </div>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
            <Route path="/signup-success" element={<SignupSuccessPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Protected */}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/org/new" element={<NewOrgPage />} />
              <Route path="/org/:orgId" element={<OrganizationPage />} />
              <Route path="/org/:orgId/members" element={<MembersPage />} />
              <Route path="/project/:projectId" element={<ProjectPage />} />
              <Route path="/task/:taskId" element={<TaskDetailPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>

          <Toaster theme="dark" position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
              },
              classNames: {
                error: 'text-destructive',
                success: 'text-success',
                warning: 'text-warning',
                info: 'text-primary'
              }
            }} />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
