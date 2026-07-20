import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="auth-page">
      <div className="card auth-card shadow-sm">
        <div className="card-body text-center p-4">
          <h1 className="h3">Page Not Found</h1>
          <p className="text-muted">The page you requested does not exist.</p>
          <Link className="btn btn-primary" to="/dashboard">Go to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
