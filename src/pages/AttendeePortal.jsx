import { Link } from 'react-router-dom';

export default function AttendeePortal() {
  return (
    <div className="card">
      <h2 className="title">Attendee Portal</h2>
      <p className="subtitle" style={{ fontSize: '1.2rem', marginTop: '1rem', color: '#ff4d4d', textAlign: 'center' }}>
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
