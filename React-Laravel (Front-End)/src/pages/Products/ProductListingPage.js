import React, { useState, useEffect } from 'react';
import { useProduct } from '../../contexts/ProductContext';
import ProductCard from '../../components/Common/ProductCard';
import api from '../../services/api';

import SuccessModal from '../../components/Layout/SuccessModal';

const BACKEND_BASE_URL = 'http://localhost:8082';

/**
 * ProductListingPage Component
 * Provides an interface for browsing the full product catalog.
 * It coordinates initial data load from the global context, executes search queries
 * against the backend API, and normalizes product image URLs for consistent rendering.
 */
function ProductListingPage() {
    const { products, isLoading, error } = useProduct();

    const [searchQuery, setSearchQuery] = useState('');
    const [displayedProducts, setDisplayedProducts] = useState([]);
    
    const [successModal, setSuccessModal] = useState({ show: false, message: '' });

    /**
     * Smart Image Resolution Helper
     * Processes an array of products to ensure all image paths are absolute URLs.
     * Appends the BACKEND_BASE_URL to local storage paths or provides a standard fallback asset.
     */
    const applySmartImageLogic = (productsArray) => {
        if (!Array.isArray(productsArray)) return [];

        return productsArray.map(product => {
            let fullImageUrl = product.image_url;

            if (fullImageUrl) {
                if (!fullImageUrl.startsWith('http')) {
                    const correctedPath = fullImageUrl.startsWith('/') ? fullImageUrl : `/${fullImageUrl}`;
                    fullImageUrl = `${BACKEND_BASE_URL}${correctedPath}`;
                }
            } else {
                fullImageUrl = `${BACKEND_BASE_URL}/assets/images/default.png`;
            }

            return {
                ...product,
                image_url: fullImageUrl
            };
        });
    };

    /**
     * Observer Hook: Global Context Synchronization
     * Automatically applies image normalization whenever the global product list updates.
     */
    useEffect(() => {
        if (products) {
            setDisplayedProducts(applySmartImageLogic(products));
        }
    }, [products]);

    /**
     * handleSearch
     * Executes an asynchronous search query using the provided input.
     * Standardizes results (handling raw arrays or paginated data structures) 
     * before applying normalization logic to the local state.
     */
    const handleSearch = async () => {
        try {
            console.log("Searching for:", searchQuery);
            const results = await api.searchProducts(searchQuery);

            let searchData = [];
            if (results && results.data && Array.isArray(results.data)) {
                searchData = results.data;
            } else if (Array.isArray(results)) {
                searchData = results;
            }
            
            setDisplayedProducts(applySmartImageLogic(searchData));

        } catch (err) {
            console.error("Search error:", err);
        }
    };

    /**
     * Key listener to allow triggering searches via the 'Enter' key.
     */
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    /**
     * showSuccessNotification
     * Callback passed to child components to trigger the global success feedback modal.
     */
    const showSuccessNotification = (productName) => {
        setSuccessModal({ 
            show: true, 
            message: `${productName} added to cart successfully! 🛒` 
        });
    };

    const closeSuccessModal = () => {
        setSuccessModal({ show: false, message: '' });
    };

    if (isLoading) return <div className="loading-style">Loading All Products...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="products-page"> 
            
            <SuccessModal 
                show={successModal.show} 
                message={successModal.message} 
                onClose={closeSuccessModal} 
            />

            <h2>Our Crafting Essentials</h2>
            <p>Explore our curated collection of high-quality art and craft supplies.</p>

            <div className="search-bar">
                <input 
                    type="text" 
                    className="search-input" 
                    placeholder="Search essentials..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button className="search-button" aria-label="Search" onClick={handleSearch}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </button>
            </div>

            <div className="product-grid-page">
                {displayedProducts.map(product => (
                    <ProductCard 
                        key={product.id} 
                        product={product} 
                        onAddToCartSuccess={showSuccessNotification} 
                    />
                ))}
            </div>
            {displayedProducts.length === 0 && <p>No products found at this time.</p>}
        </div>
    );
}

export default ProductListingPage;