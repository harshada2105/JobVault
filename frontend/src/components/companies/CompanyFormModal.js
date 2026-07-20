import { useEffect, useState } from 'react';
import ModalFrame from '../common/ModalFrame';

const emptyCompany = {
  name: '',
  website: '',
  location: '',
  notes: ''
};

function CompanyFormModal({ show, company, onClose, onSubmit }) {
  const [formData, setFormData] = useState(emptyCompany);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    setFormData(company || emptyCompany);
    setValidated(false);
  }, [company, show]);

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
    onSubmit(formData);
  };

  return (
    <ModalFrame
      show={show}
      title={company ? 'Edit Company' : 'Add Company'}
      onClose={onClose}
      footer={(
        <>
          <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" form="company-form">Save Company</button>
        </>
      )}
    >
      <form id="company-form" noValidate className={validated ? 'was-validated' : ''} onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="company-name">Company Name</label>
          <input id="company-name" name="name" className="form-control" value={formData.name || ''} onChange={handleChange} required maxLength="150" />
          <div className="invalid-feedback">Company name is required.</div>
        </div>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="company-website">Website</label>
            <input id="company-website" name="website" className="form-control" value={formData.website || ''} onChange={handleChange} maxLength="255" />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="company-location">Location</label>
            <input id="company-location" name="location" className="form-control" value={formData.location || ''} onChange={handleChange} maxLength="120" />
          </div>
        </div>
        <div className="mt-3">
          <label className="form-label" htmlFor="company-notes">Notes</label>
          <textarea id="company-notes" name="notes" className="form-control" rows="3" value={formData.notes || ''} onChange={handleChange}></textarea>
        </div>
      </form>
    </ModalFrame>
  );
}

export default CompanyFormModal;
