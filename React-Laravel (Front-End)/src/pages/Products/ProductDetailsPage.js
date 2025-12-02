// src/pages/Products/ProductDetailsPage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useCart } from '../../contexts/CartContext';
import SuccessModal from '../../components/Layout/SuccessModal'; 
import '../../pagesstyles/HomePage.css'; 

const BACKEND_BASE_URL = 'http://localhost:8082'; 

function ProductDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { handleAddToCart } = useCart();
    
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [successModal, setSuccessModal] = useState({ show: false, message: '' });

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

    const handleAddToCartClick = async () => {
        if (!product) return;
        try {
            await handleAddToCart(product.id, 1);
            setSuccessModal({ show: true, message: `${product.name} added to cart! 🛒` });
        } catch (error) {
            console.error("Failed to add:", error);
        }
    };

    if (isLoading) return <div className="loading-container">Loading Product Details...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!product) return <div>Product data is missing.</div>;

    // --- Data Preparation ---
    const formattedPrice = product.price ? parseFloat(product.price).toFixed(2) : '0.00';
    const stockAvailable = product.stock !== undefined ? product.stock : 0;
    const isOutOfStock = stockAvailable <= 0;
    
    // Smart Image URL Logic
    const fullImageUrl = product.image_url && product.image_url.startsWith('http')
        ? product.image_url 
        : product.image_url 
            ? `${BACKEND_BASE_URL}${product.image_url}` 
            : `${BACKEND_BASE_URL}/assets/images/default.png`;

    return (
        <div className="details-container" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
            
            <SuccessModal 
                show={successModal.show} 
                message={successModal.message} 
                onClose={() => setSuccessModal({ show: false, message: '' })} 
            />

            <button 
                // 💡 FIX: Added '/' to make it an absolute path
                onClick={() => navigate('/products')} 
                className="back-link"
                style={{ marginBottom: '20px', cursor: 'pointer', background: 'none', border: 'none', color: '#666', fontSize: '1rem' }}
            >
                <svg className="w-1 h-1 mr-1" style={{ width: '16px', height: '16px', display: 'inline-block', verticalAlign: 'middle' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Back to Products
            </button>

            <div className="details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                
                {/* Left: Image */}
                <div className="details-image-box" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9', borderRadius: '12px', minHeight: '400px' }}> 
                    <img 
                        src={fullImageUrl} 
                        alt={product.name} 
                        className="details-product-img" 
                        style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain', borderRadius: '8px' }}
                    />
                </div>
                
                {/* Right: Info */}
                <div className="details-info-section" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h1 style={{ color: '#333', marginBottom: '10px' }}>{product.name}</h1>
                    
                    <p className="price" style={{ fontSize: '2rem', color: '#d63384', fontWeight: 'bold', margin: '10px 0' }}>
                        ₱{formattedPrice}
                    </p>
                    
                    <p style={{ color: '#555', lineHeight: '1.6', marginBottom: '20px' }}>
                        {product.description || 'No detailed description available.'}
                    </p>

                    <p style={{ marginBottom: '30px', color: isOutOfStock ? 'red' : 'green', fontWeight: '600' }}>
                        {isOutOfStock ? 'Out of Stock' : `In Stock (${stockAvailable} available)`}
                    </p>
                    
                    <div className="details-button-group" style={{ display: 'flex', gap: '15px' }}>
                        <button 
                            className="primary-add-to-cart-btn"
                            onClick={handleAddToCartClick}
                            disabled={isOutOfStock}
                            style={{ 
                                padding: '15px 30px', 
                                backgroundColor: isOutOfStock ? '#ccc' : '#d63384', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '30px', 
                                fontSize: '1.1rem', 
                                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                        
                        <button 
                            className="secondary-btn"
                            onClick={() => navigate('/cart')}
                            style={{ 
                                padding: '15px 30px', 
                                backgroundColor: 'white', 
                                color: '#d63384', 
                                border: '2px solid #d63384', 
                                borderRadius: '30px', 
                                fontSize: '1.1rem', 
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
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