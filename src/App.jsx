import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Registration from './pages/Registration';
import Success from './pages/Success';
import UserDetails from './pages/UserDetails';
import Scanner from './pages/Scanner';
import OrganizerLogin from './pages/OrganizerLogin';
import OrganizerPortal from './pages/OrganizerPortal';
import AttendeePortal from './pages/AttendeePortal';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="app-header">
          <img src="/logoss-01.png" alt="Logos" className="main-logo" />
        </header>
        <main className="app-content">
          <h1 className="main-heading">Event Registration</h1>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/organizer-login" element={<OrganizerLogin />} />
            <Route path="/organizer" element={<OrganizerPortal />} />
            <Route path="/attendee" element={<AttendeePortal />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/success/:id" element={<Success />} />
            <Route path="/user/:id" element={<UserDetails />} />
            <Route path="/scanner" element={<Scanner />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
