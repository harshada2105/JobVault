function EmptyState({ title = 'No records found', message = 'Add a record to get started.' }) {
  return (
    <div className="text-center bg-white border rounded p-5">
      <h2 className="h5">{title}</h2>
      <p className="text-muted mb-0">{message}</p>
    </div>
  );
}

export default EmptyState;
