import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext'; 

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
	const { isAuthenticated, isLoading: authLoading } = useAuth(); 
	
	const [cartData, setCartData] = useState(null); 
	const [isLoading, setIsLoading] = useState(true);

	const cartItems = cartData?.cart?.items || [];
	const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0); 
	const cartTotal = parseFloat(cartData?.cart?.total) || 0; 
	
	const isItemInCart = (productId) => {
		return cartItems.some(item => item.product_id === productId);
	};

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

	useEffect(() => {
		if (!authLoading) {
			fetchCart();
		}
	}, [isAuthenticated, authLoading]); 

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