import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveUser, getUsers, sendOtp, verifyOtp } from '../utils/storage';
import { UserPlus, MessageSquare } from 'lucide-react';

export default function Registration() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
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

  const handleSendOtp = async (e) => {
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

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert("Phone number must be exactly 10 digits");
      return;
    }

    setSubmitting(true);

    try {
      await sendOtp(formData.phone);
      setOtpSent(true);
      alert("OTP sent to your phone number!");
    } catch (err) {
      alert(err.message || "Failed to send OTP. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyRegistration = async (e) => {
    e.preventDefault();
    
    if (otp.length < 6) {
      alert("Please enter a valid 6-digit OTP.");
      return;
    }

    setSubmitting(true);
    
    try {
      await verifyOtp(formData.phone, otp);
      const savedUser = await saveUser(formData);
      navigate(`/success/${savedUser.id}`);
    } catch (err) {
      alert(err.message || "OTP verification failed. Please try again.");
      console.error(err);
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h2 className="title">Attendee Registration</h2>
      <p className="subtitle">Please fill out the form to get your pass</p>

      <form onSubmit={otpSent ? handleVerifyRegistration : handleSendOtp}>
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
            disabled={otpSent}
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
            disabled={otpSent}
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
            disabled={otpSent}
            pattern="[0-9]{10}"
            title="Please enter exactly 10 digits"
            placeholder="1234567890"
            maxLength="10"
          />
        </div>

        {otpSent && (
          <div className="form-group" style={{ marginTop: '1rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
            <label className="form-label" htmlFor="otp">Enter 6-Digit OTP</label>
            <input
              type="text"
              id="otp"
              name="otp"
              className="form-input"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              pattern="[0-9]{6}"
              title="Please enter a valid 6-digit OTP"
              placeholder="123456"
              maxLength="6"
              style={{ fontSize: '1.2rem', letterSpacing: '2px', textAlign: 'center' }}
            />
          </div>
        )}

        {otpSent ? (
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1.5rem' }} disabled={submitting || otp.length < 6}>
            <UserPlus className="icon" size={20} />
            {submitting ? 'Verifying...' : 'Verify & Complete Registration'}
          </button>
        ) : (
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1.5rem' }} disabled={submitting}>
            <MessageSquare className="icon" size={20} />
            {submitting ? 'Sending...' : 'Send OTP'}
          </button>
        )}
      </form>
    </div>
  );
}
