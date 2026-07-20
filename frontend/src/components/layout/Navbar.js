import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom px-4">
      <div className="container-fluid px-0">
        <span className="navbar-brand mb-0 h1">JobVault</span>
        <div className="d-flex align-items-center gap-3">
          <span className="text-muted small d-none d-sm-inline">{user?.name}</span>
          <button className="btn btn-outline-danger btn-sm" type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
