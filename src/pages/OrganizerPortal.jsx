import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ScanLine, LogOut } from 'lucide-react';

export default function OrganizerPortal() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated as an organizer
    if (localStorage.getItem('organizer_auth') !== 'true') {
      navigate('/organizer-login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('organizer_auth');
    navigate('/');
  };
  return (
    <div className="card">
      <h2 className="title">Organizer Portal</h2>
      <p className="subtitle">Manage attendees and scan entry passes</p>
      <p style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem', margin: '1rem 0' }}>
        Walk to Care. Walk to Aware. Walk for Her.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
        <Link to="/scanner" className="btn btn-primary">
          <ScanLine className="icon" size={20} />
          Scan Attendee QR Code
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button onClick={handleLogout} className="btn btn-secondary" style={{ flex: 1, color: '#EF4444', borderColor: '#EF4444' }}>
          <LogOut className="icon" size={20} />
          Logout
        </button>
        <Link to="/" className="btn btn-secondary" style={{ flex: 1, background: '#f5f5f5', color: '#333' }}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
