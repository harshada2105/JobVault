import { useEffect, useState } from 'react';
import { APPLICATION_STATUSES, EMPLOYMENT_TYPES, PRIORITIES, label } from '../../utils/constants';
import ModalFrame from '../common/ModalFrame';

const emptyApplication = {
  companyId: '',
  jobTitle: '',
  jobUrl: '',
  employmentType: 'FULL_TIME',
  location: '',
  salaryRange: '',
  status: 'SAVED',
  priority: 'MEDIUM',
  appliedDate: '',
  deadlineDate: '',
  notes: ''
};

function ApplicationFormModal({ show, application, companies, onClose, onSubmit }) {
  const [formData, setFormData] = useState(emptyApplication);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (application) {
      setFormData({
        ...emptyApplication,
        ...application,
        companyId: application.companyId || '',
        appliedDate: application.appliedDate || '',
        deadlineDate: application.deadlineDate || ''
      });
    } else {
      setFormData(emptyApplication);
    }
    setValidated(false);
  }, [application, show]);

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
      companyId: Number(formData.companyId),
      appliedDate: formData.appliedDate || null,
      deadlineDate: formData.deadlineDate || null
    });
  };

  return (
    <ModalFrame
      show={show}
      title={application ? 'Edit Application' : 'Add Application'}
      onClose={onClose}
      size="modal-lg"
      footer={(
        <>
          <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" form="application-form">Save Application</button>
        </>
      )}
    >
      <form id="application-form" noValidate className={validated ? 'was-validated' : ''} onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="application-company">Company</label>
            <select id="application-company" name="companyId" className="form-select" value={formData.companyId || ''} onChange={handleChange} required>
              <option value="">Select company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>{company.name}</option>
              ))}
            </select>
            <div className="invalid-feedback">Company is required.</div>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="application-title">Job Title</label>
            <input id="application-title" name="jobTitle" className="form-control" value={formData.jobTitle || ''} onChange={handleChange} required maxLength="160" />
            <div className="invalid-feedback">Job title is required.</div>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="application-type">Employment Type</label>
            <select id="application-type" name="employmentType" className="form-select" value={formData.employmentType} onChange={handleChange} required>
              {EMPLOYMENT_TYPES.map((type) => <option key={type} value={type}>{label(type)}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="application-url">Job URL</label>
            <input id="application-url" name="jobUrl" className="form-control" value={formData.jobUrl || ''} onChange={handleChange} maxLength="255" />
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="application-status">Status</label>
            <select id="application-status" name="status" className="form-select" value={formData.status} onChange={handleChange} required>
              {APPLICATION_STATUSES.map((status) => <option key={status} value={status}>{label(status)}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="application-priority">Priority</label>
            <select id="application-priority" name="priority" className="form-select" value={formData.priority} onChange={handleChange} required>
              {PRIORITIES.map((priority) => <option key={priority} value={priority}>{label(priority)}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="application-location">Location</label>
            <input id="application-location" name="location" className="form-control" value={formData.location || ''} onChange={handleChange} maxLength="120" />
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="application-salary">Salary Range</label>
            <input id="application-salary" name="salaryRange" className="form-control" value={formData.salaryRange || ''} onChange={handleChange} maxLength="80" />
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="application-applied">Applied Date</label>
            <input id="application-applied" type="date" name="appliedDate" className="form-control" value={formData.appliedDate || ''} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="application-deadline">Deadline Date</label>
            <input id="application-deadline" type="date" name="deadlineDate" className="form-control" value={formData.deadlineDate || ''} onChange={handleChange} />
          </div>
        </div>
        <div className="mt-3">
          <label className="form-label" htmlFor="application-notes">Notes</label>
          <textarea id="application-notes" name="notes" className="form-control" rows="3" value={formData.notes || ''} onChange={handleChange}></textarea>
        </div>
      </form>
    </ModalFrame>
  );
}

export default ApplicationFormModal;
