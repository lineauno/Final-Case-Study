// src/pages/User/OrderHistoryPage.js

import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 

function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchOrders = async () => {
            try {
                const data = await api.getOrders(); 
                
                if (Array.isArray(data)) {
                    setOrders(data);
                } else {
                    console.warn("API returned non-array data for orders:", data);
                    setOrders([]);
                }
                
            } catch (err) {
                console.error("Error fetching orders:", err);
                setError("Failed to fetch order history.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [isAuthenticated]);

    if (isLoading) {
        // Using basic utility classes as these are general layout components
        return <div className="container p-8 text-center">Loading orders...</div>;
    }

    if (error) {
        return <div className="container p-8 text-red-600 text-center">{error}</div>;
    }

    return (
        // Apply main layout class
        <div className="order-history-page"> 
            {/* Apply title class */}
            <h1 className="order-history-title">Your Order History</h1>
            
            {orders.length === 0 ? (
                // Empty State Design - Keep some utility classes for basic structure
                <div className="text-center p-12 border border-gray-200 rounded-lg shadow-sm bg-white max-w-lg mx-auto">
                    <p className="text-xl text-gray-600 mb-4">You haven't placed any orders yet.</p>
                    <Link to="/products" className="text-pink-600 hover:text-pink-800 font-semibold underline">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                // Apply the order list container class
                <div className="order-list"> 
                    {orders.map((order) => (
                        // Apply the order card wrapper class
                        <div key={order.id} className="order-card-wrapper"> 
                            
                            {/* TOP HEADER: Order ID, Date, Total, Status */}
                            {/* Apply order-header class */}
                            <div className="order-header">
                                {/* Group for ID and Date */}
                                <div className="header-group">
                                    <p className="order-id">
                                        {/* Apply order-id-label class */}
                                        <span className="order-id-label">Order #</span>{order.id}
                                    </p>
                                    {/* Apply order-date class */}
                                    <p className="order-date">Placed on: {new Date(order.created_at).toLocaleDateString()}</p>
                                </div>

                                {/* Group for Total and Status */}
                                <div className="header-group items-end">
                                    {/* Apply order-total-section and order-total-amount classes */}
                                    <div className="order-total-section">
                                        <p className="order-total-amount">₱{order.order_total}</p>
                                    </div>
                                    
                                    {/* Apply status-badge and specific status classes */}
                                </div>
                            </div>
                            
                            {/* DETAILS SECTION */}
                            {/* Apply order-details-section class */}
                            <div className="order-details-section"> 
                                {/* Apply detail-section-title class */}
                                <p className="detail-section-title">Items Ordered</p>
                                
                                {/* Apply item-list-container class */}
                                <ul className="item-list-container">
                                    {order.items.map(item => (
                                        // Apply detail-list-item class
                                        <li key={item.id} className="detail-list-item"> 
                                            <div>
                                                {/* Apply item-name class */}
                                                <span className="item-name">{item.product?.name || "Product Deleted"}</span> x {item.quantity} 
                                                <span className="text-sm text-gray-500 ml-2">(@ ₱{item.price_at_purchase})</span>
                                            </div>
                                            <div>
                                                ₱{(item.price_at_purchase * item.quantity).toFixed(2)}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* SHIPPING SECTION */}
                            {/* Apply shipping-info-box class */}
                            <div className="shipping-info-box"> 
                                <p className="detail-section-title">Shipping Address</p>
                                <p className="text-base font-medium text-gray-800">{order.shipping_address}</p>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OrderHistoryPage;