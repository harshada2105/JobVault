import { useEffect, useState } from 'react';
import { INTERVIEW_STATUSES, INTERVIEW_TYPES, label } from '../../utils/constants';
import { toDateTimeLocal } from '../../utils/format';
import ModalFrame from '../common/ModalFrame';

const emptyInterview = {
  applicationId: '',
  interviewType: 'VIDEO',
  scheduledAt: '',
  interviewerName: '',
  meetingLink: '',
  location: '',
  status: 'SCHEDULED',
  notes: ''
};

function InterviewFormModal({ show, interview, applications, onClose, onSubmit }) {
  const [formData, setFormData] = useState(emptyInterview);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (interview) {
      setFormData({
        ...emptyInterview,
        ...interview,
        applicationId: interview.applicationId || '',
        scheduledAt: toDateTimeLocal(interview.scheduledAt)
      });
    } else {
      setFormData(emptyInterview);
    }
    setValidated(false);
  }, [interview, show]);

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
      applicationId: Number(formData.applicationId),
      scheduledAt: formData.scheduledAt
    });
  };

  return (
    <ModalFrame
      show={show}
      title={interview ? 'Edit Interview' : 'Add Interview'}
      onClose={onClose}
      size="modal-lg"
      footer={(
        <>
          <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" form="interview-form">Save Interview</button>
        </>
      )}
    >
      <form id="interview-form" noValidate className={validated ? 'was-validated' : ''} onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="interview-application">Application</label>
            <select id="interview-application" name="applicationId" className="form-select" value={formData.applicationId || ''} onChange={handleChange} required>
              <option value="">Select application</option>
              {applications.map((application) => (
                <option key={application.id} value={application.id}>{application.jobTitle} at {application.companyName}</option>
              ))}
            </select>
            <div className="invalid-feedback">Application is required.</div>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="interview-time">Scheduled At</label>
            <input id="interview-time" type="datetime-local" name="scheduledAt" className="form-control" value={formData.scheduledAt || ''} onChange={handleChange} required />
            <div className="invalid-feedback">Scheduled date and time are required.</div>
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="interview-type">Type</label>
            <select id="interview-type" name="interviewType" className="form-select" value={formData.interviewType} onChange={handleChange} required>
              {INTERVIEW_TYPES.map((type) => <option key={type} value={type}>{label(type)}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="interview-status">Status</label>
            <select id="interview-status" name="status" className="form-select" value={formData.status} onChange={handleChange} required>
              {INTERVIEW_STATUSES.map((status) => <option key={status} value={status}>{label(status)}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="interview-person">Interviewer</label>
            <input id="interview-person" name="interviewerName" className="form-control" value={formData.interviewerName || ''} onChange={handleChange} maxLength="120" />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="interview-link">Meeting Link</label>
            <input id="interview-link" name="meetingLink" className="form-control" value={formData.meetingLink || ''} onChange={handleChange} maxLength="255" />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="interview-location">Location</label>
            <input id="interview-location" name="location" className="form-control" value={formData.location || ''} onChange={handleChange} maxLength="120" />
          </div>
        </div>
        <div className="mt-3">
          <label className="form-label" htmlFor="interview-notes">Notes</label>
          <textarea id="interview-notes" name="notes" className="form-control" rows="3" value={formData.notes || ''} onChange={handleChange}></textarea>
        </div>
      </form>
    </ModalFrame>
  );
}

export default InterviewFormModal;
