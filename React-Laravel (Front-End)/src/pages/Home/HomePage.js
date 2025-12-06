import React from 'react';
import { Link } from 'react-router-dom';
import { useProduct } from '../../contexts/ProductContext';
import ProductCard from '../../components/Common/ProductCard';

function HomePage() {
    const { products, isLoading, error } = useProduct();

    const featuredProducts = products.slice(0, 4); 

    return (
        <div className="home-page-wrapper">
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