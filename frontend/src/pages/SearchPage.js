import { useState } from 'react';
import { Link } from 'react-router-dom';
import { searchApi } from '../api/searchApi';
import StatusBadge from '../components/applications/StatusBadge';
import AlertMessage from '../components/common/AlertMessage';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getErrorMessage } from '../utils/format';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError('');
      const response = await searchApi.search(query);
      setResults(response.data);
    } catch (err) {
      setError(getErrorMessage(err, 'Search failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-4">
        <h1 className="h3 mb-1">Search</h1>
        <p className="text-muted mb-0">Search across companies, applications, interviews, and contacts.</p>
      </div>

      <AlertMessage type="danger" message={error} onClose={() => setError('')} />

      <form className="card card-body mb-4" onSubmit={handleSearch}>
        <div className="row g-2">
          <div className="col-md-10">
            <input className="form-control" placeholder="Search JobVault" value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <div className="col-md-2 d-grid">
            <button className="btn btn-primary" type="submit">Search</button>
          </div>
        </div>
      </form>

      {loading && <LoadingSpinner />}

      {!loading && !results && <EmptyState title="Search JobVault" message="Enter a search term to find records." />}

      {!loading && results && (
        <div className="row g-4">
          <div className="col-lg-6">
            <ResultCard title="Applications">
              {results.applications.length === 0 ? <p className="text-muted mb-0">No applications found.</p> : (
                <div className="list-group">
                  {results.applications.map((item) => (
                    <Link key={item.id} to={`/applications/${item.id}`} className="list-group-item list-group-item-action">
                      <div className="d-flex justify-content-between">
                        <strong>{item.jobTitle}</strong>
                        <StatusBadge status={item.status} />
                      </div>
                      <div className="text-muted small">{item.companyName}</div>
                    </Link>
                  ))}
                </div>
              )}
            </ResultCard>
          </div>
          <div className="col-lg-6">
            <ResultCard title="Companies">
              {results.companies.length === 0 ? <p className="text-muted mb-0">No companies found.</p> : (
                <div className="list-group">
                  {results.companies.map((item) => (
                    <Link key={item.id} to={`/companies/${item.id}`} className="list-group-item list-group-item-action">
                      <strong>{item.name}</strong>
                      <div className="text-muted small">{item.location || 'No location'}</div>
                    </Link>
                  ))}
                </div>
              )}
            </ResultCard>
          </div>
          <div className="col-lg-6">
            <ResultCard title="Interviews">
              {results.interviews.length === 0 ? <p className="text-muted mb-0">No interviews found.</p> : (
                <div className="list-group">
                  {results.interviews.map((item) => (
                    <div key={item.id} className="list-group-item">
                      <strong>{item.jobTitle}</strong>
                      <div className="text-muted small">{item.companyName}</div>
                    </div>
                  ))}
                </div>
              )}
            </ResultCard>
          </div>
          <div className="col-lg-6">
            <ResultCard title="Contacts">
              {results.contacts.length === 0 ? <p className="text-muted mb-0">No contacts found.</p> : (
                <div className="list-group">
                  {results.contacts.map((item) => (
                    <div key={item.id} className="list-group-item">
                      <strong>{item.name}</strong>
                      <div className="text-muted small">{item.companyName} {item.email ? `- ${item.email}` : ''}</div>
                    </div>
                  ))}
                </div>
              )}
            </ResultCard>
          </div>
        </div>
      )}
    </>
  );
}

function ResultCard({ title, children }) {
  return (
    <div className="card h-100">
      <div className="card-header bg-white">
        <h2 className="h5 mb-0">{title}</h2>
      </div>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}

export default SearchPage;
