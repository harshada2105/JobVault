import { useEffect, useState } from 'react';
import ModalFrame from '../common/ModalFrame';

const emptyContact = {
  companyId: '',
  name: '',
  email: '',
  phone: '',
  roleTitle: '',
  linkedinUrl: '',
  notes: ''
};

function ContactFormModal({ show, contact, companies, onClose, onSubmit }) {
  const [formData, setFormData] = useState(emptyContact);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (contact) {
      setFormData({ ...emptyContact, ...contact, companyId: contact.companyId || '' });
    } else {
      setFormData(emptyContact);
    }
    setValidated(false);
  }, [contact, show]);

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
    onSubmit({ ...formData, companyId: Number(formData.companyId) });
  };

  return (
    <ModalFrame
      show={show}
      title={contact ? 'Edit Contact' : 'Add Contact'}
      onClose={onClose}
      size="modal-lg"
      footer={(
        <>
          <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" form="contact-form">Save Contact</button>
        </>
      )}
    >
      <form id="contact-form" noValidate className={validated ? 'was-validated' : ''} onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="contact-company">Company</label>
            <select id="contact-company" name="companyId" className="form-select" value={formData.companyId || ''} onChange={handleChange} required>
              <option value="">Select company</option>
              {companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
            </select>
            <div className="invalid-feedback">Company is required.</div>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="contact-name">Name</label>
            <input id="contact-name" name="name" className="form-control" value={formData.name || ''} onChange={handleChange} required maxLength="120" />
            <div className="invalid-feedback">Contact name is required.</div>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="contact-email">Email</label>
            <input id="contact-email" type="email" name="email" className="form-control" value={formData.email || ''} onChange={handleChange} maxLength="150" />
            <div className="invalid-feedback">Enter a valid email address.</div>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="contact-phone">Phone</label>
            <input id="contact-phone" name="phone" className="form-control" value={formData.phone || ''} onChange={handleChange} maxLength="30" />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="contact-role">Role</label>
            <input id="contact-role" name="roleTitle" className="form-control" value={formData.roleTitle || ''} onChange={handleChange} maxLength="120" />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="contact-linkedin">LinkedIn URL</label>
            <input id="contact-linkedin" name="linkedinUrl" className="form-control" value={formData.linkedinUrl || ''} onChange={handleChange} maxLength="255" />
          </div>
        </div>
        <div className="mt-3">
          <label className="form-label" htmlFor="contact-notes">Notes</label>
          <textarea id="contact-notes" name="notes" className="form-control" rows="3" value={formData.notes || ''} onChange={handleChange}></textarea>
        </div>
      </form>
    </ModalFrame>
  );
}

export default ContactFormModal;
