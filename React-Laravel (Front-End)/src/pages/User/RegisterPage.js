import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * RegisterPage Component
 * Provides a user interface for new account creation.
 * Manages form state, handles input synchronization, and coordinates with
 * the AuthContext to execute the registration logic and establish a session.
 */
function RegisterPage() {
    /**
     * Component State Management
     * - formData: Captures user input for name, email, and password confirmation.
     * - error: Stores server-side rejection messages for display.
     * - isSubmitting: Tracks the asynchronous submission state to prevent redundant calls.
     */
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', password_confirmation: '',
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { register, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    /**
     * Navigation Guard
     * Redirects authenticated users to the home page to prevent 
     * redundant registration attempts.
     */
    if (isAuthenticated) {
        navigate('/');
        return null;
    }
    
    /**
     * Generic change handler
     * Synchronizes form input fields with the local formData state.
     */
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    /**
     * Registration Submission Logic
     * Prevents default form behavior and dispatches data to AuthContext.register.
     * Captures any errors returned by the backend for display within the UI.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await register(formData);
        } catch (err) {
            setError(err.message || "Registration failed. Please check your data.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-box">
                <h1>Create a New Account</h1>
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {/* User Profile Details */}
                    <div className="form-field-wrapper">
                        <input type="text" name="name" placeholder="Full Name" className="checkout-input" onChange={handleChange} required />
                    </div>
                    <div className="form-field-wrapper">
                        <input type="email" name="email" placeholder="Email Address" className="checkout-input" onChange={handleChange} required />
                    </div>

                    {/* Authentication Credentials */}
                    <div className="form-field-wrapper">
                        <input type="password" name="password" placeholder="Password" className="checkout-input" onChange={handleChange} required />
                    </div>
                    <div className="form-field-wrapper">
                        <input type="password" name="password_confirmation" placeholder="Confirm Password" className="checkout-input" onChange={handleChange} required />
                    </div>

                    <button type="submit" className="register-btn" style={{ marginTop: '1rem' }} disabled={isSubmitting}> 
                        {isSubmitting ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <p style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
                    Already have an account? 
                    <Link to="/login" className="link-text" style={{ fontWeight: 'bold' }}>
                        Log in here
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;