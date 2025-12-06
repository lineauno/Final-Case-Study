// src/pages/User/Register.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', password_confirmation: '',
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Redirect if already authenticated
    if (isAuthenticated) {
        navigate('/');
        return null;
    }
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await register(formData);
            // Registration successful, AuthContext handles navigation
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
                    {/* Name Input */}
                    <div className="form-field-wrapper">
                        <input type="text" name="name" placeholder="Full Name" className="checkout-input" onChange={handleChange} required />
                    </div>
                    {/* Email Input */}
                    <div className="form-field-wrapper">
                        <input type="email" name="email" placeholder="Email Address" className="checkout-input" onChange={handleChange} required />
                    </div>
                    {/* Password Input */}
                    <div className="form-field-wrapper">
                        <input type="password" name="password" placeholder="Password" className="checkout-input" onChange={handleChange} required />
                    </div>
                    {/* Confirm Password Input */}
                    <div className="form-field-wrapper">
                        <input type="password" name="password_confirmation" placeholder="Confirm Password" className="checkout-input" onChange={handleChange} required />
                    </div>

                    {/* Register Button */}
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