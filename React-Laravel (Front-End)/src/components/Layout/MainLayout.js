import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { useProduct } from '../../contexts/ProductContext';
import { useCart } from '../../contexts/CartContext';

// MainLayout component defines the common structure (header, main content area, footer) for non-admin pages
function MainLayout() {
    const { isLoading: authLoading } = useAuth();
    const { isLoading: productLoading } = useProduct();
    const { isLoading: cartLoading } = useCart();
    
    const isAppLoading = authLoading || productLoading || cartLoading;

    if (isAppLoading) {
        return <div className="loading-style">Loading Crafty Corner...</div>;
    }

    return (
        <div className="app-main-container">
            {/* The site-wide header component */}
            <Header /> 
            
            {/* Main content wrapper */}
            <main className="main-content">
                {/* Outlet renders the specific component corresponding to the current route */}
                <Outlet /> 
            </main>

            {/* The site-wide footer component */}
            <Footer />
        </div>
    );
}

export default MainLayout;