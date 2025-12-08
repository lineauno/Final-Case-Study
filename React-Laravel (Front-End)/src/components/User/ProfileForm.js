import React, { useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

/**
 * ProfileForm Component
 * Renders an interface for authenticated users to update their account details.
 * Manages form state, input validation feedback from the server, and 
 * conditional password persistence logic.
 */
function ProfileForm({ initialData }) {
    const { setUser } = useAuth();
    
    /**
     * Component State Management
     * - formData: Synchronizes local input values for name, email, and password.
     * - status flags: Tracks submission progress, global messages, and errors.
     * - validationErrors: Stores specific field-level errors returned by the backend.
     */
    const [formData, setFormData] = useState({
        name: initialData.name,
        email: initialData.email,
        password: '',
        password_confirmation: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    /**
     * Generic input change handler.
     * Updates form state and proactively clears validation errors for the targeted field.
     */
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setValidationErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: null }));
    };

    /**
     * Profile Update Submission Logic
     * Filters out blank password fields to avoid unintentional overwrites.
     * Dispatches data to the profile service and updates the global AuthContext 
     * with the refreshed user record upon success.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');
        setIsError(false);
        setValidationErrors({});

        const updateData = Object.fromEntries(
            Object.entries(formData).filter(([key, value]) => key !== 'password' || value)
        );

        try {
            const response = await api.updateProfile(updateData);
            
            setUser(response.user); 
            setMessage('Profile updated successfully!');
            setFormData(prev => ({ ...prev, password: '', password_confirmation: '' }));
        } catch (err) {
            if (err.response && err.response.status === 422) {
                if (err.response.data && err.response.data.errors) {
                    setValidationErrors(err.response.data.errors);
                    setMessage('Please check the highlighted fields for errors.');
                } else {
                    setMessage('Validation failed. Check server response.');
                }
                setIsError(true);
            } else {
                setMessage(err.message || 'Failed to update profile due to a server error.');
                setIsError(true);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="profile-update-form">
            {(message || isError) && (
                <div className={isError ? "error-message" : "success-message"}>{message}</div>
            )}
            
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            {validationErrors.name && <p className="validation-error">{validationErrors.name[0]}</p>}
            
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            {validationErrors.email && <p className="validation-error">{validationErrors.email[0]}</p>}
            
            <label>New Password (Leave blank to keep current)</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} />
            {validationErrors.password && <p className="validation-error">{validationErrors.password[0]}</p>}
            
            <label>Confirm New Password</label>
            <input type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} />
            {validationErrors.password_confirmation && <p className="validation-error">{validationErrors.password_confirmation[0]}</p>}

            <button type="submit" disabled={isSubmitting} className="save-changes-btn" style={{ marginTop: '1.5rem' }}>
                {isSubmitting ? 'Updating...' : 'Save Changes'}
            </button>
        </form>
    );
}

export default ProfileForm;