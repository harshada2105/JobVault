import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { applicationApi } from '../api/applicationApi';
import { companyApi } from '../api/companyApi';
import StatusBadge from '../components/applications/StatusBadge';
import PriorityBadge from '../components/applications/PriorityBadge';
import ApplicationFormModal from '../components/applications/ApplicationFormModal';
import AlertMessage from '../components/common/AlertMessage';
import ConfirmModal from '../components/common/ConfirmModal';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { APPLICATION_STATUSES, PRIORITIES, label } from '../utils/constants';
import { formatDate, getErrorMessage } from '../utils/format';

function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [filters, setFilters] = useState({ query: '', status: '', priority: '', companyId: '' });
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [showModal, setShowModal] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);
  const [deletingApplication, setDeletingApplication] = useState(null);

  const loadData = useCallback(async (activeFilters = {}) => {
    try {
      setLoading(true);
      const params = Object.fromEntries(Object.entries(activeFilters).filter(([, value]) => value));
      const [applicationResponse, companyResponse] = await Promise.all([
        applicationApi.getAll(params),
        companyApi.getAll()
      ]);
      setApplications(applicationResponse.data);
      setCompanies(companyResponse.data);
    } catch (err) {
      setAlert({ type: 'danger', message: getErrorMessage(err, 'Unable to load applications') });
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

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    loadData(filters);
  };

  const handleSubmit = async (data) => {
    try {
      if (editingApplication) {
        await applicationApi.update(editingApplication.id, data);
        setAlert({ type: 'success', message: 'Application updated successfully' });
      } else {
        await applicationApi.create(data);
        setAlert({ type: 'success', message: 'Application created successfully' });
      }
      setShowModal(false);
      setEditingApplication(null);
      loadData(filters);
    } catch (err) {
      setAlert({ type: 'danger', message: getErrorMessage(err, 'Unable to save application') });
    }
  };

  const handleDelete = async () => {
    try {
      await applicationApi.remove(deletingApplication.id);
      setAlert({ type: 'success', message: 'Application deleted successfully' });
      setDeletingApplication(null);
      loadData(filters);
    } catch (err) {
      setAlert({ type: 'danger', message: getErrorMessage(err, 'Unable to delete application') });
      setDeletingApplication(null);
    }
  };

  const handleStatusChange = async (application, status) => {
    try {
      await applicationApi.updateStatus(application.id, { status, note: 'Updated from applications list' });
      setAlert({ type: 'success', message: 'Status updated successfully' });
      loadData(filters);
    } catch (err) {
      setAlert({ type: 'danger', message: getErrorMessage(err, 'Unable to update status') });
    }
  };

  return (
    <>
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Job Applications</h1>
          <p className="text-muted mb-0">Track every role from saved to offer.</p>
        </div>
        <button className="btn btn-primary" type="button" onClick={() => { setEditingApplication(null); setShowModal(true); }}>
          Add Application
        </button>
      </div>

      <AlertMessage type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

      <form className="card card-body mb-3" onSubmit={handleFilterSubmit}>
        <div className="row g-2">
          <div className="col-lg-4">
            <input name="query" className="form-control" placeholder="Search title, company, location, notes" value={filters.query} onChange={handleFilterChange} />
          </div>
          <div className="col-sm-4 col-lg-2">
            <select name="status" className="form-select" value={filters.status} onChange={handleFilterChange}>
              <option value="">All statuses</option>
              {APPLICATION_STATUSES.map((status) => <option key={status} value={status}>{label(status)}</option>)}
            </select>
          </div>
          <div className="col-sm-4 col-lg-2">
            <select name="priority" className="form-select" value={filters.priority} onChange={handleFilterChange}>
              <option value="">All priorities</option>
              {PRIORITIES.map((priority) => <option key={priority} value={priority}>{label(priority)}</option>)}
            </select>
          </div>
          <div className="col-sm-4 col-lg-2">
            <select name="companyId" className="form-select" value={filters.companyId} onChange={handleFilterChange}>
              <option value="">All companies</option>
              {companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
            </select>
          </div>
          <div className="col-lg-2 d-grid">
            <button className="btn btn-outline-primary" type="submit">Apply Filters</button>
          </div>
        </div>
      </form>

      {loading ? <LoadingSpinner /> : applications.length === 0 ? (
        <EmptyState title="No applications found" message="Add a job application or adjust your filters." />
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Applied</th>
                  <th>Deadline</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr key={application.id}>
                    <td className="fw-semibold">{application.jobTitle}</td>
                    <td>{application.companyName}</td>
                    <td>
                      <select className="form-select form-select-sm" value={application.status} onChange={(event) => handleStatusChange(application, event.target.value)}>
                        {APPLICATION_STATUSES.map((status) => <option key={status} value={status}>{label(status)}</option>)}
                      </select>
                      <div className="mt-1"><StatusBadge status={application.status} /></div>
                    </td>
                    <td><PriorityBadge priority={application.priority} /></td>
                    <td>{formatDate(application.appliedDate)}</td>
                    <td>{formatDate(application.deadlineDate)}</td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <Link className="btn btn-outline-primary" to={`/applications/${application.id}`}>View</Link>
                        <button className="btn btn-outline-secondary" type="button" onClick={() => { setEditingApplication(application); setShowModal(true); }}>Edit</button>
                        <button className="btn btn-outline-danger" type="button" onClick={() => setDeletingApplication(application)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ApplicationFormModal
        show={showModal}
        application={editingApplication}
        companies={companies}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />
      <ConfirmModal
        show={Boolean(deletingApplication)}
        title="Delete Application"
        message={`Delete ${deletingApplication?.jobTitle}? Related interviews, documents, and status history will also be removed.`}
        onCancel={() => setDeletingApplication(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}

export default ApplicationsPage;
