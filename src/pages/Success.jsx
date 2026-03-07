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
      const query = `?name=${encodeURIComponent(userData.fullName)}&email=${encodeURIComponent(userData.email)}&phone=${encodeURIComponent(userData.phone)}&time=${encodeURIComponent(userData.createdAt)}`;
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

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '0.25rem' }}>ID: {id}</p>
        <img src="/ticket.png" alt="Ticket" style={{ width: '100%', maxWidth: '350px', height: '100px', objectFit: 'cover', objectPosition: 'center', margin: '0' }} />
        <p style={{ color: '#000080', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '0.25rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          Walk to Care. Walk to Aware. Walk for Her.
        </p>
      </div>

      <button 
        onClick={async () => {
          const svgElement = document.querySelector('.qr-container svg');
          const svgData = new XMLSerializer().serializeToString(svgElement);
          const DOMURL = window.URL || window.webkitURL || window;
          const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
          const url = DOMURL.createObjectURL(svgBlob);

          const loadImage = (src) => new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null); // fallback if missing
            img.src = src;
          });

          // Preload immediately
          const [qrImg, logo1, ticketImg] = await Promise.all([
            loadImage(url),
            loadImage('/logo 1.png'),
            loadImage('/ticket.png')
          ]);

          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Width variables
          const padding = 20;
          const qrSize = 300;
          canvas.width = qrSize + (padding * 4); 
          
          // Logo 1 config
          let lWidth = 260; // Bigger logo top center
          let lHeight = logo1 ? (logo1.height / logo1.width) * lWidth : 0;
          let startY = 20; // Reduced from 30
          
          let qrY = logo1 ? startY + lHeight + 5 : startY + 5; // Reduced from 10
          
          // QR size & Text
          let idY = qrY + qrSize + 15; // Reduced from 25
          let ticketY = idY + 10; // Reduced from 20
          
          // Ticket Img Cropping to forcefully strip its white padding!
          let tWidth = canvas.width - 40;
          let dHeight = 0;
          if (ticketImg) {
            // Cut off top 20% and bottom 20% of the original image to obliterate the white gap
            let cropY = ticketImg.height * 0.20;
            let cropHeight = ticketImg.height * 0.60;
            dHeight = (cropHeight / ticketImg.width) * tWidth;
          }
          
          let textY = ticketY + dHeight + 15; // Reduced from 25

          // Set complete Canvas Height dynamically now
          canvas.height = textY + 115; // Reduced from textY + 120, and fixed spacing
          
          // Outer edge baby pink
          ctx.fillStyle = '#FFB6C1';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Inner White Background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(15, 15, canvas.width - 30, canvas.height - 30);
          
          // Draw Logo 1 centered at top
          if (logo1) {
            ctx.drawImage(logo1, canvas.width / 2 - (lWidth / 2), startY, lWidth, lHeight);
          }

          // Draw QR code centered
          ctx.drawImage(qrImg, canvas.width / 2 - (qrSize / 2), qrY, qrSize, qrSize);
          DOMURL.revokeObjectURL(url);
          
          // Draw Text TICKET ID
          ctx.textAlign = 'center';
          ctx.fillStyle = '#000080'; // Dark Blue
          ctx.font = 'bold 16px monospace';
          ctx.fillText(`TICKET ID: ${id}`, canvas.width / 2, idY);
          
          // Draw Cropped ticket.png
          if (ticketImg) {
            // drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
            const cropY = ticketImg.height * 0.20;
            const cropHeight = ticketImg.height * 0.60;
            ctx.drawImage(ticketImg, 0, cropY, ticketImg.width, cropHeight, 20, ticketY, tWidth, dHeight);
          }

          // Draw Dashed Line separator
          ctx.beginPath();
          ctx.setLineDash([5, 5]);
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 2;
          ctx.moveTo(40, textY - 10);
          ctx.lineTo(canvas.width - 40, textY - 10);
          ctx.stroke();
          ctx.setLineDash([]);
          
          // Draw Messages
          ctx.fillStyle = '#000080';
          ctx.font = 'bold 22px sans-serif';
          ctx.fillText(`Here is your QR code`, canvas.width / 2, textY + 15);
          ctx.fillText(`for free checkup!`, canvas.width / 2, textY + 40);

          // Draw Campaign Message (BLUE)
          ctx.fillStyle = '#000080';
          ctx.font = 'bold 17px sans-serif';
          ctx.fillText(`Walk to Care. Walk to Aware. Walk for Her.`, canvas.width / 2, textY + 65);
          
          // Draw Name prominently
          ctx.fillStyle = '#000080';
          ctx.font = 'bold 24px sans-serif';
          ctx.fillText(user.fullName, canvas.width / 2, textY + 95);
          
          // Download as PNG
          const pngUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = pngUrl;
          link.download = `${user.fullName.replace(/\s+/g, '_')}_Ticket.png`;
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
