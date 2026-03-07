import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate, Link } from 'react-router-dom';

export default function Scanner() {
  const [scanResult, setScanResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('organizer_auth') !== 'true') {
      navigate('/organizer-login');
      return;
    }

    // Initializing the QR Code scanner
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 10,
    });

    scanner.render(success, error);

    function success(result) {
      scanner.clear();
      setScanResult(result);
      
      // Try to handle domain URL if it belongs to this app
      try {
        const url = new URL(result);
        if (url.origin === window.location.origin) {
          navigate(url.pathname + url.search);
        } else {
          // If it's external or different, you might just open it or alert
          window.location.href = result;
        }
      } catch (e) {
        // If it's just an ID or some error occurred, we can show it
        alert(`Scanned: ${result}`);
      }
    }

    function error(err) {
      // Just failing silently initially is fine for stream
    }

    // Cleanup scanner when component unmounts
    return () => {
      scanner.clear().catch(e => console.error("Could not clear scanner:", e));
    };
  }, [navigate]);

  return (
    <div className="card">
      <h2 className="title">Scan QR Code</h2>
      <p className="subtitle">Point camera at attendee's QR Code</p>
      
      {!scanResult ? (
        <div id="reader"></div>
      ) : (
        <div>
          <p>Scanned successfully. Redirecting...</p>
        </div>
      )}

      <Link to="/organizer" className="btn btn-secondary" style={{ marginTop: '2rem' }}>
        Back to Organizer Portal
      </Link>
    </div>
  );
}
