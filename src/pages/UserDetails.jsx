import { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { User, Mail, Phone, Clock, CheckCircle, Lock } from 'lucide-react';
import { getUser, markUserPresent } from '../utils/storage';

export default function UserDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [markedPresent, setMarkedPresent] = useState(false);
  const [marking, setMarking] = useState(false);

  // Auth logic
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if organizer is already authenticated
    if (localStorage.getItem('organizer_auth') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'Supreme@098') {
      localStorage.setItem('organizer_auth', 'true');
      setIsAuthenticated(true);
    } else {
      setError('Invalid password. Please try again.');
    }
  };

  const handleMarkPresent = async () => {
    setMarking(true);
    const success = await markUserPresent(id);
    if (success) {
      setMarkedPresent(true);
    } else {
      alert("Failed to mark present. Please try again.");
    }
    setMarking(false);
  };

  useEffect(() => {
    if (!isAuthenticated) return;

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
          createdAt: searchParams.get('time')
        };
      }
      
      setUser(userData);
      setLoading(false);
    }, 500);
  }, [id, searchParams, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="card">
        <h2 className="title">Organizer Access Required</h2>
        <p className="subtitle">Enter password to view attendee details</p>
  
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
          <input 
            type="password" 
            placeholder="Enter Organizer Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            required
          />
          
          {error && <p style={{ color: '#EF4444', fontSize: '0.875rem' }}>{error}</p>}
  
          <button type="submit" className="btn btn-primary">
            <Lock className="icon" size={20} />
            Login
          </button>
        </form>
  
        <Link to="/" className="btn btn-secondary" style={{ marginTop: '2rem', background: '#f5f5f5', color: '#333' }}>
          Back to Home
        </Link>
      </div>
    );
  }

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
          <span className="user-detail-label">Registration Time</span>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Clock className="icon" size={18} style={{ color: 'var(--primary)' }} />
            <span className="user-detail-value">
              {user.createdAt || 'N/A'}
            </span>
          </div>
        </div>

        <div className="user-detail-item">
          <span className="user-detail-label">Registration ID</span>
          <span className="user-detail-value" style={{ fontSize: '0.875rem', fontFamily: 'monospace' }}>
            {user.id}
          </span>
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button 
          onClick={handleMarkPresent}
          className={`btn ${markedPresent ? 'btn-secondary' : 'btn-primary'}`}
          disabled={markedPresent || marking}
          style={markedPresent ? { backgroundColor: '#10B981', color: 'white', borderColor: '#10B981' } : {}}
        >
          <CheckCircle className="icon" size={20} />
          {marking ? 'Updating...' : markedPresent ? 'Marked Present' : 'Mark as Present'}
        </button>

        <Link to="/organizer" className="btn btn-secondary">
          Back to Scanner / Details
        </Link>
      </div>
    </div>
  );
}

