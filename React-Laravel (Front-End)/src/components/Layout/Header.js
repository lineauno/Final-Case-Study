/* OLD HEADER!!!!

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext'; // <-- FIX: Use CartContext

function Header() {
    const { isAuthenticated, user, logout } = useAuth();
    const { cartCount, isLoading } = useCart(); // <-- FIX: Use cartCount from useCart

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
    };

    const displayCount = isLoading ? 0 : cartCount;

    return (
        <header className="main-header">
            <div className="container header-content">
                <Link to="/" className="site-logo">
                    Crafty Corner
                </Link>

                <nav className="main-nav">
                    <Link to="/products">Shop</Link>
                    <Link to="/profile">Profile</Link>
                </nav>

                <div className="header-actions">
                    <Link to="/cart" className="cart-icon-link">
                        <i className="fas fa-shopping-cart"></i> 
                        {displayCount > 0 && <span className="cart-badge">{displayCount}</span>}
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <span className="user-greeting">Hi, {user.name.split(' ')[0]}</span>
                            <a href="#" onClick={handleLogout} className="link-text">
                                Logout
                            </a>
                        </>
                    ) : (
                        <Link to="/login" className="link-text">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header; */