import { label } from '../../utils/constants';

const classes = {
  LOW: 'success',
  MEDIUM: 'warning',
  HIGH: 'danger'
};

function PriorityBadge({ priority }) {
  return <span className={`badge text-bg-${classes[priority] || 'secondary'}`}>{label(priority)}</span>;
}

export default PriorityBadge;
