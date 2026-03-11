import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/common/LandingPage';
import AnimatedLoginPage from './pages/animated-characters-login-page';
import AnimatedSignupPage from './pages/AnimatedSignupPage';
import OtpVerificationPage from './pages/OtpVerificationPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import CreateHackathon from './pages/organizer/CreateHackathon';
import ManageHackathon from './pages/organizer/ManageHackathon';
import EventManagement from './pages/organizer/EventManagement';
import CertificateTemplatesPage from './pages/organizer/CertificateTemplatesPage';
import CertificateEditor from './pages/organizer/CertificateEditor';
import GenerateCertificatesPage from './pages/organizer/GenerateCertificatesPage';
import Dashboard from './pages/student/Dashboard';
import Profile from './pages/student/Profile';
import HackathonDetails from './pages/student/HackathonDetails';
import Certificates from './pages/student/Certificates';
import PptReview from './pages/organizer/PptReview';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"                    element={<LandingPage />} />
        <Route path="/login"               element={<AnimatedLoginPage />} />
        <Route path="/signup"              element={<AnimatedSignupPage />} />
        <Route path="/verify-otp"           element={<OtpVerificationPage />} />
        <Route path="/admin-dashboard"     element={<AdminDashboard />} />
        <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
        <Route path="/organizer/create"    element={<CreateHackathon />} />
        <Route path="/organizer/manage"    element={<ManageHackathon />} />
        <Route path="/organizer/event/:id" element={<EventManagement />} />
        <Route path="/organizer/events"    element={<EventManagement />} />
        <Route path="/organizer/certificates" element={<CertificateTemplatesPage />} />
        <Route path="/organizer/certificates/editor" element={<CertificateEditor />} />
        <Route path="/organizer/certificates/generate" element={<GenerateCertificatesPage />} />
        <Route path="/organizer/ppt-review" element={<PptReview />} />

        {/* Student */}
        <Route path="/student/dashboard" element={<Dashboard />} />
        <Route path="/student/profile" element={<Profile />} />
        <Route path="/student/hackathon/:id" element={<HackathonDetails />} />
        <Route path="/student/certificates" element={<Certificates />} />
      </Routes>
    </BrowserRouter>
  );
}

