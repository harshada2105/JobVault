import { useCallback, useEffect, useState } from 'react';
import { companyApi } from '../api/companyApi';
import { contactApi } from '../api/contactApi';
import ContactFormModal from '../components/contacts/ContactFormModal';
import AlertMessage from '../components/common/AlertMessage';
import ConfirmModal from '../components/common/ConfirmModal';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getErrorMessage } from '../utils/format';

function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [deletingContact, setDeletingContact] = useState(null);

  const loadData = useCallback(async (activeQuery = '') => {
    try {
      setLoading(true);
      const [contactResponse, companyResponse] = await Promise.all([
        contactApi.getAll(activeQuery ? { query: activeQuery } : {}),
        companyApi.getAll()
      ]);
      setContacts(contactResponse.data);
      setCompanies(companyResponse.data);
    } catch (err) {
      setAlert({ type: 'danger', message: getErrorMessage(err, 'Unable to load contacts') });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (data) => {
    try {
      if (editingContact) {
        await contactApi.update(editingContact.id, data);
        setAlert({ type: 'success', message: 'Contact updated successfully' });
      } else {
        await contactApi.create(data);
        setAlert({ type: 'success', message: 'Contact created successfully' });
      }
      setShowModal(false);
      setEditingContact(null);
      loadData(query);
    } catch (err) {
      setAlert({ type: 'danger', message: getErrorMessage(err, 'Unable to save contact') });
    }
  };

  const handleDelete = async () => {
    try {
      await contactApi.remove(deletingContact.id);
      setAlert({ type: 'success', message: 'Contact deleted successfully' });
      setDeletingContact(null);
      loadData(query);
    } catch (err) {
      setAlert({ type: 'danger', message: getErrorMessage(err, 'Unable to delete contact') });
      setDeletingContact(null);
    }
  };

  return (
    <>
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Contacts</h1>
          <p className="text-muted mb-0">Keep recruiter and hiring manager details together.</p>
        </div>
        <button className="btn btn-primary" type="button" onClick={() => { setEditingContact(null); setShowModal(true); }}>
          Add Contact
        </button>
      </div>

      <AlertMessage type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

      <form className="card card-body mb-3" onSubmit={(event) => { event.preventDefault(); loadData(query); }}>
        <div className="row g-2">
          <div className="col-md-10">
            <input className="form-control" placeholder="Search contacts, roles, email, or company" value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <div className="col-md-2 d-grid">
            <button className="btn btn-outline-primary" type="submit">Search</button>
          </div>
        </div>
      </form>

      {loading ? <LoadingSpinner /> : contacts.length === 0 ? (
        <EmptyState title="No contacts found" message="Add useful contacts for your target companies." />
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact.id}>
                    <td className="fw-semibold">{contact.name}</td>
                    <td>{contact.companyName}</td>
                    <td>{contact.roleTitle || '-'}</td>
                    <td>{contact.email ? <a href={`mailto:${contact.email}`}>{contact.email}</a> : '-'}</td>
                    <td>{contact.phone || '-'}</td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-secondary" type="button" onClick={() => { setEditingContact(contact); setShowModal(true); }}>Edit</button>
                        <button className="btn btn-outline-danger" type="button" onClick={() => setDeletingContact(contact)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ContactFormModal show={showModal} contact={editingContact} companies={companies} onClose={() => setShowModal(false)} onSubmit={handleSubmit} />
      <ConfirmModal
        show={Boolean(deletingContact)}
        title="Delete Contact"
        message={`Delete ${deletingContact?.name}?`}
        onCancel={() => setDeletingContact(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}

export default ContactsPage;
