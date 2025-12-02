// src/pages/User/WishlistPage.js

import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ProductCard from '../../components/Common/ProductCard'; 
import SuccessModal from '../../components/Layout/SuccessModal';
//import '../../pagesstyles/WishlistPage.css'; 

function WishlistPage() {
    const [wishlist, setWishlist] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuth();
    
    const [successModal, setSuccessModal] = useState({ show: false, message: '' }); 

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

    useEffect(() => {
        fetchWishlist();
    }, [isAuthenticated]);

    const showSuccessNotification = (productName) => {
        setSuccessModal({ 
            show: true, 
            message: `${productName} added to cart successfully! 🛒` 
        });
    };

    const closeSuccessModal = () => {
        setSuccessModal({ show: false, message: '' });
    };

    return (
        // 💡 FIX: The container is ALWAYS rendered now, keeping the footer down
        <div className="wishlist-container"> 
            
            <SuccessModal 
                show={successModal.show} 
                message={successModal.message} 
                onClose={closeSuccessModal} 
            />

            <h1 className="wishlist-header">Your Wishlist</h1>
            
            {/* 💡 CONDITIONAL RENDERING INSIDE THE CONTAINER */}
            {isLoading ? (
                <div className="loading-container">Loading wishlist...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : wishlist.length === 0 ? (
                <div className="empty-state-card">
                    <p className="empty-state-message">Your wishlist is empty!</p>
                    <p className="empty-state-submessage">Start exploring products you love and save them here.</p>
                    <Link to="/products" className="discover-products-btn">
                        Discover Products
                    </Link>
                </div>
            ) : (
                <div className="wishlist-grid"> 
                    {wishlist.map((product) => (
                        <div key={product.id} className="wishlist-item-wrapper">
                            <ProductCard 
                                product={product} 
                                initialIsWished={true} 
                                onAddToCartSuccess={showSuccessNotification}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default WishlistPage;
