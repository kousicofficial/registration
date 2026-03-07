import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Link } from 'react-router-dom';
import { ScanLine, Share2 } from 'lucide-react';

export default function Home() {
  const [registerUrl, setRegisterUrl] = useState('');

  useEffect(() => {
    // Generate the URL for the registration page
    setRegisterUrl(`${window.location.origin}/register`);
  }, []);

  return (
    <div className="card">
      <h2 className="title">Event Registration System</h2>
      <p className="subtitle">Please select your role</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
        <Link to="/organizer-login" className="btn btn-primary">
          <ScanLine className="icon" size={20} />
          Organizer Portal
        </Link>
        
        <Link to="/attendee" className="btn btn-secondary">
          <Share2 className="icon" size={20} />
          Attendee Portal
        </Link>
      </div>
    </div>
  );
}
