import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Landing & Public Pages
import Landing from './pages/Landing';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Branches from './pages/Branches';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Candidate Pages
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import CandidateProfile from './pages/candidate/CandidateProfile';

// HR Pages
import HRDashboard from './pages/hr/HRDashboard';
import ManageJobs from './pages/hr/ManageJobs';
import JobForm from './pages/hr/JobForm';
import ManageApplications from './pages/hr/ManageApplications';
import ManageInterviews from './pages/hr/ManageInterviews';

import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* ========== PUBLIC ROUTES ========== */}
          <Route path="/" element={<Landing />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/job-detail/:jobId" element={<JobDetail />} />
          <Route path="/branches" element={<Branches />} />

          {/* ========== AUTHENTICATION ROUTES ========== */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ========== CANDIDATE PORTAL ========== */}
          <Route
            path="/candidate-dashboard"
            element={
              <ProtectedRoute allowedRoles={['candidate']}>
                <CandidateDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate-profile"
            element={
              <ProtectedRoute allowedRoles={['candidate']}>
                <CandidateProfile />
              </ProtectedRoute>
            }
          />

          {/* ========== HR PORTAL ========== */}
          <Route
            path="/hr-dashboard"
            element={
              <ProtectedRoute allowedRoles={['hr', 'admin']}>
                <HRDashboard />
              </ProtectedRoute>
            }
          />

          {/* HR - Job Management */}
          <Route
            path="/hr-dashboard/manage-jobs"
            element={
              <ProtectedRoute allowedRoles={['hr', 'admin']}>
                <ManageJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr-dashboard/post-job"
            element={
              <ProtectedRoute allowedRoles={['hr', 'admin']}>
                <JobForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr-dashboard/edit-job/:jobId"
            element={
              <ProtectedRoute allowedRoles={['hr', 'admin']}>
                <JobForm />
              </ProtectedRoute>
            }
          />

          {/* HR - Application Management */}
          <Route
            path="/hr-dashboard/manage-applications"
            element={
              <ProtectedRoute allowedRoles={['hr', 'admin']}>
                <ManageApplications />
              </ProtectedRoute>
            }
          />

          {/* HR - Interview Management */}
          <Route
            path="/hr-dashboard/manage-interviews"
            element={
              <ProtectedRoute allowedRoles={['hr', 'admin']}>
                <ManageInterviews />
              </ProtectedRoute>
            }
          />

          {/* ========== CATCH-ALL ========== */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}


