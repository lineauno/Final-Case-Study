import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { logout } from '../../services/api'; 

// AdminLayout component defines the structural layout (header, navigation, content area) for the admin section
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
            
            {/* Header section containing the brand and main navigation */}
            <header className="admin-header admin-navbar-container pink-banner-bg"> 
                
                {/* Application title/brand for the admin interface */}
                <h1 className="brand admin-brand">
                    Crafty Corner - Admin
                </h1>

                {/* Navigation bar for administrative links */}
                <nav className="admin-nav">
                    {/* Map through the defined navigation items to create Link components */}
                    {navItems.map((item) => (
                        <Link
                            key={item.path} 
                            to={item.path} 
                            // Dynamically set the 'active' class if the current path starts with the item's path
                            className={`nav-link nav-button ${
                                location.pathname.startsWith(item.path) ? "active" : ""
                            }`}
                        >
                            {item.name}
                        </Link>
                    ))}

                    {/* Logout button which performs an action rather than simple navigation */}
                    <button 
                        onClick={handleLogout} 
                        // Apply classes for link styling, button appearance, and specific logout colors
                        className="nav-link nav-button logout-styled"
                    >
                        Logout
                    </button>
                </nav>
            </header>
            
            {/* Main content area where nested route components will be rendered */}
            <main className="admin-content-wrapper">
                {/* Outlet renders the matched child route component (e.g., Dashboard, ProductList) */}
                <Outlet /> 
            </main>
            
            {/* Footer section for administrative context information */}
            <footer className="admin-footer">
                {/* Display the logged-in user's email for verification */}
                <p> Logged in as: {user ? user.email : 'Loading...'} | Role: Admin</p>
            </footer>
        </div>
    );
}

export default AdminLayout;