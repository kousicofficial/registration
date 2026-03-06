import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle, Download } from 'lucide-react';
import { getUser } from '../utils/storage';

export default function Success() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    const userData = getUser(id);
    if (userData) {
      setUser(userData);
      // Create user details URL to encode in QR with fallback data
      const query = `?name=${encodeURIComponent(userData.fullName)}&email=${encodeURIComponent(userData.email)}&phone=${encodeURIComponent(userData.phone)}&org=${encodeURIComponent(userData.organization)}`;
      setQrUrl(`${window.location.origin}/user/${id}${query}`);
    }
  }, [id]);

  if (!user) {
    return (
      <div className="card">
        <h2 className="title">Not Found</h2>
        <p>Registration details not found. Please try again.</p>
        <Link to="/register" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Registration
        </Link>
      </div>
    );
  }

  return (
    <div className="card">
      <CheckCircle className="icon success-icon" size={64} style={{ display: 'inline-block' }} />
      <h2 className="title">Registration Successful!</h2>
      <p className="subtitle">Welcome, {user.fullName}. Here is your access pass.</p>

      <div className="qr-container">
        <QRCodeSVG 
          value={qrUrl} 
          size={256}
          level="H"
          includeMargin={true}
          id="user-qr-code"
        />
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>ID: {id}</p>
      </div>

      <button 
        onClick={() => {
          const canvas = document.querySelector('.qr-container svg');
          const svgData = new XMLSerializer().serializeToString(canvas);
          const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${user.fullName.replace(/\s+/g, '_')}_QRCode.svg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}
        className="btn btn-primary"
      >
        <Download className="icon" size={20} />
        Download QR Code
      </button>

      <Link to="/" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
        Back to Home
      </Link>
    </div>
  );
}
