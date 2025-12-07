import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ProductCard from '../../components/Common/ProductCard'; 

function WishlistPage() {
    const [wishlist, setWishlist] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuth();

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

    // Function to handle removal from the list after successful API call     
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
            {}
            <h1 className="wishlist-header">Your Wishlist</h1>
            
            {wishlist.length === 0 ? (
                <div className="empty-state-card">
                    <p className="empty-state-message">Your wishlist is empty!</p>
                    <p className="empty-state-submessage">Start exploring products you love and save them here.</p>
                    {}
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
                            />
                            {}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default WishlistPage;