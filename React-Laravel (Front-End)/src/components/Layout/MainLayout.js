import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { useProduct } from '../../contexts/ProductContext';
import { useCart } from '../../contexts/CartContext';

/**
 * MainLayout Component
 * Defines the master structural wrapper for all customer-facing routes.
 * It coordinates the loading states of primary data contexts (Auth, Product, and Cart)
 * and provides a consistent layout containing the Header, Main Content area (Outlet), 
 * and Footer.
 */
function MainLayout() {
    const { isLoading: authLoading } = useAuth();
    const { isLoading: productLoading } = useProduct();
    const { isLoading: cartLoading } = useCart();
    
    /**
     * App-wide Loading Logic
     * Aggregates various asynchronous state flags. If any core context 
     * is still initializing, a blocking loading screen is rendered.
     */
    const isAppLoading = authLoading || productLoading || cartLoading;

    if (isAppLoading) {
        return <div className="loading-style">Loading Crafty Corner...</div>;
    }

    return (
        <div className="app-main-container">
            <Header /> 
            
            <main className="main-content">
                <Outlet /> 
            </main>

            <Footer />
        </div>
    );
}

export default MainLayout;