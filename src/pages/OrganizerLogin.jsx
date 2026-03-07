import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

export default function OrganizerLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple password protection for the organizer portal
    if (password === 'Supreme@098') {
      localStorage.setItem('organizer_auth', 'true');
      navigate('/organizer');
    } else {
      setError('Invalid password. Please try again.');
    }
  };

  return (
    <div className="card">
      <h2 className="title">Organizer Login</h2>
      <p className="subtitle">Enter password to access the organizer portal</p>

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
