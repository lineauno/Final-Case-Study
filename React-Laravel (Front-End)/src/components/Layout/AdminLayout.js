import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { logout } from '../../services/api'; 

/**
 * AdminLayout Component
 * Defines the master structural wrapper for the administrative section.
 * Includes a persistent navigation header, a dynamic content area using 
 * React Router's Outlet, and a footer displaying session info.
 */
function AdminLayout() {
    const { user } = useAuth(); 
    const navigate = useNavigate();
    const location = useLocation();

    /**
     * Session Termination Handler
     * Dispatches a request to the backend logout service, clears local 
     * authentication tokens, and redirects the user to the login route.
     */
    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await logout(); 
            localStorage.removeItem('user_token');
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
            localStorage.removeItem('user_token');
            navigate('/login'); 
        }
    };
    
    /**
     * Navigation Configuration
     * Defines the primary administrative links available in the header.
     */
    const navItems = [
        { name: "Dashboard", path: "/admin/dashboard" },
        { name: "Products", path: "/admin/products" },
        { name: "Categories", path: "/admin/categories" },
    ];

    return (
        <div className="admin-app">
            
            <header className="admin-header admin-navbar-container pink-banner-bg"> 
                
                <h1 className="brand admin-brand">
                    Crafty Corner - Admin
                </h1>

                <nav className="admin-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path} 
                            to={item.path} 
                            className={`nav-link nav-button ${
                                location.pathname.startsWith(item.path) ? "active" : ""
                            }`}
                        >
                            {item.name}
                        </Link>
                    ))}

                    <button 
                        onClick={handleLogout} 
                        className="nav-link nav-button logout-styled"
                    >
                        Logout
                    </button>
                </nav>
            </header>
            
            <main className="admin-content-wrapper">
                <Outlet /> 
            </main>
            
            <footer className="admin-footer">
                <p> Logged in as: {user ? user.email : 'Loading...'} | Role: Admin</p>
            </footer>
        </div>
    );
}

export default AdminLayout;