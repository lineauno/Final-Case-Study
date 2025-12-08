import React, { lazy, Suspense } from 'react';
import './App.css'; 
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import { useAuth } from './contexts/AuthContext';

import AdminLayout from './components/Layout/AdminLayout'; 
import AdminDashboard from './pages/Admin/AdminDashboard'; 
import AdminProductManagement from './pages/Admin/AdminProductManagement'; 
import AdminCategoryManagement from './pages/Admin/AdminCategoryManagement'; 
import AdminUserManagement from './pages/Admin/AdminUserManagement'; 

import ProfilePage from './pages/User/ProfilePage'; 
import HomePage from './pages/Home/HomePage';
import ProductListingPage from './pages/Products/ProductListingPage';
import ProductDetailsPage from './pages/Products/ProductDetailsPage';
import CartPage from './pages/Cart/CartPage';
import CheckoutPage from './pages/Checkout/CheckoutPage'; 
import LoginPage from './pages/User/Login'; 
import RegisterPage from './pages/User/RegisterPage'; 
import OrderHistoryPage from './pages/User/OrderHistoryPage';
import WishlistPage from './pages/User/WishlistPage'; 
import NotFoundPage from './pages/Common/NotFoundPage'; 
import AdminInventoryPage from './pages/Admin/AdminInventoryPage'; 

/**
 * ProtectedRoute Component
 * * A Higher-Order Component (HOC) used to guard sensitive user routes. 
 * Checks AuthContext state; redirects unauthenticated users to /login 
 * and handles app-wide loading states to prevent flicker during 
 * token verification.
 */
const ProtectedRoute = ({ element: Element }) => {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) return <div>Loading Application...</div>; 
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />; 
    }
    
    return Element;
};

/**
 * AdminRoute Component
 * * A specialized route guard for the administrative tier.
 * Verifies that the authenticated user possesses the 'Admin' role.
 * Redirects non-admin users to the customer home page to maintain 
 * unauthorized access boundaries.
 */
const AdminRoute = ({ children }) => {
    const { isAuthenticated, user, isLoading } = useAuth();
    
    if (isLoading) return <div className="loading-style">Loading Admin Access...</div>; 
    
    const isAdmin = isAuthenticated && user && user.role === 'Admin';

    if (!isAdmin) {
        return <Navigate to="/" replace />; 
    }
    
    return children;
};

/**
 * Main Application Component
 * * Defines the high-level routing structure using React Router v6.
 * Orchestrates nested routing for 'MainLayout' (Customer) and 
 * 'AdminLayout' (Internal), and maps public vs. guarded endpoints.
 */
function App() {
    return (
        <Routes>
            
            {/* Customer-Facing Route Group: Uses MainLayout wrapper */}
            <Route path="/" element={<MainLayout />}> 
                <Route index element={<HomePage />} />
                <Route path="products" element={<ProductListingPage />} />
                <Route path="products/:id" element={<ProductDetailsPage />} />
                <Route path="cart" element={<CartPage />} />
                
                {/* Guards for Customer Transactions/Account pages */}
                <Route path="checkout" element={<ProtectedRoute element={<CheckoutPage />} />} /> 
                <Route path="orders" element={<ProtectedRoute element={<OrderHistoryPage />} />} />
                <Route path="profile" element={<ProtectedRoute element={<ProfilePage />} />} /> 
                <Route path="wishlist" element={<ProtectedRoute element={<WishlistPage />} />} />
            </Route>

            {/* Authentication Routes: Independent of main page layout */}
            <Route path="/login" element={<LoginPage />} /> 
            <Route path="/register" element={<RegisterPage />} /> 

            {/* Administrative Route Group: Strictly guarded with AdminRoute HOC */}
            <Route 
                path="/admin" 
                element={
                    <AdminRoute>
                        <AdminLayout /> 
                    </AdminRoute>
                }
            > 
                <Route index element={<AdminDashboard />} /> 
                <Route path="dashboard" element={<AdminDashboard />} /> 
                <Route path="products" element={<AdminProductManagement />} /> 
                <Route path="categories" element={<AdminCategoryManagement />} />
                <Route path="users" element={<AdminUserManagement />} /> 
                <Route path="inventory" element={<AdminInventoryPage />} /> 
            </Route>

            {/* Fallback Catch-all: NotFound 404 handler */}
            <Route path="*" element={<NotFoundPage />} /> 

        </Routes>
    );
}

export default App;