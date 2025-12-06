import React from 'react';
import './App.css'; 
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import { useAuth } from './contexts/AuthContext';

import AdminLayout from './components/Layout/AdminLayout'; 
import AdminDashboard from './pages/Admin/AdminDashboard'; 
import AdminProductManagement from './pages/Admin/AdminProductManagement'; 
import AdminCategoryManagement from './pages/Admin/AdminCategoryManagement'; 
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


const ProtectedRoute = ({ element: Element }) => {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) return <div>Loading Application...</div>; 
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />; 
    }
    
    return Element;
};

const AdminRoute = ({ children }) => {
    const { isAuthenticated, user, isLoading } = useAuth();
    
    if (isLoading) return <div>Loading Admin Access...</div>; 
    
    const isAdmin = isAuthenticated && user && user.role === 'admin';

    if (!isAdmin) {
        return <Navigate to="/" replace />; 
    }
    
    return children;
};


function App() {
    return (
        <Routes>
            
            {}
            {}
            {}
            <Route path="/" element={<MainLayout />}> 
                
                {}
                <Route index element={<HomePage />} />
                <Route path="products" element={<ProductListingPage />} />
                <Route path="products/:id" element={<ProductDetailsPage />} />
                <Route path="cart" element={<CartPage />} />
                
                
                {}
                <Route path="checkout" element={<ProtectedRoute element={<CheckoutPage />} />} /> 
                <Route path="orders" element={<ProtectedRoute element={<OrderHistoryPage />} />} />
                <Route path="profile" element={<ProtectedRoute element={<ProfilePage />} />} /> 
                
                {}
                <Route path="wishlist" element={<ProtectedRoute element={<WishlistPage />} />} />
            </Route>

            {}
            {}
            {}
            <Route path="/login" element={<LoginPage />} /> 
            <Route path="/register" element={<RegisterPage />} /> 


            {}
            {}
            {}
            <Route 
                path="/admin" 
                element={
                    <AdminRoute>
                        <AdminLayout /> 
                    </AdminRoute>
                }
            > 
                <Route path="dashboard" element={<AdminDashboard />} /> 
                <Route path="products" element={<AdminProductManagement />} /> 
                <Route path="categories" element={<AdminCategoryManagement />} />
            </Route>

            {}
            {}
            {}
            <Route path="*" element={<NotFoundPage />} /> 

        </Routes>
    );
}

export default App;