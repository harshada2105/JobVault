import { useCallback, useEffect, useState } from 'react';
import { applicationApi } from '../api/applicationApi';
import { interviewApi } from '../api/interviewApi';
import InterviewFormModal from '../components/interviews/InterviewFormModal';
import AlertMessage from '../components/common/AlertMessage';
import ConfirmModal from '../components/common/ConfirmModal';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { INTERVIEW_STATUSES, label } from '../utils/constants';
import { formatDateTime, getErrorMessage } from '../utils/format';

function InterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [filters, setFilters] = useState({ query: '', status: '' });
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [showModal, setShowModal] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);
  const [deletingInterview, setDeletingInterview] = useState(null);

  const loadData = useCallback(async (activeFilters = {}) => {
    try {
      setLoading(true);
      const params = Object.fromEntries(Object.entries(activeFilters).filter(([, value]) => value));
      const [interviewResponse, applicationResponse] = await Promise.all([
        interviewApi.getAll(params),
        applicationApi.getAll()
      ]);
      setInterviews(interviewResponse.data);
      setApplications(applicationResponse.data);
    } catch (err) {
      setAlert({ type: 'danger', message: getErrorMessage(err, 'Unable to load interviews') });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (data) => {
    try {
      if (editingInterview) {
        await interviewApi.update(editingInterview.id, data);
        setAlert({ type: 'success', message: 'Interview updated successfully' });
      } else {
        await interviewApi.create(data);
        setAlert({ type: 'success', message: 'Interview created successfully' });
      }
      setShowModal(false);
      setEditingInterview(null);
      loadData(filters);
    } catch (err) {
      setAlert({ type: 'danger', message: getErrorMessage(err, 'Unable to save interview') });
    }
  };

  const handleDelete = async () => {
    try {
      await interviewApi.remove(deletingInterview.id);
      setAlert({ type: 'success', message: 'Interview deleted successfully' });
      setDeletingInterview(null);
      loadData(filters);
    } catch (err) {
      setAlert({ type: 'danger', message: getErrorMessage(err, 'Unable to delete interview') });
      setDeletingInterview(null);
    }
  };

  const handleStatusChange = async (interview, status) => {
    try {
      await interviewApi.updateStatus(interview.id, { status });
      setAlert({ type: 'success', message: 'Interview status updated successfully' });
      loadData(filters);
    } catch (err) {
      setAlert({ type: 'danger', message: getErrorMessage(err, 'Unable to update interview status') });
    }
  };

  return (
    <>
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Interviews</h1>
          <p className="text-muted mb-0">Schedule and update interview rounds.</p>
        </div>
        <button className="btn btn-primary" type="button" onClick={() => { setEditingInterview(null); setShowModal(true); }}>
          Add Interview
        </button>
      </div>

      <AlertMessage type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

      <form className="card card-body mb-3" onSubmit={(event) => { event.preventDefault(); loadData(filters); }}>
        <div className="row g-2">
          <div className="col-md-7">
            <input name="query" className="form-control" placeholder="Search interviewer, role, company, or location" value={filters.query} onChange={handleFilterChange} />
          </div>
          <div className="col-md-3">
            <select name="status" className="form-select" value={filters.status} onChange={handleFilterChange}>
              <option value="">All statuses</option>
              {INTERVIEW_STATUSES.map((status) => <option key={status} value={status}>{label(status)}</option>)}
            </select>
          </div>
          <div className="col-md-2 d-grid">
            <button className="btn btn-outline-primary" type="submit">Filter</button>
          </div>
        </div>
      </form>

      {loading ? <LoadingSpinner /> : interviews.length === 0 ? (
        <EmptyState title="No interviews found" message="Schedule interviews from your active applications." />
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Company</th>
                  <th>Type</th>
                  <th>Scheduled</th>
                  <th>Status</th>
                  <th>Interviewer</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {interviews.map((interview) => (
                  <tr key={interview.id}>
                    <td>{interview.jobTitle}</td>
                    <td>{interview.companyName}</td>
                    <td>{label(interview.interviewType)}</td>
                    <td>{formatDateTime(interview.scheduledAt)}</td>
                    <td>
                      <select className="form-select form-select-sm" value={interview.status} onChange={(event) => handleStatusChange(interview, event.target.value)}>
                        {INTERVIEW_STATUSES.map((status) => <option key={status} value={status}>{label(status)}</option>)}
                      </select>
                    </td>
                    <td>{interview.interviewerName || '-'}</td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-secondary" type="button" onClick={() => { setEditingInterview(interview); setShowModal(true); }}>Edit</button>
                        <button className="btn btn-outline-danger" type="button" onClick={() => setDeletingInterview(interview)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <InterviewFormModal show={showModal} interview={editingInterview} applications={applications} onClose={() => setShowModal(false)} onSubmit={handleSubmit} />
      <ConfirmModal
        show={Boolean(deletingInterview)}
        title="Delete Interview"
        message={`Delete interview for ${deletingInterview?.jobTitle}?`}
        onCancel={() => setDeletingInterview(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}

export default InterviewsPage;
