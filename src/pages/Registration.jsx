import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveUser, getUsers } from '../utils/storage';
import { UserPlus } from 'lucide-react';

export default function Registration() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });

  // Check on mount if user is already registered on this device
  useEffect(() => {
    const existingUsers = getUsers();
    if (existingUsers && existingUsers.length > 0) {
      // If already registered, directly show them their QR
      navigate(`/success/${existingUsers[0].id}`);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if phone number is already registered locally
    const existingUsers = getUsers();
    const existingUser = existingUsers.find(u => u.phone === formData.phone);
    if (existingUser) {
      alert("This phone number is already registered!");
      navigate(`/success/${existingUser.id}`);
      return;
    }

    // Validations
    if (!formData.email.toLowerCase().endsWith('@gmail.com')) {
      alert("Email address must end with @gmail.com");
      return;
    }

    const phoneRegex = /^[6789]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert("Invalid phone number! Please enter a valid 10-digit authentic phone number.");
      return;
    }

    setSubmitting(true);
    
    try {
      const savedUser = await saveUser(formData);
      navigate(`/success/${savedUser.id}`);
    } catch (err) {
      alert(err.message || "Registration failed. Please try again.");
      console.error(err);
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h2 className="title">Attendee Registration</h2>
      <p className="subtitle">Please fill out the form to get your pass</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            className="form-input"
            value={formData.fullName}
            onChange={handleChange}
            required
            placeholder="John Doe"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="john@example.com"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="form-input"
            value={formData.phone}
            onChange={handleChange}
            required
            pattern="^[6789]\d{9}$"
            title="Please enter a valid 10-digit phone number"
            placeholder="1234567890"
            maxLength="10"
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: '1.5rem' }} disabled={submitting}>
          <UserPlus className="icon" size={20} />
          {submitting ? 'Registering...' : 'Complete Registration'}
        </button>
      </form>
    </div>
  );
}
