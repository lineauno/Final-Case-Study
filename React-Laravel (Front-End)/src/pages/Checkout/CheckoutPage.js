// src/pages/Checkout/CheckoutPage.js

import React, { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext'; 
import { useAuth } from '../../contexts/AuthContext'; // Assuming this is needed for user details
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const BRAND_PINK_TEXT = 'text-pink-500'; 

function CheckoutPage() {
    const { cart, cartTotal, isLoading, fetchCart } = useCart();
    const { user } = useAuth(); 
    
    const navigate = useNavigate();
    const [address, setAddress] = useState(''); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const isProcessing = isSubmitting; 
    const cartItems = cart; 

    // --- Core Calculations ---
    const subtotal = cartTotal; 
    const shippingRate = 50.00; 
    const shipping = cart.length > 0 ? shippingRate : 0.00;
    const TAX_RATE = 0.05; 
    
    const tax = subtotal * TAX_RATE; 
    const finalTotal = subtotal + shipping + tax; 

    useEffect(() => {
        if (user && user.shipping_address) {
            setAddress(user.shipping_address);
        }
    }, [user]);

    // --- Initial Loading/Empty Checks ---
    if (isLoading) {
        return <div className="checkout-page container">Loading checkout details...</div>;
    }
    
    if (cart.length === 0) {
        navigate('/cart');
        return null;
    }

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!address) { 
            setError('Please enter a shipping address.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await api.checkout({ shipping_address: address, total: finalTotal });
            
            fetchCart(); 
            alert(response.message || 'Order placed!');
            navigate('/orders'); 
            
        } catch (err) {
            setError(err.message || 'There was an issue processing your order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="checkout-page-container">
            <h1>Secure Checkout</h1>
            
            {/* The main layout container needs proper grid/flex styles */}
            <div className="checkout-grid">
                
                {/* LEFT COLUMN: Shipping and Payment Form (Wider) */}
                {/* 🛑 CHANGE 1: Add id="checkout-form" to link the remote button */}
                <form onSubmit={handlePlaceOrder} id="checkout-form" className="checkout-form-box">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Shipping & Payment</h3>
                    
                    {error && <div className="error-message">{error}</div>}
                    
                    <div className="form-field-wrapper">
                        <input type="text" placeholder="Full Name" required className="checkout-input" defaultValue={user?.name || ''} />
                    </div>
                    <div className="form-field-wrapper">
                        <input type="email" placeholder="Email Address" required className="checkout-input" defaultValue={user?.email || ''} />
                    </div>
                    <div className="form-field-wrapper">
                        <input 
                            type="text" 
                            placeholder="Address Line 1" 
                            required 
                            className="checkout-input" 
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div> 
                    {/* Simplified City/Postal code in one row for better grid use */}
                    <div className="form-field-wrapper flex space-x-4"> 
                        <input type="text" placeholder="City" required className="checkout-input flex-1" />
                    </div>
                    
                    <div className="form-field-wrapper flex space-x-4"> 
                        <input type="text" placeholder="Postal Code" required className="checkout-input flex-1" />
                    </div>


                    <select required className="checkout-input">
                        <option value="">Select Payment Option</option>
                        <option value="cod">Cash on Delivery</option>
                        <option value="gcash">GCash</option> 
                        <option value="card">Credit / Debit Card</option>
                    </select>

                    {/* 🛑 CHANGE 2: The button is removed from here */}
                    {/* <button
                        type="submit"
                        disabled={cartItems.length === 0 || isProcessing}
                        className="primary-checkout-btn mt-6 w-full" 
                    >
                        {isProcessing ? 'Processing Order...' : `Place Order – ₱${finalTotal.toFixed(2)}`}
                    </button> 
                    */}
                    
                    <p className="text-xs text-gray-500 text-center mt-3">By placing your order, you agree to the terms and conditions.</p>
                </form>

                {/* RIGHT COLUMN: Order Summary Box (Narrower) */}
                <div className="order-summary-box">
                    <h3>Order Summary</h3>
                    
                    <div className="space-y-2 text-gray-700">
                        <div className="summary-line-item"><span>Items ({cartItems.length})</span><span>₱{subtotal.toFixed(2)}</span></div>
                        <div className="summary-line-item"><span>Shipping</span><span>₱{shipping.toFixed(2)}</span></div>
                        <div className="summary-line-item"><span>Tax (5%)</span><span>₱{tax.toFixed(2)}</span></div>
                        
                        <div className="summary-total"><span>Order Total</span><span>₱{finalTotal.toFixed(2)}</span></div>
                    </div>

                    {/* 🛑 CHANGE 3: Add the button here, inside the order-summary-box, after the total */}
                    <button
                        type="submit"
                        form="checkout-form" // This links the button to the form element on the left
                        disabled={cartItems.length === 0 || isProcessing}
                        className="place-order-btn" 
                    >
                        {isProcessing ? 'Processing Order...' : `Place Order`}
                    </button>

                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;