import { useEffect, useState } from 'react';
import ModalFrame from '../common/ModalFrame';

const emptyDocument = {
  applicationId: '',
  documentName: '',
  documentType: 'Resume',
  fileUrl: ''
};

function DocumentFormModal({ show, applications, onClose, onSubmit }) {
  const [formData, setFormData] = useState(emptyDocument);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    setFormData(emptyDocument);
    setValidated(false);
  }, [show]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      setValidated(true);
      return;
    }
    onSubmit({
      ...formData,
      applicationId: formData.applicationId ? Number(formData.applicationId) : null
    });
  };

  return (
    <ModalFrame
      show={show}
      title="Add Document"
      onClose={onClose}
      footer={(
        <>
          <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" form="document-form">Save Document</button>
        </>
      )}
    >
      <form id="document-form" noValidate className={validated ? 'was-validated' : ''} onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="document-application">Application</label>
          <select id="document-application" name="applicationId" className="form-select" value={formData.applicationId || ''} onChange={handleChange}>
            <option value="">General document</option>
            {applications.map((application) => (
              <option key={application.id} value={application.id}>{application.jobTitle} at {application.companyName}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="document-name">Document Name</label>
          <input id="document-name" name="documentName" className="form-control" value={formData.documentName || ''} onChange={handleChange} required maxLength="150" />
          <div className="invalid-feedback">Document name is required.</div>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="document-type">Document Type</label>
          <input id="document-type" name="documentType" className="form-control" value={formData.documentType || ''} onChange={handleChange} required maxLength="60" />
          <div className="invalid-feedback">Document type is required.</div>
        </div>
        <div>
          <label className="form-label" htmlFor="document-url">File URL</label>
          <input id="document-url" name="fileUrl" className="form-control" value={formData.fileUrl || ''} onChange={handleChange} required maxLength="255" />
          <div className="invalid-feedback">File URL is required.</div>
        </div>
      </form>
    </ModalFrame>
  );
}

export default DocumentFormModal;
