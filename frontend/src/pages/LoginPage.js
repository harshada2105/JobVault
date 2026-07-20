import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AlertMessage from '../components/common/AlertMessage';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/format';

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
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
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err, 'Login failed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card shadow-sm">
        <div className="card-body p-4">
          <h1 className="h3 mb-1">JobVault</h1>
          <p className="text-muted">Sign in to manage your job search.</p>
          <AlertMessage type="danger" message={error} onClose={() => setError('')} />
          <form noValidate className={validated ? 'was-validated' : ''} onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" htmlFor="email">Email</label>
              <input id="email" type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
              <div className="invalid-feedback">Enter a valid email address.</div>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="password">Password</label>
              <input id="password" type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
              <div className="invalid-feedback">Password is required.</div>
            </div>
            <button className="btn btn-primary w-100" type="submit" disabled={submitting}>
              {submitting ? 'Signing in...' : 'Login'}
            </button>
          </form>
          <p className="text-center text-muted mt-3 mb-0">
            New to JobVault? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
