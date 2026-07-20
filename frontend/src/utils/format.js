export function formatDate(value) {
  if (!value) {
    return '-';
  }
  return new Date(value).toLocaleDateString();
}

export function formatDateTime(value) {
  if (!value) {
    return '-';
  }
  return new Date(value).toLocaleString();
}

export function toDateTimeLocal(value) {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16);
}

export function getErrorMessage(error, fallback = 'Something went wrong') {
  if (error?.response?.data?.validationErrors) {
    return Object.values(error.response.data.validationErrors).join(' ');
  }
  return error?.response?.data?.message || fallback;
}
