import React from 'react';
import '../../pagesstyles/DeleteConfirmationModal.css';

/**
 * DeleteConfirmationModal Component
 * * A reusable UI modal used to safeguard destructive actions. 
 * It forces a user confirmation before executing a deletion, displaying 
 * the specific name of the item to be removed.
 */
const DeleteConfirmationModal = ({ show, onConfirm, onCancel, itemName }) => {
    
    /**
     * Conditional Rendering
     * If the 'show' prop is false, the component returns null to 
     * keep the modal hidden from the DOM.
     */
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