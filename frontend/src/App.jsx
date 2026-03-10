import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/common/LandingPage';
import Login from './pages/common/Login';
import Signup from './pages/common/Signup';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
