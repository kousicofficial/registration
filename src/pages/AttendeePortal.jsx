import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Link } from 'react-router-dom';
import { UserPlus, Share2 } from 'lucide-react';

export default function AttendeePortal() {
  const [registerUrl, setRegisterUrl] = useState('');

  useEffect(() => {
    // Generate the URL for the registration page
    setRegisterUrl(`${window.location.origin}/register`);
  }, []);

  return (
    <div className="card">
      <h2 className="title">Attendee Portal</h2>
      <p className="subtitle">Scan the QR code below to open the registration form</p>

      {registerUrl && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="qr-container" style={{ marginBottom: '1rem' }}>
            <QRCodeSVG 
              value={registerUrl} 
              size={256}
              level="H"
              includeMargin={true}
            />
          </div>
          <p style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '2rem' }}>
            Walk to Care. Walk to Aware. Walk for Her.
          </p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        <Link to="/register" className="btn btn-primary">
          <UserPlus className="icon" size={20} />
          Go to Registration Form
        </Link>
        
        <button 
          onClick={() => {
            navigator.clipboard.writeText(registerUrl);
            alert('Registration link copied to clipboard!');
          }}
          className="btn btn-secondary"
        >
          <Share2 className="icon" size={20} />
          Copy Registration Link
        </button>
      </div>

      <Link to="/" className="btn btn-secondary" style={{ marginTop: '2rem', background: '#f5f5f5', color: '#333' }}>
        Back to Home
      </Link>
    </div>
  );
}
