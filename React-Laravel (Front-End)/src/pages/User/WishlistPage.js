import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ProductCard from '../../components/Common/ProductCard'; 

/**
 * WishlistPage Component
 * Renders an interface for users to view and manage their saved products.
 * Uses authentication status to guard data fetching and provides a responsive 
 * grid layout for display.
 */
function WishlistPage() {
    /**
     * Component State Management
     * - wishlist: Local array of product objects retrieved from the wishlist API.
     * - isLoading/error: Standard operational status flags for network handling.
     */
    const [wishlist, setWishlist] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuth();

    /**
     * fetchWishlist Logic
     * Asynchronous handler that interacts with the wishlist API service.
     * Synchronizes backend data with component state or processes error 
     * messages for UI display.
     */
    const fetchWishlist = async () => {
        if (!isAuthenticated) return;
        setIsLoading(true);
        setError(null);

        try {
            const data = await api.getWishlist(); 
            setWishlist(data);
        } catch (err) {
            console.error("Error fetching wishlist:", err);
            setError("Failed to fetch your wishlist.");
            setWishlist([]);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Component Lifecycle Hook
     * Triggers the initial data retrieval on mount, contingent on authentication.
     */
    useEffect(() => {
        fetchWishlist();
    }, [isAuthenticated]);

    /**
     * Optimistic UI Update Handler
     * Used to remove items from the local state array after a successful API 
     * removal call, ensuring immediate visual feedback.
     */
    const handleRemoveFromWishlist = (productId) => {
        setWishlist(prevList => prevList.filter(item => item.id !== productId));
    };


    if (isLoading) {
        return <div className="loading-style">Loading wishlist...</div>;
    }

    if (error) {
        return <div className="page-error">{error}</div>;
    }

    return (
        <div className="wishlist-container"> 
            
            <h1 className="wishlist-header">Your Wishlist</h1>
            
            {wishlist.length === 0 ? (
                /* Empty State: Prompted when the wishlist array is empty */
                <div className="empty-state-card">
                    <p className="empty-state-message">Your wishlist is empty!</p>
                    <p className="empty-state-submessage">Start exploring products you love and save them here.</p>
                    <Link to="/products" className="discover-products-btn">
                        Discover Products
                    </Link>
                </div>
            ) : (
                /* Dynamic Grid: Maps through wishlist data into ProductCard components */
                <div className="wishlist-grid"> 
                    {wishlist.map((product) => (
                        <div key={product.id} className="wishlist-item-wrapper">
                            <ProductCard 
                                product={product} 
                                initialIsWished={true} 
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default WishlistPage;