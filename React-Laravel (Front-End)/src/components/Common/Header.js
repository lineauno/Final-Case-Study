// src/components/Common/Header.js

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext'; 

// --- SVG Definitions (Icons) ---
// Note: Home Icon was already removed in the previous step.

// Product Icon SVG
const ProductIcon = ({ size = 22 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="9" y1="3" x2="9" y2="21"></line>
        <line x1="15" y1="3" x2="15" y2="21"></line>
        <line x1="3" y1="9" x2="21" y2="9"></line>
        <line x1="3" y1="15" x2="21" y2="15"></line>
    </svg>
);

// Shopping Cart Icon SVG
const CartIcon = ({ size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/>
        <circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
);

// 🎯 NEW: Wishlist Heart Icon SVG
const HeartIcon = ({ size = 22 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
);

// Profile/User Icon SVG
const ProfileIcon = ({ size = 22 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);
// --- End SVG Definitions ---


function Header() {
    const { isAuthenticated, user, logout } = useAuth();
    const { cartCount, isLoading } = useCart();
    const location = useLocation();

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
    };

    const displayCount = isLoading ? 0 : cartCount;

    // Helper to determine the active link class
    const getLinkClass = (path) => {
        // Updated path check to include /wishlist
        const isActive = location.pathname === path || 
                         (path === '/products' && location.pathname.startsWith('/products')) ||
                         (path === '/wishlist' && location.pathname.startsWith('/wishlist'));
        
        let baseClass = 'nav-link icon-nav-link';

        // Add a class that can be used to specifically style the wishlist icon
        const extraClass = path === '/wishlist' ? 'wishlist-icon' : '';

        return `${baseClass} ${extraClass} ${isActive ? 'active' : ''}`; 
    };

    return (
        <header className="navbar">
            <Link to="/" className="brand"> 
                Crafty Corner
            </Link>

            <div className="navbar-links-group"> 
                
                <nav className="main-nav-links">
                    <ul>
                        <li>
                            {/* Product Icon Link */}
                            <Link to="/products" className={getLinkClass('/products')} title="Products">
                                <ProductIcon />
                            </Link>
                        </li>

                        {isAuthenticated && (
                            <li>
                                {/* 🎯 NEW: Wishlist Icon Link */}
                                <Link to="/wishlist" className={getLinkClass('/wishlist')} title="Wishlist">
                                    <HeartIcon />
                                </Link>
                            </li>
                        )}
                        
                        {isAuthenticated && (
                            <li>
                                {/* Profile Icon Link */}
                                <Link to="/profile" className={getLinkClass('/profile')} title="Profile">
                                    <ProfileIcon /> 
                                </Link>
                            </li>
                        )}
                    </ul>
                </nav>

                <div className="navbar-right-actions">
                    
                    {/* Cart Link */}
                    <Link 
                        to="/cart" 
                        className={getLinkClass('/cart')}
                        title="Cart"
                    > 
                        <CartIcon /> 
                        {displayCount > 0 && <span className="cart-count-badge">{displayCount}</span>}
                    </Link>

                    {/* Auth Actions (Kept as text) */}
                    {isAuthenticated ? (
                        <>
                            {user && user.role === 'admin' && (
                                <Link to="/admin" className="nav-link">
                                    Admin
                                </Link>
                            )}
                            <a href="#" onClick={handleLogout} className="nav-link">
                                Logout
                            </a>
                        </>
                    ) : (
                        <Link to="/login" className="nav-link">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;