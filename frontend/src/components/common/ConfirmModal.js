import ModalFrame from './ModalFrame';

function ConfirmModal({ show, title, message, onConfirm, onCancel }) {
  return (
    <ModalFrame
      show={show}
      title={title}
      onClose={onCancel}
      footer={(
        <>
          <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
          <button type="button" className="btn btn-danger" onClick={onConfirm}>Delete</button>
        </>
      )}
    >
      <p className="mb-0">{message}</p>
    </ModalFrame>
  );
}

export default ConfirmModal;
