import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { logout } from '../../services/api'; 

function AdminLayout() {
    const { user } = useAuth(); 
    const navigate = useNavigate();
    const location = useLocation();

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
                            // This gets the default button look and the active state
                            className={`nav-link nav-button ${
                                location.pathname.startsWith(item.path) ? "active" : ""
                            }`}
                        >
                            {item.name}
                        </Link>
                    ))}

                    {/* 🎯 FIX: Apply the general 'nav-button' class to inherit styling.
                        Use 'logout-styled' for the specific background/text colors seen in the image. 
                        It remains a <button> because it performs an action (API call) instead of navigation. */}
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