import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { applicationApi } from '../api/applicationApi';
import StatusBadge from '../components/applications/StatusBadge';
import PriorityBadge from '../components/applications/PriorityBadge';
import AlertMessage from '../components/common/AlertMessage';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDate, formatDateTime, getErrorMessage } from '../utils/format';
import { label } from '../utils/constants';

function ApplicationDetailPage() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadApplication() {
      try {
        setLoading(true);
        const [applicationResponse, historyResponse] = await Promise.all([
          applicationApi.getById(id),
          applicationApi.history(id)
        ]);
        setApplication(applicationResponse.data);
        setHistory(historyResponse.data);
      } catch (err) {
        setError(getErrorMessage(err, 'Unable to load application'));
      } finally {
        setLoading(false);
      }
    }
    loadApplication();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="mb-4">
        <Link to="/applications" className="btn btn-sm btn-outline-secondary mb-3">Back to Applications</Link>
        <h1 className="h3 mb-1">{application?.jobTitle || 'Application'}</h1>
        <p className="text-muted mb-0">{application?.companyName}</p>
      </div>

      <AlertMessage type="danger" message={error} onClose={() => setError('')} />

      {application && (
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="card h-100">
              <div className="card-header bg-white">
                <h2 className="h5 mb-0">Application Details</h2>
              </div>
              <div className="card-body">
                <dl className="row mb-0">
                  <dt className="col-sm-4">Company</dt>
                  <dd className="col-sm-8">{application.companyName}</dd>
                  <dt className="col-sm-4">Status</dt>
                  <dd className="col-sm-8"><StatusBadge status={application.status} /></dd>
                  <dt className="col-sm-4">Priority</dt>
                  <dd className="col-sm-8"><PriorityBadge priority={application.priority} /></dd>
                  <dt className="col-sm-4">Employment Type</dt>
                  <dd className="col-sm-8">{label(application.employmentType)}</dd>
                  <dt className="col-sm-4">Location</dt>
                  <dd className="col-sm-8">{application.location || '-'}</dd>
                  <dt className="col-sm-4">Salary</dt>
                  <dd className="col-sm-8">{application.salaryRange || '-'}</dd>
                  <dt className="col-sm-4">Applied Date</dt>
                  <dd className="col-sm-8">{formatDate(application.appliedDate)}</dd>
                  <dt className="col-sm-4">Deadline</dt>
                  <dd className="col-sm-8">{formatDate(application.deadlineDate)}</dd>
                  <dt className="col-sm-4">Job URL</dt>
                  <dd className="col-sm-8">{application.jobUrl ? <a href={application.jobUrl} target="_blank" rel="noreferrer">{application.jobUrl}</a> : '-'}</dd>
                  <dt className="col-sm-4">Notes</dt>
                  <dd className="col-sm-8">{application.notes || '-'}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="card h-100">
              <div className="card-header bg-white">
                <h2 className="h5 mb-0">Status Timeline</h2>
              </div>
              <div className="card-body">
                {history.length === 0 ? (
                  <EmptyState title="No history found" message="Status changes will appear here." />
                ) : (
                  <div className="list-group">
                    {history.map((item) => (
                      <div className="list-group-item" key={item.id}>
                        <div className="d-flex justify-content-between">
                          <strong>{label(item.newStatus)}</strong>
                          <span className="text-muted small">{formatDateTime(item.changedAt)}</span>
                        </div>
                        <div className="text-muted small">
                          {item.oldStatus ? `${label(item.oldStatus)} to ${label(item.newStatus)}` : `Created as ${label(item.newStatus)}`}
                        </div>
                        {item.note && <div className="mt-1">{item.note}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ApplicationDetailPage;
