import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext'; 

const CartContext = createContext();

/**
 * Custom hook to access shopping cart context.
 * Exposes the cart collection, derived counts, and transaction methods.
 */
export const useCart = () => useContext(CartContext);

/**
 * CartProvider Component
 * Synchronizes the user's shopping cart with the server. It monitors 
 * authentication status to fetch or clear data and provides globally 
 * accessible methods for managing items and quantities.
 */
export const CartProvider = ({ children }) => {
    const { isAuthenticated, isLoading: authLoading } = useAuth(); 
    
    const [cartData, setCartData] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Derived State
     * - cartItems: The flat array of products in the cart.
     * - cartCount: Total number of units across all items.
     * - cartTotal: The calculated monetary sum of the cart.
     */
    const cartItems = cartData?.cart?.items || [];
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0); 
    const cartTotal = parseFloat(cartData?.cart?.total) || 0; 
    
    /**
     * Search helper to verify if a specific product ID is currently 
     * present in the user's cart items.
     */
    const isItemInCart = (productId) => {
        return cartItems.some(item => item.product_id === productId);
    };

    /**
     * Synchronization Logic
     * Retrieves the latest cart state from the API if the user is authenticated.
     * Resets the state if the user logs out or if the session is still loading.
     */
    const fetchCart = async () => {
        if (authLoading || !isAuthenticated) {
            setCartData(null); 
            setIsLoading(false);
            return;
        }
        try {
            const data = await api.getCart(); 
            setCartData(data); 
        } catch (err) {
            console.error("Failed to fetch cart:", err);
            setCartData(null);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Observer Hook
     * Triggers fetchCart whenever authentication states change or 
     * initialization is completed.
     */
    useEffect(() => {
        if (!authLoading) {
            fetchCart();
        }
    }, [isAuthenticated, authLoading]); 

    /**
     * Item Addition Handler
     * Dispatches a request to add a product. Updates the context state
     * with returned data from the server. Requires an active authentication session.
     */
    const handleAddToCart = async (productId, quantity = 1) => {
        if (!isAuthenticated) {
            alert("Please log in to add items to your cart.");
            throw new Error("Authentication Required"); 
        }
        try {
            const finalQuantity = parseInt(quantity);
            if (isNaN(finalQuantity) || finalQuantity < 1) return;
            
            const updatedData = await api.addToCart(productId, finalQuantity);
            setCartData(updatedData); 
            return updatedData;
            
        } catch (err) {
            const errorMessage = err.message || "Error adding item to cart.";
            alert(`Error adding item to cart: ${errorMessage}`);
            throw err;
        }
    };
    
    /**
     * Item Deletion Handler
     * Permanently removes a record from the cart based on record ID.
     */
    const handleRemoveFromCart = async (targetId) => {
        if (!isAuthenticated) return;
        try {
            const data = await api.removeFromCart(targetId);
            setCartData(data); 
        } catch (err) {
            console.error("Error removing item:", err);
            throw err; 
        }
    };

    /**
     * Quantity Modification Handler
     * Updates an existing line item's quantity. If the new quantity 
     * is set to zero, the item is automatically removed from the cart.
     */
    const updateCartItem = async (cartItemId, newQuantity) => {
        if (!isAuthenticated) return;
        
        const finalQuantity = parseInt(newQuantity);
        if (isNaN(finalQuantity) || finalQuantity < 0) return;

        try {
            let data; 
            if (finalQuantity === 0) {
                data = await api.removeFromCart(cartItemId); 
            } else {
                data = await api.updateCartItem(cartItemId, finalQuantity);
            }
            setCartData(data); 

        } catch (err) {
            console.error("Error updating cart item:", err);
            alert(`Error updating cart item: ${err.message}`);
        }
    };
    
    const value = {
        cart: cartItems, 
        cartCount, 
        cartTotal, 
        isLoading, 
        fetchCart, 
        handleAddToCart, 
        updateCartItem, 
        handleRemoveFromCart,
        isItemInCart, 
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};