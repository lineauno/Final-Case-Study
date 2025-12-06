import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext'; 

const HeartIcon = ({ isWished, size = 20, className = "" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill={isWished ? "currentColor" : "none"} 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={`transition-colors duration-200 ${isWished ? 'text-pink-600' : 'text-gray-400 hover:text-pink-600'} ${className}`}
    >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
);

function WishlistToggle({ productId, initialIsWished = false }) {
    const { isAuthenticated } = useAuth();
    const [isWished, setIsWished] = useState(initialIsWished);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        setIsWished(initialIsWished);
    }, [initialIsWished]);

    const handleToggle = async (e) => {
        e.stopPropagation(); 
        e.preventDefault(); 

        if (!isAuthenticated) {
            alert("Please log in to manage your wishlist.");
            return;
        }

        if (isProcessing) return;
        setIsProcessing(true);

        try {
            if (isWished) {
                await api.removeFromWishlist(productId); 
            } else {
                await api.addToWishlist(productId);
            }
            setIsWished(prev => !prev); 
        } catch (error) {
            console.error("Error toggling wishlist:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isProcessing}
            title={isWished ? 'Remove from Wishlist' : 'Add to Wishlist'}
            className={`wishlist-btn ${isWished ? 'active' : ''}`}
            style={{
                background: isWished ? '#ffeef2' : 'white',
                border: 'none',
                borderRadius: '50%',
                padding: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}
        >
            <HeartIcon isWished={isWished} size={20} />
        </button>
    );
}

export default WishlistToggle;