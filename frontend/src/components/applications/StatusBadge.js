import { label } from '../../utils/constants';

const classes = {
  SAVED: 'secondary',
  APPLIED: 'primary',
  SCREENING: 'info',
  INTERVIEW: 'warning',
  OFFER: 'success',
  REJECTED: 'danger',
  WITHDRAWN: 'dark'
};

function StatusBadge({ status }) {
  return <span className={`badge text-bg-${classes[status] || 'secondary'}`}>{label(status)}</span>;
}

export default StatusBadge;
