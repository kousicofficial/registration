import { Link } from 'react-router-dom';

export default function Registration() {
  return (
    <div className="card">
      <h2 className="title" style={{ color: 'var(--primary)', textAlign: 'center' }}>Registration Closed</h2>
      <p className="subtitle" style={{ textAlign: 'center', fontSize: '1.2rem', marginTop: '1rem', color: '#ff4d4d' }}>
        Time over you can't register.
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <Link to="/" className="btn btn-secondary">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
