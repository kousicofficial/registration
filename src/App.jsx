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
          <div className="header-logos">
            <img src="/logo 1.png" alt="Logo 1" className="header-logo" />
          </div>
          <h1 className="app-title">Event Registration</h1>
          <div className="header-logos">
            <img src="/logo 2.png" alt="Logo 2" className="header-logo" />
            <img src="/logo3.png" alt="Logo 3" className="header-logo" />
          </div>
        </header>
        <main className="app-content">
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
