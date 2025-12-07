import React, { useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

// ProfileForm component handles user profile data submission (name, email, and optional password change)
function ProfileForm({ initialData }) {
    const { setUser } = useAuth();
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setValidationErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: null }));
    };

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
            {/* Conditional rendering for status messages (success or error) */}
            {(message || isError) && (
                <div className={isError ? "error-message" : "success-message"}>{message}</div>
            )}
            
            {/* Name Input Field */}
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            {/* Display validation error for the name field if present */}
            {validationErrors.name && <p className="validation-error">{validationErrors.name[0]}</p>}
            
            {/* Email Input Field */}
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            {/* Display validation error for the email field if present */}
            {validationErrors.email && <p className="validation-error">{validationErrors.email[0]}</p>}
            
            {/* New Password Input Field */}
            <label>New Password (Leave blank to keep current)</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} />
            {/* Display validation error for the password field if present */}
            {validationErrors.password && <p className="validation-error">{validationErrors.password[0]}</p>}
            
            {/* Confirm New Password Input Field */}
            <label>Confirm New Password</label>
            <input type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} />
            {/* Display validation error for the password_confirmation field if present */}
            {validationErrors.password_confirmation && <p className="validation-error">{validationErrors.password_confirmation[0]}</p>}

            {/* Submission button, disabled during API call */}
            <button type="submit" disabled={isSubmitting} className="save-changes-btn" style={{ marginTop: '1.5rem' }}>
                {isSubmitting ? 'Updating...' : 'Save Changes'}
            </button>
        </form>
    );
}

export default ProfileForm;