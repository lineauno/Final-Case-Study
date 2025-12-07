import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import CartItem from '../../components/Cart/CartItem';
import DeleteConfirmationModal from '../../components/Layout/DeleteConfirmationModal';
import SuccessModal from '../../components/Layout/SuccessModal';

// 💡 Define Backend URL for Smart Image Logic
const BACKEND_BASE_URL = 'http://localhost:8082';

function CartPage() {
    const { cart, cartCount, isLoading, cartTotal, handleRemoveFromCart } = useCart(); 
    
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: '' });
    const [successModal, setSuccessModal] = useState({ show: false, message: '' });
    const [isProcessing, setIsProcessing] = useState(false);

    // --- HELPER FUNCTION: Smart Image Logic for a single item ---
    const getCorrectedImageUrl = (rawUrl) => {
        if (!rawUrl) {
            return `${BACKEND_BASE_URL}/assets/images/default.png`;
        }
        
        // If the URL doesn't start with 'http', assume it's a local/storage path that needs the base URL.
        if (!rawUrl.startsWith('http')) {
            const correctedPath = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`;
            return `${BACKEND_BASE_URL}${correctedPath}`;
        }
        
        return rawUrl;
    };

    // --- Main Logic ---

    const initiateDelete = (item) => {
        const targetId = item.product_id || item.id;
        
        setDeleteModal({
            show: true,
            id: targetId,         
            name: item.product.name 
        });
    };

    const confirmDelete = async () => {
        const idToDelete = deleteModal.id;
        setDeleteModal({ show: false, id: null, name: '' }); 
        setIsProcessing(true);

        try {
            await handleRemoveFromCart(idToDelete);
            
            setSuccessModal({ show: true, message: "Item removed from cart!" });
        } catch (error) {
            console.error("Failed to remove item:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const cancelDelete = () => {
        setDeleteModal({ show: false, id: null, name: '' });
    };

    const closeSuccessModal = () => {
        setSuccessModal({ show: false, message: '' });
    };

    // --- Map Cart Items and Apply Smart Image Feature ---
    const processedCart = cart.map(item => ({
        ...item,
        product: {
            ...item.product,
            // 💡 Apply the smart logic to fix the image URL before rendering the CartItem
            image_url: getCorrectedImageUrl(item.product.image_url)
        }
    }));


    if (isLoading) {
        return <div className="cart-page-container" style={{textAlign:'center', padding:'50px'}}>Loading cart...</div>;
    }

    if (cartCount === 0) {
        return (
            <div className="cart-page-container">
                <h1 className="cart-title-brand">Your Shopping Cart</h1>
                <div className="empty-cart-card">
                    <h2>Your cart is currently empty!</h2>
                    <p>It looks like you haven't added anything to your cart yet.</p>
                    <Link to="/products" className="empty-cart-link">
                        Start Shopping Now
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page-container">
            
            <DeleteConfirmationModal 
                show={deleteModal.show} 
                onConfirm={confirmDelete} 
                onCancel={cancelDelete} 
                itemName={deleteModal.name} 
            />
            
            <SuccessModal 
                show={successModal.show} 
                message={successModal.message} 
                onClose={closeSuccessModal} 
            />

            <h1 className="cart-title-brand">Your Shopping Cart ({cartCount} Items)</h1>
            
            <div className="cart-items-box">
                {/* 💡 Use the processedCart array */}
                {processedCart.map(item => (
                    <CartItem 
                        key={item.product_id} 
                        item={item} 
                        onDeleteClick={() => initiateDelete(item)}
                        isProcessing={isProcessing}
                    />
                ))}
            </div>

            <div className="cart-actions-box">
                <div className="cart-summary-total">
                    <span>Subtotal:</span>
                    <span className="price">
                        ₱{parseFloat(cartTotal || 0).toFixed(2)}
                    </span>
                </div>

                <div className="cart-action-buttons">
                    <Link to="/products" className="continue-shopping-btn">
                        Continue Shopping
                    </Link>
                    <Link to="/checkout" className="proceed-to-checkout-btn">
                        Proceed to Checkout
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default CartPage;