import React from 'react';
import '../../pagesstyles/SuccessModal.css';

/**
 * SuccessModal Component
 * * A reusable feedback modal designed to acknowledge successful user operations.
 * It renders a themed overlay with a personalized message and a celebration 
 * visual, ensuring the user is informed of positive transaction outcomes.
 */
const SuccessModal = ({ show, message, onClose }) => {
    
    /**
     * Conditional Rendering Handler
     * Prevents the component from occupying DOM space when the 'show' prop is false.
     */
    if (!show) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content success-theme">
                <div className="success-icon-container">
                    🎉
                </div>
                <h3 className="modal-header success-text">Success!</h3>
                <p className="modal-body">{message}</p>
                <button onClick={onClose} className="success-button">
                    Awesome
                </button>
            </div>
        </div>
    );
};

export default SuccessModal;