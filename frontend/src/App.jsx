import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AnimatedLoginPage from './pages/animated-characters-login-page';
import AnimatedSignupPage from './pages/AnimatedSignupPage';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"       element={<LandingPage />} />
        <Route path="/login"  element={<AnimatedLoginPage />} />
        <Route path="/signup" element={<AnimatedSignupPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
