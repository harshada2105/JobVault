import { useEffect, useState } from 'react';
import { profileApi } from '../api/profileApi';
import AlertMessage from '../components/common/AlertMessage';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { formatDateTime, getErrorMessage } from '../utils/format';

function ProfilePage() {
  const { setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const response = await profileApi.get();
        setProfile(response.data);
        setFormData({ name: response.data.name, email: response.data.email });
      } catch (err) {
        setAlert({ type: 'danger', message: getErrorMessage(err, 'Unable to load profile') });
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

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
      const response = await profileApi.update(formData);
      setProfile(response.data);
      setUser(response.data);
      localStorage.setItem('jobvault_user', JSON.stringify(response.data));
      setAlert({ type: 'success', message: 'Profile updated successfully' });
    } catch (err) {
      setAlert({ type: 'danger', message: getErrorMessage(err, 'Unable to update profile') });
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="mb-4">
        <h1 className="h3 mb-1">Profile</h1>
        <p className="text-muted mb-0">Update your account information.</p>
      </div>

      <AlertMessage type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header bg-white">
              <h2 className="h5 mb-0">Account Details</h2>
            </div>
            <div className="card-body">
              <form noValidate className={validated ? 'was-validated' : ''} onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="profile-name">Name</label>
                  <input id="profile-name" name="name" className="form-control" value={formData.name} onChange={handleChange} required maxLength="100" />
                  <div className="invalid-feedback">Name is required.</div>
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="profile-email">Email</label>
                  <input id="profile-email" name="email" type="email" className="form-control" value={formData.email} onChange={handleChange} required maxLength="150" />
                  <div className="invalid-feedback">Enter a valid email address.</div>
                </div>
                <button className="btn btn-primary" type="submit">Save Profile</button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header bg-white">
              <h2 className="h5 mb-0">Account Summary</h2>
            </div>
            <div className="card-body">
              <dl className="row mb-0">
                <dt className="col-sm-4">Role</dt>
                <dd className="col-sm-8">{profile?.role}</dd>
                <dt className="col-sm-4">Created</dt>
                <dd className="col-sm-8">{formatDateTime(profile?.createdAt)}</dd>
                <dt className="col-sm-4">Updated</dt>
                <dd className="col-sm-8">{formatDateTime(profile?.updatedAt)}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
