import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveUser } from '../utils/storage';
import { UserPlus } from 'lucide-react';

export default function Registration() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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

    const configuration = {
      widgetId: "3663676b4633313536393639",
      tokenAuth: "498390TnNUOfthlceH69ac0d49P1",
      identifier: formData.phone,
      success: async (data) => {
        console.log('success response', data);
        try {
          const savedUser = await saveUser(formData);
          navigate(`/success/${savedUser.id}`);
        } catch (err) {
          alert(err.message || "Failed to register. Please try again.");
          console.error(err);
          setSubmitting(false);
        }
      },
      failure: (error) => {
        console.log('failure reason', error);
        alert(error?.message || "OTP verification failed. Please try again.");
        setSubmitting(false);
      }
    };

    if (typeof window.initSendOTP === 'function') {
      window.initSendOTP(configuration);
    } else {
      // dynamically load script
      const urls = [
        'https://verify.msg91.com/otp-provider.js',
        'https://verify.phone91.com/otp-provider.js'
      ];
      let i = 0;
      const attempt = () => {
        const s = document.createElement('script');
        s.src = urls[i];
        s.async = true;
        s.onload = () => {
            if (typeof window.initSendOTP === 'function') {
                window.initSendOTP(configuration);
            }
        };
        s.onerror = () => {
            i++;
            if (i < urls.length) {
                attempt();
            } else {
                alert("Failed to load OTP service. Please try again.");
                setSubmitting(false);
            }
        };
        document.head.appendChild(s);
      };
      attempt();
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
            pattern="[0-9]{10}"
            title="Please enter exactly 10 digits"
            placeholder="1234567890"
            maxLength="10"
          />
        </div>


        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={submitting}>
          <UserPlus className="icon" size={20} />
          {submitting ? 'Registering...' : 'Complete Registration'}
        </button>
      </form>
    </div>
  );
}
