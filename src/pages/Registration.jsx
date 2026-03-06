import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveUser } from '../utils/storage';
import { UserPlus } from 'lucide-react';

export default function Registration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call and save user
    const savedUser = saveUser(formData);
    // Redirect to success page with generated ID
    navigate(`/success/${savedUser.id}`);
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
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="organization">Organization</label>
          <input
            type="text"
            id="organization"
            name="organization"
            className="form-input"
            value={formData.organization}
            onChange={handleChange}
            required
            placeholder="Company/University Name"
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          <UserPlus className="icon" size={20} />
          Complete Registration
        </button>
      </form>
    </div>
  );
}
