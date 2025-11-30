// src/components/User/ProfileForm.js

import React, { useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

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

        // Filter out empty password fields if the user isn't changing it
        const updateData = Object.fromEntries(
            Object.entries(formData).filter(([key, value]) => key !== 'password' || value)
        );

        try {
            // Assumes a PUT request to /api/profile (or similar) exists
            const response = await api.updateProfile(updateData);
            
            // Update Auth Context with new user data
            setUser(response.user); 
            
            setMessage('Profile updated successfully!');
        } catch (err) {
            if (err.response && err.response.status === 422) {
                // Laravel returns a JSON object under the 'errors' key for validation failures
                if (err.response.data && err.response.data.errors) {
                    setValidationErrors(err.response.data.errors);
                    setMessage('Please check the highlighted fields for errors.');
                } else {
                    setMessage('Validation failed. Check server response.');
                }
                
                setIsError(true);
            } else {
                // Handle non-validation errors (e.g., network, 500 server error)
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
            
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            
            <label>New Password (Leave blank to keep current)</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} />
            
            <label>Confirm New Password</label>
            <input type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} />

            <button type="submit" disabled={isSubmitting} className="save-changes-btn" style={{ marginTop: '1.5rem' }}>
                {isSubmitting ? 'Updating...' : 'Save Changes'}
            </button>
        </form>
    );
}

export default ProfileForm;