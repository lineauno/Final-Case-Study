import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api'; 

const ProductContext = createContext();

export const useProduct = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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
            setTimeout(() => setIsLoading(false), 300); 
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);
    
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