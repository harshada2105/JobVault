import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { companyApi } from '../api/companyApi';
import AlertMessage from '../components/common/AlertMessage';
import ConfirmModal from '../components/common/ConfirmModal';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CompanyFormModal from '../components/companies/CompanyFormModal';
import { formatDate, getErrorMessage } from '../utils/format';

function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [deletingCompany, setDeletingCompany] = useState(null);

  const loadCompanies = useCallback(async (activeQuery = '') => {
    try {
      setLoading(true);
      const response = await companyApi.getAll(activeQuery ? { query: activeQuery } : {});
      setCompanies(response.data);
    } catch (err) {
      setAlert({ type: 'danger', message: getErrorMessage(err, 'Unable to load companies') });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  const handleSubmit = async (data) => {
    try {
      if (editingCompany) {
        await companyApi.update(editingCompany.id, data);
        setAlert({ type: 'success', message: 'Company updated successfully' });
      } else {
        await companyApi.create(data);
        setAlert({ type: 'success', message: 'Company created successfully' });
      }
      setShowModal(false);
      setEditingCompany(null);
      loadCompanies(query);
    } catch (err) {
      setAlert({ type: 'danger', message: getErrorMessage(err, 'Unable to save company') });
    }
  };

  const handleDelete = async () => {
    try {
      await companyApi.remove(deletingCompany.id);
      setAlert({ type: 'success', message: 'Company deleted successfully' });
      setDeletingCompany(null);
      loadCompanies(query);
    } catch (err) {
      setAlert({ type: 'danger', message: getErrorMessage(err, 'Unable to delete company') });
      setDeletingCompany(null);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    loadCompanies(query);
  };

  return (
    <>
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Companies</h1>
          <p className="text-muted mb-0">Manage employers and organization notes.</p>
        </div>
        <button className="btn btn-primary" type="button" onClick={() => { setEditingCompany(null); setShowModal(true); }}>
          Add Company
        </button>
      </div>

      <AlertMessage type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

      <form className="card card-body mb-3" onSubmit={handleSearch}>
        <div className="row g-2">
          <div className="col-md-10">
            <input className="form-control" placeholder="Search companies by name, location, or notes" value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <div className="col-md-2 d-grid">
            <button className="btn btn-outline-primary" type="submit">Search</button>
          </div>
        </div>
      </form>

      {loading ? <LoadingSpinner /> : companies.length === 0 ? (
        <EmptyState title="No companies found" message="Add companies before creating job applications." />
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Website</th>
                  <th>Created</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company.id}>
                    <td className="fw-semibold">{company.name}</td>
                    <td>{company.location || '-'}</td>
                    <td>{company.website ? <a href={company.website} target="_blank" rel="noreferrer">{company.website}</a> : '-'}</td>
                    <td>{formatDate(company.createdAt)}</td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <Link className="btn btn-outline-primary" to={`/companies/${company.id}`}>View</Link>
                        <button className="btn btn-outline-secondary" type="button" onClick={() => { setEditingCompany(company); setShowModal(true); }}>Edit</button>
                        <button className="btn btn-outline-danger" type="button" onClick={() => setDeletingCompany(company)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CompanyFormModal show={showModal} company={editingCompany} onClose={() => setShowModal(false)} onSubmit={handleSubmit} />
      <ConfirmModal
        show={Boolean(deletingCompany)}
        title="Delete Company"
        message={`Delete ${deletingCompany?.name}?`}
        onCancel={() => setDeletingCompany(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}

export default CompaniesPage;
