// src/components/Common/ProductCard.js

import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext'; 
// Assuming the toggle component exists
import WishlistToggle from '../../pages/Products/WishlistToggle'; 

// Note: Ensure this path matches the location where you defined this constant.
const BACKEND_BASE_URL = 'http://localhost:8082'; 

// 💡 FIX 1: Component now accepts 'onAddToCartSuccess' from parent
// 💡 FIX 2: Component now accepts 'isItemInCart' from useCart()
function ProductCard({ product, initialIsWished = false, onAddToCartSuccess }) { 
    
    // 💡 FIX 3: Correctly destructure all necessary functions/helpers from useCart()
    const { handleAddToCart, isItemInCart} = useCart();
    
    // 1. Price Fix
    const formattedPrice = product.price 
                            ? parseFloat(product.price).toFixed(2) 
                            : '0.00'; 
    
    // 2. Stock Check
    const stockAvailable = product.stock;
    const isOutOfStock = stockAvailable <= 0;

    // 3. Image Path Logic
    const absoluteImageUrl = product.image_url && product.image_url.startsWith('http')
        ? product.image_url // External Placeholder
        : product.image_url
            ? `${BACKEND_BASE_URL}${product.image_url}` // Local Storage
            : `${BACKEND_BASE_URL}/assets/images/default.png`; // Fallback

    const isProductWished = product.is_wished || initialIsWished;
    
    // 💡 FIX 4: Call isItemInCart safely (using the destructured function)
    const inCart = isItemInCart(product.id); 


    // 💡 NEW: Handle Cart Addition and Success Notification
    const handleAddClick = async (e) => {
        e.stopPropagation(); // Prevents navigating to the product details page
        
        try {
            await handleAddToCart(product.id, 1); // 1. WAIT for the context/API call to complete
            
            // 2. SUCCESS: Show the modal via the parent function
            if (onAddToCartSuccess) {
                onAddToCartSuccess(product.name); 
            }
        } catch (error) {
            console.error("Cart error:", error);
            alert("Error adding item to cart. Please ensure you are logged in."); 
        }
    };


    return (
        <div className="product-card">
            
            {/* 🎯 WISHLIST TOGGLE CONTAINER */}
            <div className="product-wishlist-toggle">
                <WishlistToggle 
                    productId={product.id}
                    initialIsWished={isProductWished}
                />
            </div>

            {/* Link around the image */}
            <Link to={`/products/${product.id}`} className="product-image-link">
                <img 
                    src={absoluteImageUrl} 
                    alt={product.name} 
                    className="product-img"
                />
            </Link>
            
            <div className="product-info">
                
                <h3 className="product-name">
                    <Link to={`/products/${product.id}`}>{product.name}</Link>
                </h3>

                <p className="product-description-snippet">
                    {product.description.substring(0, 70)}{product.description.length > 70 ? '...' : ''}
                </p>

                <div className="price-cart">
                    <p className="price">
                        ₱{formattedPrice}
                    </p>
                    
                    <button 
                        className={`cart-btn ${isOutOfStock ? 'disabled' : ''}`}
                        onClick={handleAddClick} // 💡 Calls the new handler
                        disabled={isOutOfStock || inCart}
                    >
                        {isOutOfStock ? 'Out of Stock' : (inCart ? 'In Cart' : 'Add to Cart')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;