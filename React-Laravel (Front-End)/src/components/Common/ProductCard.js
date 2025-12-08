import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext'; 
import WishlistToggle from '../../pages/Products/WishlistToggle'; 

const BACKEND_BASE_URL = 'http://localhost:8082'; 

/**
 * ProductCard Component
 * Renders a visual card for an individual product, including its image, description,
 * pricing, and interaction controls (Wishlist toggle and Add to Cart).
 */
function ProductCard({ product, initialIsWished = false, onAddToCartSuccess }) { 
    
    const { handleAddToCart, isItemInCart} = useCart();
    
    /**
     * Data Normalization
     * Formats the product price to two decimal places and identifies stock status.
     */
    const formattedPrice = product.price 
                            ? parseFloat(product.price).toFixed(2) 
                            : '0.00'; 
    
    const stockAvailable = product.stock;
    const isOutOfStock = stockAvailable <= 0;

    /**
     * Image URL Resolution
     * Determines if the image_url is a full path or requires the backend base URL.
     * Provides a fallback default image if no URL is present.
     */
    const absoluteImageUrl = product.image_url && product.image_url.startsWith('http')
        ? product.image_url 
        : product.image_url
            ? `${BACKEND_BASE_URL}${product.image_url}` 
            : `${BACKEND_BASE_URL}/assets/images/default.png`; 

    const isProductWished = product.is_wished || initialIsWished;
    const inCart = isItemInCart(product.id); 

    /**
     * Interaction Handlers
     * handleAddClick: Dispatches the Add to Cart action, handles propagation,
     * and triggers success notifications or error alerts.
     */
    const handleAddClick = async (e) => {
        e.stopPropagation(); 
        
        try {
            await handleAddToCart(product.id, 1); 
            
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
            
            <div className="product-wishlist-toggle">
                <WishlistToggle 
                    productId={product.id}
                    initialIsWished={isProductWished}
                />
            </div>

            <Link to={`/products/${product.id}`} className="product-image-link">
                <img 
                    src={absoluteImageUrl} 
                    alt={product.name} 
                    className="product-img"
                />
            </Link>
            
            <div className="product-info">
                
                <h3 className="product-name">
                    <Link 
                        to={`/products/${product.id}`} 
                        style={{ textDecoration: 'none' }}
                    >
                        {product.name}
                    </Link>
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
                        onClick={handleAddClick} 
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