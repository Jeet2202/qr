import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage              from './pages/common/LandingPage';
import AnimatedLoginPage        from './pages/animated-characters-login-page';
import AnimatedSignupPage       from './pages/AnimatedSignupPage';
import OtpVerificationPage      from './pages/OtpVerificationPage';

import AdminDashboard           from './pages/admin/AdminDashboard';

import OrganizerDashboard       from './pages/organizer/OrganizerDashboard';
import CreateHackathon          from './pages/organizer/CreateHackathon';
import ManageHackathon          from './pages/organizer/ManageHackathon';
import EventManagement          from './pages/organizer/EventManagement';
import CertificateTemplatesPage from './pages/organizer/CertificateTemplatesPage';
import CertificateEditor        from './pages/organizer/CertificateEditor';
import GenerateCertificatesPage from './pages/organizer/GenerateCertificatesPage';
import PptReview                from './pages/organizer/PptReview';
import OrganizerProfile         from './pages/organizer/OrganizerProfile';

import Dashboard        from './pages/student/Dashboard';
import Profile          from './pages/student/Profile';
import HackathonDetails from './pages/student/HackathonDetails';
import Certificates     from './pages/student/Certificates';

/* Wrap a page with a required role */
const Org   = (Page) => <ProtectedRoute role="organizer"><Page /></ProtectedRoute>;
const Stu   = (Page) => <ProtectedRoute role="student"><Page /></ProtectedRoute>;
const Admin = (Page) => <ProtectedRoute role="admin"><Page /></ProtectedRoute>;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"          element={<LandingPage />} />
        <Route path="/login"     element={<AnimatedLoginPage />} />
        <Route path="/signup"    element={<AnimatedSignupPage />} />
        <Route path="/verify-otp" element={<OtpVerificationPage />} />

        {/* Admin */}
        <Route path="/admin-dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />

        {/* Organizer */}
        <Route path="/organizer-dashboard"              element={<ProtectedRoute role="organizer"><OrganizerDashboard /></ProtectedRoute>} />
        <Route path="/organizer/profile"                element={<ProtectedRoute role="organizer"><OrganizerProfile /></ProtectedRoute>} />
        <Route path="/organizer/create"                 element={<ProtectedRoute role="organizer"><CreateHackathon /></ProtectedRoute>} />
        <Route path="/organizer/manage"                 element={<ProtectedRoute role="organizer"><ManageHackathon /></ProtectedRoute>} />
        <Route path="/organizer/event/:id"              element={<ProtectedRoute role="organizer"><EventManagement /></ProtectedRoute>} />
        <Route path="/organizer/events"                 element={<ProtectedRoute role="organizer"><EventManagement /></ProtectedRoute>} />
        <Route path="/organizer/certificates"           element={<ProtectedRoute role="organizer"><CertificateTemplatesPage /></ProtectedRoute>} />
        <Route path="/organizer/certificates/editor"    element={<ProtectedRoute role="organizer"><CertificateEditor /></ProtectedRoute>} />
        <Route path="/organizer/certificates/generate"  element={<ProtectedRoute role="organizer"><GenerateCertificatesPage /></ProtectedRoute>} />
        <Route path="/organizer/ppt-review"             element={<ProtectedRoute role="organizer"><PptReview /></ProtectedRoute>} />

        {/* Student */}
        <Route path="/student/dashboard"      element={<ProtectedRoute role="student"><Dashboard /></ProtectedRoute>} />
        <Route path="/student/profile"        element={<ProtectedRoute role="student"><Profile /></ProtectedRoute>} />
        <Route path="/student/hackathon/:id"  element={<ProtectedRoute role="student"><HackathonDetails /></ProtectedRoute>} />
        <Route path="/student/certificates"   element={<ProtectedRoute role="student"><Certificates /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
