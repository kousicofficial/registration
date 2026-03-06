import { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { User, Mail, Phone, Building2 } from 'lucide-react';
import { getUser } from '../utils/storage';

export default function UserDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate network delay
    setTimeout(() => {
      let userData = getUser(id);
      
      // Fallback: If not on this device's local storage, check QR code URL parameters
      if (!userData && searchParams.get('name')) {
        userData = {
          id: id,
          fullName: searchParams.get('name'),
          email: searchParams.get('email'),
          phone: searchParams.get('phone'),
          organization: searchParams.get('org')
        };
      }
      
      setUser(userData);
      setLoading(false);
    }, 500);
  }, [id, searchParams]);

  if (loading) {
    return (
      <div className="card">
        <h2 className="title">Loading Details...</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="card">
        <h2 className="title" style={{ color: '#EF4444' }}>Invalid ID</h2>
        <p>No user found for the scanned QR code.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{
        background: 'var(--primary)',
        color: 'white',
        borderRadius: '50%',
        width: '80px',
        height: '80px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem'
      }}>
        <User size={40} />
      </div>

      <h2 className="title" style={{ marginBottom: '2rem' }}>Attendee Details</h2>

      <div style={{ textAlign: 'left', background: '#F3F4F6', borderRadius: '0.5rem', overflow: 'hidden' }}>
        <div className="user-detail-item">
          <span className="user-detail-label">Full Name</span>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <User className="icon" size={18} style={{ color: 'var(--primary)' }} />
            <span className="user-detail-value">{user.fullName}</span>
          </div>
        </div>

        <div className="user-detail-item">
          <span className="user-detail-label">Email Address</span>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Mail className="icon" size={18} style={{ color: 'var(--primary)' }} />
            <span className="user-detail-value">{user.email}</span>
          </div>
        </div>

        <div className="user-detail-item">
          <span className="user-detail-label">Phone Number</span>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Phone className="icon" size={18} style={{ color: 'var(--primary)' }} />
            <span className="user-detail-value">{user.phone}</span>
          </div>
        </div>

        <div className="user-detail-item">
          <span className="user-detail-label">Organization</span>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Building2 className="icon" size={18} style={{ color: 'var(--primary)' }} />
            <span className="user-detail-value">{user.organization}</span>
          </div>
        </div>

        <div className="user-detail-item">
          <span className="user-detail-label">Registration ID</span>
          <span className="user-detail-value" style={{ fontSize: '0.875rem', fontFamily: 'monospace' }}>
            {user.id}
          </span>
        </div>
      </div>

      <Link to="/" className="btn btn-secondary" style={{ marginTop: '2rem' }}>
        Back to Home
      </Link>
    </div>
  );
}
