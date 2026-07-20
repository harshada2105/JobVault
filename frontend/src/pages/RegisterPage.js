import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AlertMessage from '../components/common/AlertMessage';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/format';

function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      setValidated(true);
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err, 'Registration failed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card shadow-sm">
        <div className="card-body p-4">
          <h1 className="h3 mb-1">Create Account</h1>
          <p className="text-muted">Start tracking your applications.</p>
          <AlertMessage type="danger" message={error} onClose={() => setError('')} />
          <form noValidate className={validated ? 'was-validated' : ''} onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" htmlFor="name">Name</label>
              <input id="name" name="name" className="form-control" value={formData.name} onChange={handleChange} required maxLength="100" />
              <div className="invalid-feedback">Name is required.</div>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="email">Email</label>
              <input id="email" type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
              <div className="invalid-feedback">Enter a valid email address.</div>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="password">Password</label>
              <input id="password" type="password" name="password" className="form-control" minLength="6" value={formData.password} onChange={handleChange} required />
              <div className="invalid-feedback">Password must be at least 6 characters.</div>
            </div>
            <button className="btn btn-primary w-100" type="submit" disabled={submitting}>
              {submitting ? 'Creating account...' : 'Register'}
            </button>
          </form>
          <p className="text-center text-muted mt-3 mb-0">
            Already registered? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
