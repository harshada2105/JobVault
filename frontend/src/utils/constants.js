export const APPLICATION_STATUSES = ['SAVED', 'APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN'];
export const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];
export const EMPLOYMENT_TYPES = ['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT', 'REMOTE'];
export const INTERVIEW_TYPES = ['PHONE', 'VIDEO', 'TECHNICAL', 'HR', 'ONSITE'];
export const INTERVIEW_STATUSES = ['SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'];

export function label(value) {
  if (!value) {
    return '';
  }
  return value
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
