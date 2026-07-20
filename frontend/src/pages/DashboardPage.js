import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../api/dashboardApi';
import StatusBadge from '../components/applications/StatusBadge';
import DashboardCard from '../components/dashboard/DashboardCard';
import AlertMessage from '../components/common/AlertMessage';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDate, formatDateTime, getErrorMessage } from '../utils/format';
import { label } from '../utils/constants';

function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadSummary() {
      try {
        setLoading(true);
        const response = await dashboardApi.summary();
        setSummary(response.data);
      } catch (err) {
        setError(getErrorMessage(err, 'Unable to load dashboard'));
      } finally {
        setLoading(false);
      }
    }
    loadSummary();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Dashboard</h1>
          <p className="text-muted mb-0">Your job search at a glance.</p>
        </div>
        <Link to="/applications" className="btn btn-primary">Manage Applications</Link>
      </div>

      <AlertMessage type="danger" message={error} onClose={() => setError('')} />

      {summary && (
        <>
          <div className="row g-3 mb-4">
            <DashboardCard title="Applications" value={summary.totalApplications} tone="primary" />
            <DashboardCard title="Companies" value={summary.totalCompanies} tone="success" />
            <DashboardCard title="Interviews" value={summary.totalInterviews} tone="warning" />
            <DashboardCard title="Offers" value={summary.offers} tone="info" />
          </div>

          <div className="row g-4">
            <div className="col-xl-6">
              <div className="card h-100">
                <div className="card-header bg-white">
                  <h2 className="h5 mb-0">Application Status</h2>
                </div>
                <div className="card-body">
                  {summary.applicationStatusCounts.map((item) => {
                    const percent = summary.totalApplications ? Math.round((item.value / summary.totalApplications) * 100) : 0;
                    return (
                      <div className="mb-3" key={item.label}>
                        <div className="d-flex justify-content-between small mb-1">
                          <span>{label(item.label)}</span>
                          <span>{item.value}</span>
                        </div>
                        <div className="progress" role="progressbar" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100">
                          <div className="progress-bar" style={{ width: `${percent}%` }}>{percent}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="col-xl-6">
              <div className="card h-100">
                <div className="card-header bg-white">
                  <h2 className="h5 mb-0">Upcoming Interviews</h2>
                </div>
                <div className="card-body p-0">
                  {summary.upcomingInterviewList.length === 0 ? (
                    <div className="p-3">
                      <EmptyState title="No upcoming interviews" message="Scheduled interviews will appear here." />
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead>
                          <tr>
                            <th>Role</th>
                            <th>Company</th>
                            <th>Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {summary.upcomingInterviewList.map((interview) => (
                            <tr key={interview.id}>
                              <td>{interview.jobTitle}</td>
                              <td>{interview.companyName}</td>
                              <td>{formatDateTime(interview.scheduledAt)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="card">
                <div className="card-header bg-white">
                  <h2 className="h5 mb-0">Recent Applications</h2>
                </div>
                <div className="card-body p-0">
                  {summary.recentApplications.length === 0 ? (
                    <div className="p-3">
                      <EmptyState title="No applications yet" message="Create your first job application to populate the dashboard." />
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead>
                          <tr>
                            <th>Role</th>
                            <th>Company</th>
                            <th>Status</th>
                            <th>Applied</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {summary.recentApplications.map((application) => (
                            <tr key={application.id}>
                              <td>{application.jobTitle}</td>
                              <td>{application.companyName}</td>
                              <td><StatusBadge status={application.status} /></td>
                              <td>{formatDate(application.appliedDate)}</td>
                              <td className="text-end">
                                <Link to={`/applications/${application.id}`} className="btn btn-sm btn-outline-primary">View</Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default DashboardPage;
