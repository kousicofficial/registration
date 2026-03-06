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
      <h2 className="title">Event Registration Dashboard</h2>
      <p className="subtitle">Scan the QR code below to open the registration form</p>

      {registerUrl && (
        <div className="qr-container">
          <QRCodeSVG 
            value={registerUrl} 
            size={256}
            level="H"
            includeMargin={true}
          />
        </div>
      )}

      <div>
        <Link to="/scanner" className="btn btn-primary" style={{ marginBottom: '1rem' }}>
          <ScanLine className="icon" size={20} />
          Scan Attendee QR Code
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
    </div>
  );
}
