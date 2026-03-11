import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyOTP from './pages/VerifyOTP';
import Dashboard from './pages/student/Dashboard';
import Profile from './pages/student/Profile';
import HackathonDetails from './pages/student/HackathonDetails';
import Certificates from './pages/student/Certificates';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        {/* Student */}
        <Route path="/student/dashboard" element={<Dashboard />} />
        <Route path="/student/profile" element={<Profile />} />
        <Route path="/student/hackathon/:id" element={<HackathonDetails />} />
        <Route path="/student/certificates" element={<Certificates />} />
      </Routes>
    </BrowserRouter>
  );
}
