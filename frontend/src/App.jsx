import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AnimatedLoginPage from './pages/animated-characters-login-page';
import AnimatedSignupPage from './pages/AnimatedSignupPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"       element={<LandingPage />} />
        <Route path="/login"  element={<AnimatedLoginPage />} />
        <Route path="/signup" element={<AnimatedSignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}
