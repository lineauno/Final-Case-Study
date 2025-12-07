import React, { useState, useEffect } from 'react';
import { useProduct } from '../../contexts/ProductContext';
import ProductCard from '../../components/Common/ProductCard';
import api from '../../services/api';

import SuccessModal from '../../components/Layout/SuccessModal';
//import '../../pagesstyles/HomePage.css';

// 💡 Define Backend URL for Smart Image Logic
const BACKEND_BASE_URL = 'http://localhost:8082';

/**
 * ProductListingPage: This component displays a grid of all available products.
 * It integrates with the ProductContext to load initial data and provides 
 * search functionality via a separate API call. It also handles success notifications
 * when an item is added to the cart from the ProductCard component.
 */
function ProductListingPage() {
    const { products, isLoading, error } = useProduct();

    const [searchQuery, setSearchQuery] = useState('');
    const [displayedProducts, setDisplayedProducts] = useState([]);
    
    const [successModal, setSuccessModal] = useState({ show: false, message: '' });

    // --- HELPER FUNCTION: Smart Image Logic ---
    // This function applies the logic to the entire product array
    const applySmartImageLogic = (productsArray) => {
        if (!Array.isArray(productsArray)) return [];

        return productsArray.map(product => {
            let fullImageUrl = product.image_url;

            if (fullImageUrl) {
                // If the URL doesn't start with 'http', we assume it's a local/storage path that needs the base URL.
                if (!fullImageUrl.startsWith('http')) {
                    // Ensure the path has a leading slash before prepending the base URL
                    const correctedPath = fullImageUrl.startsWith('/') ? fullImageUrl : `/${fullImageUrl}`;
                    fullImageUrl = `${BACKEND_BASE_URL}${correctedPath}`;
                }
            } else {
                // Use a default image if no URL is provided
                fullImageUrl = `${BACKEND_BASE_URL}/assets/images/default.png`;
            }

            return {
                ...product,
                image_url: fullImageUrl // Override the product's image_url with the absolute URL
            };
        });
    };

    useEffect(() => {
        if (products) {
            // 💡 1. Apply the smart image logic when initial products are loaded
            setDisplayedProducts(applySmartImageLogic(products));
        }
    }, [products]);

    /* * --- Search Logic ---
     * handleSearch: Executes the product search by calling the dedicated search API endpoint
     * with the current `searchQuery`. 
     */
    const handleSearch = async () => {
        try {
            console.log("Searching for:", searchQuery);
            const results = await api.searchProducts(searchQuery);

            let searchData = [];
            // Handle Laravel Pagination Structure (.data) or raw array
            if (results && results.data && Array.isArray(results.data)) {
                searchData = results.data;
            } else if (Array.isArray(results)) {
                searchData = results;
            }
            
            // 💡 2. Apply the smart image logic to search results as well
            setDisplayedProducts(applySmartImageLogic(searchData));

        } catch (err) {
            console.error("Search error:", err);
        }
    };

    /* * --- Input Handlers ---
     * handleKeyDown: Triggers the search functionality when the 'Enter' key is pressed in the search input field.
     */
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    /* * --- Success Notification Handlers ---
     * showSuccessNotification: Displays the success modal after an item is added to the cart.
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

    /* * --- Conditional Rendering --- */
    if (isLoading) return <div className="loading-style">Loading All Products...</div>;
    if (error) return <div className="error-message">{error}</div>;

    /* * --- Main Render Structure --- */
    return (
        <div className="products-page"> 
            
            {/* RENDER SUCCESS MODAL */}
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
                        // The product passed here now has the absolute image URL
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