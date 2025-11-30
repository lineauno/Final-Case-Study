import React from 'react';
import '../../pagesstyles/DeleteConfirmationModal.css'; // Importing the CSS we just made

const DeleteConfirmationModal = ({ show, onConfirm, onCancel, itemName }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h3 className="modal-header">Confirm Deletion</h3>
                <p className="modal-body">
                    Are you sure you want to permanently delete: 
                    <br />
                    <strong>"{itemName}"</strong>
                </p>
                <div className="modal-actions">
                    <button onClick={onCancel} className="cancel-button">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="confirm-button">
                        Yes, Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;