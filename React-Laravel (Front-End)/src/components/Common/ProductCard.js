import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext'; 
import WishlistToggle from '../../pages/Products/WishlistToggle'; 

const BACKEND_BASE_URL = 'http://localhost:8083'; 

// ProductCard component displays a single product item in a listing/grid
function ProductCard({ product, initialIsWished = false, onAddToCartSuccess }) { 
    
    const { handleAddToCart, isItemInCart} = useCart();
    
    const formattedPrice = product.price 
                            ? parseFloat(product.price).toFixed(2) 
                            : '0.00'; 
    
    const stockAvailable = product.stock;
    const isOutOfStock = stockAvailable <= 0;

    const absoluteImageUrl = product.image_url && product.image_url.startsWith('http')
        ? product.image_url 
        : product.image_url
            ? `${BACKEND_BASE_URL}${product.image_url}` 
            : `${BACKEND_BASE_URL}/assets/images/default.png`; 

    const isProductWished = product.is_wished || initialIsWished;
    
    const inCart = isItemInCart(product.id); 


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
            
            {/* Container for the wishlist toggle button */}
            <div className="product-wishlist-toggle">
                {/* Renders the WishlistToggle component with necessary props */}
                <WishlistToggle 
                    productId={product.id}
                    initialIsWished={isProductWished}
                />
            </div>

            {/* Link wrapper for the product image, enabling navigation to details page */}
            <Link to={`/products/${product.id}`} className="product-image-link">
                <img 
                    src={absoluteImageUrl} 
                    alt={product.name} 
                    className="product-img"
                />
            </Link>
            
            {/* Container for product textual information and actions */}
            <div className="product-info">
                
                <h3 className="product-name">
                    {/* Link for the product name */}
                    <Link 
                        to={`/products/${product.id}`} 
                        style={{ textDecoration: 'none' }}
                    >
                        {product.name}
                    </Link>
                </h3>

                {/* Display a truncated version of the product description */}
                <p className="product-description-snippet">
                    {/* Display up to 70 characters of description, appending '...' if longer */}
                    {product.description.substring(0, 70)}{product.description.length > 70 ? '...' : ''}
                </p>

                {/* Container for price and Add to Cart button */}
                <div className="price-cart">
                    <p className="price">
                        {/* Display the formatted price */}
                        ₱{formattedPrice}
                    </p>
                    
                    {/* Button for Add to Cart action */}
                    <button 
                        // Apply 'disabled' class if out of stock
                        className={`cart-btn ${isOutOfStock ? 'disabled' : ''}`}
                        onClick={handleAddClick} 
                        // Disable button if out of stock OR if the item is already in the cart
                        disabled={isOutOfStock || inCart}
                    >
                        {/* Dynamic button text based on stock and cart status */}
                        {isOutOfStock ? 'Out of Stock' : (inCart ? 'In Cart' : 'Add to Cart')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;