function DashboardCard({ title, value, tone = 'primary' }) {
  return (
    <div className="col-sm-6 col-xl-3">
      <div className={`card border-${tone} h-100`}>
        <div className="card-body">
          <div className="text-muted small">{title}</div>
          <div className="display-6 fw-semibold">{value}</div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard;
