function LoadingSpinner({ fullPage = false }) {
  return (
    <div className={fullPage ? 'vh-100 d-flex align-items-center justify-content-center' : 'py-5 text-center'}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export default LoadingSpinner;
