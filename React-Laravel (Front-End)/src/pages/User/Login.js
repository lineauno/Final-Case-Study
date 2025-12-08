import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 

/**
 * LoginPage Component
 * Responsible for rendering the user login interface and managing 
 * the authentication transaction. It utilizes the AuthContext for 
 * credential validation and navigates users based on their account role.
 */
function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth(); 
    
    /**
     * Component State Management
     * - email/password: Synchronizes user credentials from inputs.
     * - error: Captures and displays server rejection messages or local validation errors.
     */
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    /**
     * handleSubmit
     * Asynchronous submission handler that dispatches login credentials to the context.
     * Clears local form state upon success and redirects to the appropriate dashboard
     * based on user role (Admin vs Customer).
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const userData = await login(email, password); 
            
            setEmail('');
            setPassword('');
            
            if (userData && userData.role === 'Admin') { 
                navigate('/admin/dashboard'); 
            } else {
                navigate('/'); 
            }

        } catch (err) {
            console.error("Login Error:", err);
            
            /**
             * Enhanced Error Handling
             * Specifically identifies ban-related exceptions to provide clear 
             * status feedback to restricted accounts.
             */
            if (err.message && (err.message.includes('banned') || err.message.includes('Your account has been banned'))) {
                setError('🚫 Access Denied: Your account has been banned. Please contact support.');
            } else {
                setError('Login failed. Please check your credentials.');
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-box">
                <h1>Login to Crafty Corner</h1>

                {error && <p className="error-message" style={{color: 'red', marginBottom: '1rem', fontWeight: 600}}>{error}</p>} 
                
                <form onSubmit={handleSubmit}> 
                    
                    <div className="form-field-wrapper">
                        <input
                            type="email"
                            placeholder="Email (e.g., user@example.com)"
                            className="checkout-input" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-field-wrapper">
                        <input
                            type="password"
                            placeholder="Password"
                            className="checkout-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="login-actions">
                        <button 
                            type="submit" 
                            className="login-btn" 
                        > 
                            Log In
                        </button>
                    </div>

                </form>

                <p style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
                    Don't have an account? 
                    <Link to="/register" className="link-text" style={{ fontWeight: 'bold' }}>
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;