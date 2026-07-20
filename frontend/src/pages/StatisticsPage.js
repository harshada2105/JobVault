import { useEffect, useState } from 'react';
import { dashboardApi } from '../api/dashboardApi';
import AlertMessage from '../components/common/AlertMessage';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { label } from '../utils/constants';
import { getErrorMessage } from '../utils/format';

function StatisticsPage() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadStatistics() {
      try {
        setLoading(true);
        const response = await dashboardApi.statistics();
        setStatistics(response.data);
      } catch (err) {
        setError(getErrorMessage(err, 'Unable to load statistics'));
      } finally {
        setLoading(false);
      }
    }
    loadStatistics();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="mb-4">
        <h1 className="h3 mb-1">Statistics</h1>
        <p className="text-muted mb-0">Measure application outcomes and priorities.</p>
      </div>

      <AlertMessage type="danger" message={error} onClose={() => setError('')} />

      {statistics && (
        <div className="row g-4">
          <StatsCard title="Applications by Status" items={statistics.applicationsByStatus} />
          <StatsCard title="Applications by Priority" items={statistics.applicationsByPriority} />
          <StatsCard title="Interviews by Status" items={statistics.interviewsByStatus} />
        </div>
      )}
    </>
  );
}

function StatsCard({ title, items }) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  return (
    <div className="col-lg-4">
      <div className="card h-100">
        <div className="card-header bg-white">
          <h2 className="h5 mb-0">{title}</h2>
        </div>
        <div className="card-body">
          {items.map((item) => {
            const percent = total ? Math.round((item.value / total) * 100) : 0;
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
  );
}

export default StatisticsPage;
