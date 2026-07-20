import { useEffect, useState } from 'react';
import { applicationApi } from '../api/applicationApi';
import { documentApi } from '../api/documentApi';
import DocumentFormModal from '../components/documents/DocumentFormModal';
import AlertMessage from '../components/common/AlertMessage';
import ConfirmModal from '../components/common/ConfirmModal';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDateTime, getErrorMessage } from '../utils/format';

function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [showModal, setShowModal] = useState(false);
  const [deletingDocument, setDeletingDocument] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [documentResponse, applicationResponse] = await Promise.all([
        documentApi.getAll(),
        applicationApi.getAll()
      ]);
      setDocuments(documentResponse.data);
      setApplications(applicationResponse.data);
    } catch (err) {
      setAlert({ type: 'danger', message: getErrorMessage(err, 'Unable to load documents') });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (data) => {
    try {
      await documentApi.create(data);
      setAlert({ type: 'success', message: 'Document added successfully' });
      setShowModal(false);
      loadData();
    } catch (err) {
      setAlert({ type: 'danger', message: getErrorMessage(err, 'Unable to save document') });
    }
  };

  const handleDelete = async () => {
    try {
      await documentApi.remove(deletingDocument.id);
      setAlert({ type: 'success', message: 'Document deleted successfully' });
      setDeletingDocument(null);
      loadData();
    } catch (err) {
      setAlert({ type: 'danger', message: getErrorMessage(err, 'Unable to delete document') });
      setDeletingDocument(null);
    }
  };

  return (
    <>
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Documents</h1>
          <p className="text-muted mb-0">Store resume, cover letter, portfolio, and offer links.</p>
        </div>
        <button className="btn btn-primary" type="button" onClick={() => setShowModal(true)}>
          Add Document
        </button>
      </div>

      <AlertMessage type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

      {loading ? <LoadingSpinner /> : documents.length === 0 ? (
        <EmptyState title="No documents found" message="Add document links for your applications." />
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Application</th>
                  <th>Added</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {documents.map((document) => (
                  <tr key={document.id}>
                    <td className="fw-semibold">{document.documentName}</td>
                    <td>{document.documentType}</td>
                    <td>{document.jobTitle || 'General'}</td>
                    <td>{formatDateTime(document.createdAt)}</td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <a className="btn btn-outline-primary" href={document.fileUrl} target="_blank" rel="noreferrer">Open</a>
                        <button className="btn btn-outline-danger" type="button" onClick={() => setDeletingDocument(document)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <DocumentFormModal show={showModal} applications={applications} onClose={() => setShowModal(false)} onSubmit={handleSubmit} />
      <ConfirmModal
        show={Boolean(deletingDocument)}
        title="Delete Document"
        message={`Delete ${deletingDocument?.documentName}?`}
        onCancel={() => setDeletingDocument(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}

export default DocumentsPage;
