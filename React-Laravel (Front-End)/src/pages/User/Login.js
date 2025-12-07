import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth(); 
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

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