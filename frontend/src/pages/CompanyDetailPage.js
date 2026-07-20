import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { companyApi } from '../api/companyApi';
import AlertMessage from '../components/common/AlertMessage';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDateTime, getErrorMessage } from '../utils/format';

function CompanyDetailPage() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCompany() {
      try {
        setLoading(true);
        const response = await companyApi.getById(id);
        setCompany(response.data);
      } catch (err) {
        setError(getErrorMessage(err, 'Unable to load company'));
      } finally {
        setLoading(false);
      }
    }
    loadCompany();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="mb-4">
        <Link to="/companies" className="btn btn-sm btn-outline-secondary mb-3">Back to Companies</Link>
        <h1 className="h3 mb-1">{company?.name || 'Company'}</h1>
        <p className="text-muted mb-0">Company details and notes.</p>
      </div>

      <AlertMessage type="danger" message={error} onClose={() => setError('')} />

      {company && (
        <div className="card">
          <div className="card-body">
            <dl className="row mb-0">
              <dt className="col-sm-3">Website</dt>
              <dd className="col-sm-9">{company.website ? <a href={company.website} target="_blank" rel="noreferrer">{company.website}</a> : '-'}</dd>
              <dt className="col-sm-3">Location</dt>
              <dd className="col-sm-9">{company.location || '-'}</dd>
              <dt className="col-sm-3">Notes</dt>
              <dd className="col-sm-9">{company.notes || '-'}</dd>
              <dt className="col-sm-3">Created</dt>
              <dd className="col-sm-9">{formatDateTime(company.createdAt)}</dd>
              <dt className="col-sm-3">Updated</dt>
              <dd className="col-sm-9">{formatDateTime(company.updatedAt)}</dd>
            </dl>
          </div>
        </div>
      )}
    </>
  );
}

export default CompanyDetailPage;
