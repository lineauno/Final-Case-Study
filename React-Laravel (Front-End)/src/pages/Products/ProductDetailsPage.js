import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useCart } from '../../contexts/CartContext';
import SuccessModal from '../../components/Layout/SuccessModal';

const BACKEND_BASE_URL = 'http://localhost:8082'; 

/**
 * ProductDetailsPage Component
 * Responsible for rendering detailed information for a single product.
 * Extracts the product ID from URL parameters, fetches detailed data via API, 
 * and provides primary interaction buttons for cart management.
 */
function ProductDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { handleAddToCart } = useCart();
    
    /**
     * Component State Management
     * - product: Holds the fetched product object.
     * - isLoading/error: Tracks operational status and API failures.
     * - successModal: Controls feedback visibility after adding to cart.
     */
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successModal, setSuccessModal] = useState({ show: false, message: '' });

    /**
     * Data Retrieval Hook
     * Re-runs whenever the 'id' param changes. Attempts to load the specific 
     * product details or logs an error if the record is missing.
     */
    useEffect(() => {
        const fetchProduct = async () => {
            setIsLoading(true);
            try {
                const data = await api.getProductById(id); 
                setProduct(data);
                setError(null);
            } catch (err) {
                setError("Product not found or failed to load.");
                console.error("API error:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    /**
     * Interaction Handlers
     * Dispatches the cart update action via context and opens the success modal 
     * upon positive server confirmation.
     */
    const handleAddToCartClick = async () => {
        if (!product) return;
        try {
            await handleAddToCart(product.id, 1);
            setSuccessModal({ show: true, message: `${product.name} added to cart! 🛒` });
        } catch (error) {
            console.error("Failed to add:", error);
        }
    };

    /**
     * Conditional Status Rendering
     * Provides fallback UI for network loading states or record errors.
     */
    if (isLoading) return <div className="loading-style">Loading Product Details...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!product) return <div>Product data is missing.</div>;

    /**
     * Data Formatting and Normalization
     * Normalizes currency strings, stock integer checks, and resolves 
     * absolute URLs for local storage assets.
     */
    const formattedPrice = product.price ? parseFloat(product.price).toFixed(2) : '0.00';
    const stockAvailable = product.stock !== undefined ? product.stock : 0;
    const isOutOfStock = stockAvailable <= 0;
    
    const fullImageUrl = product.image_url && product.image_url.startsWith('http')
        ? product.image_url 
        : product.image_url 
            ? `${BACKEND_BASE_URL}${product.image_url}` 
            : `${BACKEND_BASE_URL}/assets/images/default.png`;

    return (
        <div className="details-container"> 
            
            <SuccessModal 
                show={successModal.show} 
                message={successModal.message} 
                onClose={() => setSuccessModal({ show: false, message: '' })} 
            />
            
            <button 
                onClick={() => navigate('/products')} 
                className="back-link"
            >
                <svg className="w-1 h-1 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Back to Products
            </button>

            <div className="details-grid">
                
                <div className="details-image-box"> 
                    <img 
                        src={fullImageUrl} 
                        alt={product.name} 
                        className="details-product-img" 
                    />
                </div>
                
                <div className="details-info-section">
                    <h1>{product.name}</h1>
                    
                    <p className="price">
                        ₱{formattedPrice}
                    </p>
                    
                    <p className="product-description-full">{product.description || 'No detailed description available.'}</p>
                    
                    <div className="details-button-group">
                        <button 
                            className="primary-add-to-cart-btn"
                            onClick={handleAddToCartClick} 
                            disabled={isOutOfStock}
                        >
                            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                        
                        <button 
                            className="secondary-btn"
                            onClick={() => navigate('/cart')}
                        >
                            View Cart
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ProductDetailsPage;