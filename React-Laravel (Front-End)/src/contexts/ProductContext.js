import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api'; 

const ProductContext = createContext();

/**
 * Custom hook to access product context.
 * Provides access to the product list, loading status, errors, and the search function.
 */
export const useProduct = () => useContext(ProductContext);

/**
 * ProductProvider Component
 * Manages the global product state for the storefront.
 * Handles the retrieval of product data from the backend, manages global 
 * loading/error states, and coordinates catalog-wide search queries.
 */
export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Data Retrieval and Search Logic
     * Memoized callback to fetch products based on an optional search query.
     * Synchronizes backend responses with local context state and handles
     * network failure reporting.
     */
    const fetchProducts = useCallback(async (query = '') => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await api.searchProducts(query);
            setProducts(data);
            setError(null);
        } catch (err) {
            console.error('Fetch/Search Error:', err);
            setError("Failed to load products or perform search.");
        } finally {
            // Simulated delay to ensure smooth UI transitions
            setTimeout(() => setIsLoading(false), 300); 
        }
    }, []); 

    /**
     * Observer Hook
     * Triggers the initial catalog load upon context mount.
     */
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]); 
    
    /**
     * Interface to initiate a catalog search.
     * Passes the user's query string to the fetchProducts internal handler.
     */
    const searchProducts = (query) => {
        fetchProducts(query);
    };

    const value = {
        products, 
        isLoading, 
        error, 
        searchProducts, 
    };

    return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};