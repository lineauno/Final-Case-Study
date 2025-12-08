import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 

/**
 * OrderHistoryPage Component
 * Responsible for fetching and displaying the authenticated user's past transactions.
 * It interacts with the secure Orders API, manages asynchronous state transitions,
 * and normalizes nested order data (including snapshotted purchase prices) for display.
 */
function OrderHistoryPage() {
    /**
     * Component State Management
     * - orders: Collection of historical order objects.
     * - isLoading/error: Tracks operational status and server rejection feedback.
     */
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuth();

    /**
     * Data Retrieval side-effect
     * Executes upon component mount or whenever authentication state changes.
     * Guards the API request to ensure data is only fetched for verified sessions.
     */
    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchOrders = async () => {
            try {
                const data = await api.getOrders(); 
                
                /**
                 * Type Safety validation
                 * Ensures the API response is iterable before committing to state,
                 * preventing runtime mapping errors on empty or non-standard responses.
                 */
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
        return <div className="loading-style">Loading orders...</div>;
    }

    if (error) {
        return <div className="container p-8 text-red-600 text-center">{error}</div>;
    }

    return (
        <div className="order-history-page"> 
            <h1 className="order-history-title">Your Order History</h1>
            
            {orders.length === 0 ? (
                /* Empty state UI displayed when the user has no purchase history */
                <div className="text-center p-12 border border-gray-200 rounded-lg shadow-sm bg-white max-w-lg mx-auto">
                    <p className="text-xl text-gray-600 mb-4">You haven't placed any orders yet.</p>
                    <Link to="/products" className="text-pink-600 hover:text-pink-800 font-semibold underline">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                /* Order list container displaying individual transaction cards */
                <div className="order-list"> 
                    {orders.map((order) => (
                        <div key={order.id} className="order-card-wrapper"> 
                            
                            {/* Order summary header: identity, timestamp, totals, and fulfillment status */}
                            <div className="order-header">
                                <div className="header-group">
                                    <p className="order-id">
                                        <span className="order-id-label">Order #</span>{order.id}
                                    </p>
                                    <p className="order-date">Placed on: {new Date(order.created_at).toLocaleDateString()}</p>
                                </div>

                                <div className="header-group items-end">
                                    <div className="order-total-section">
                                        <p className="order-total-amount">₱{order.order_total}</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Breakdown of items contained within this specific order */}
                            <div className="order-details-section"> 
                                <p className="detail-section-title">Items Ordered</p>
                                
                                <ul className="item-list-container">
                                    {order.items.map(item => (
                                        <li key={item.id} className="detail-list-item"> 
                                            <div>
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

                            {/* Captured shipping destination details specific to this order snapshot */}
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