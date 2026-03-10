import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/common/LandingPage';
import Login from './pages/common/Login';
import Signup from './pages/common/Signup';
import AdminDashboard from './pages/admin/AdminDashboard';
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import CreateHackathon from './pages/organizer/CreateHackathon';
import ManageHackathon from './pages/organizer/ManageHackathon';
import EventManagement from './pages/organizer/EventManagement';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                         element={<LandingPage />} />
        <Route path="/login"                    element={<Login />} />
        <Route path="/signup"                   element={<Signup />} />
        <Route path="/admin-dashboard"          element={<AdminDashboard />} />
        <Route path="/organizer-dashboard"      element={<OrganizerDashboard />} />
        <Route path="/organizer/create"         element={<CreateHackathon />} />
        <Route path="/organizer/manage"         element={<ManageHackathon />} />
        <Route path="/organizer/event/:id"      element={<EventManagement />} />
        <Route path="/organizer/events"         element={<EventManagement />} />
      </Routes>
    </BrowserRouter>
  );
}
