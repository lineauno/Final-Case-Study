// src/components/Layout/MainLayout.js

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { useProduct } from '../../contexts/ProductContext';
import { useCart } from '../../contexts/CartContext';

function MainLayout() {
    // We check the loading state of all core providers
    const { isLoading: authLoading } = useAuth();
    const { isLoading: productLoading } = useProduct();
    const { isLoading: cartLoading } = useCart();
    
    // Total Loading State for the entire app shell
    const isAppLoading = authLoading || productLoading || cartLoading;

    if (isAppLoading) {
        // Show a full-page loading screen while data is fetched
        return <div className="full-page-loading">Loading Crafty Corner...</div>;
    }

    return (
        <div className="app-main-container">
            {/* The Header component is now correctly using useCart() and should load */}
            <Header /> 
            
            <main className="main-content">
                {/* The Outlet renders the current page (e.g., HomePage, ProductListingPage) */}
                <Outlet /> 
            </main>

            {/* The Footer component (which you see) */}
            <Footer />
        </div>
    );
}

export default MainLayout;