import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Assume AuthContext is used for login state

function LoginPage() {
    // Hooks Initialization
    const navigate = useNavigate();
    // Assuming 'login' updates the user state globally, which includes the user's role/type.
    const { login } = useAuth(); 
    
    // State Management
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('customer'); // Default login type
    const [error, setError] = useState('');

    // Function to handle the form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // 1. Execute the login function (calls backend API)
            // The login function in AuthContext should handle setting the global user state.
            await login(email, password, userType); 
            
            // 2. Clear fields (optional)
            setEmail('');
            setPassword('');
            
            // 3. CRITICAL MODIFICATION: CONDITIONAL NAVIGATION
            if (userType === 'admin') {
                // Navigate to the new Admin Dashboard
                navigate('/admin/dashboard'); 
            } else {
                // Navigate to the public site homepage for customers
                navigate('/'); 
            }
            // ----------------------------------------------------

        } catch (err) {
            // Handle API errors (e.g., bad credentials)
            setError('Login failed. Please check your credentials.');
            console.error("Login Error:", err);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-box">
                <h1>Login to Crafty Corner</h1>

                {error && <p className="error-message" style={{color: 'red', marginBottom: '1rem', fontWeight: 600}}>{error}</p>} 
                
                <form onSubmit={handleSubmit}> 
                    
                    {/* Email Input Field */}
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
                    
                    {/* Password Input Field */}
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

                    {/* Login Select and Button */}
                    <div className="login-actions">
                        <select 
                            className="auth-select"
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                        > 
                            <option value="customer">Login as Customer</option>
                            <option value="admin">Login as Admin</option>
                        </select>
                        
                        <button 
                            type="submit" 
                            // Conditional class for visual distinction (Admin vs. Customer)
                            className={userType === 'admin' ? 'login-btn' : 'login-btn'} 
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