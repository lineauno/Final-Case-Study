import React from 'react';
import '../../pagesstyles/SuccessModal.css';

const SuccessModal = ({ show, message, onClose }) => {
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