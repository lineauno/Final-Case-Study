import React, { useState, useEffect } from 'react';
import { useProduct } from '../../contexts/ProductContext';
import ProductCard from '../../components/Common/ProductCard';
import api from '../../services/api';

import SuccessModal from '../../components/Layout/SuccessModal';
import '../../pagesstyles/HomePage.css';

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

	useEffect(() => {
		if (products) {
			setDisplayedProducts(products);
		}
	}, [products]);

	const handleSearch = async () => {
		try {
			console.log("Searching for:", searchQuery);
			const results = await api.searchProducts(searchQuery);

			if (results && results.data && Array.isArray(results.data)) {
				setDisplayedProducts(results.data);
			} else if (Array.isArray(results)) {
				setDisplayedProducts(results);
			} else {
				setDisplayedProducts([]);
			}

		} catch (err) {
			console.error("Search error:", err);
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			handleSearch();
		}
	};

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