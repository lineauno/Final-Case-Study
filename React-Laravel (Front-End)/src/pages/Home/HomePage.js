import React from 'react';
import { Link } from 'react-router-dom';
import { useProduct } from '../../contexts/ProductContext';
import ProductCard from '../../components/Common/ProductCard';

/**
 * HomePage Component
 * * Serves as the landing page for the application. It features a hero banner, 
 * a dynamic grid of featured products pulled from the ProductContext, and 
 * an informational section regarding brand quality.
 */
function HomePage() {
    /**
     * Consumes product data from global state.
     * Maps loading and error states to provide appropriate UI feedback.
     */
    const { products, isLoading, error } = useProduct();

    /**
     * Featured Selection Logic
     * Selects the first four items from the global product array to 
     * showcase on the landing page.
     */
    const featuredProducts = products.slice(0, 4); 

    return (
        <div className="home-page-wrapper">
            {/* Hero Section: Branding and initial CTA */}
            <div className="home-hero-section"> 
                <div className="hero-content container">
                    <h1 className="hero-title" style={{ color: '#ff8ba7', fontSize: '3rem', fontWeight: '700' }}>
                        Unleash Your Inner Craftsperson
                    </h1>
                    <p className="hero-subtitle">
                        High-quality art supplies and kits to inspire your next creation. Find everything you need for painting, drawing, and crafting, all in one place.
                    </p>
                    <Link to="/products" className="shop-now-button"> 
                        Shop Now
                    </Link>
                </div>
            </div>

            {/* Featured Section: Renders a slice of the product catalog using reusable cards */}
            <div className="featured-products-container"> 
                <h2 className="section-title" style={{ color: '#ff8ba7', fontSize: '2rem', fontWeight: '700' }}>Featured Products</h2>
                
                {isLoading ? (
                    <div className="loading-container">Loading featured products...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <div className="featured-grid"> 
                        {featuredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>

            {/* Info Section: Brief branding statement */}
            <div className="home-info-section"> 
                <div className="container">
                    <h2 style={{ color: '#ff8ba7' }}>Quality and Craftsmanship</h2>
                    <p>We source only the finest materials, ensuring every product helps you create masterpieces with ease and joy.</p>
                </div>
            </div>
            
        </div>
    );
}

export default HomePage;