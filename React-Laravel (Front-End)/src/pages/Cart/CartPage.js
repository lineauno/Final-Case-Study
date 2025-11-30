import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import CartItem from '../../components/Cart/CartItem';

// 💡 Import your custom modals
import DeleteConfirmationModal from '../../components/Layout/DeleteConfirmationModal';
import SuccessModal from '../../components/Layout/SuccessModal';

function CartPage() {
    const { cart, cartCount, isLoading, cartTotal, handleRemoveFromCart } = useCart(); 
    
    // --- MODAL STATE ---
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: '' });
    const [successModal, setSuccessModal] = useState({ show: false, message: '' });
    const [isProcessing, setIsProcessing] = useState(false);

    // --- DELETE LOGIC ---
    
    // 1. Triggered when user clicks trash icon on an item
    // This is passed down to CartItem via the 'onDeleteClick' prop
    const initiateDelete = (item) => {
        // Use product_id if available (safer), otherwise fallback to item id
        const targetId = item.product_id || item.id;
        
        setDeleteModal({
            show: true,
            id: targetId,           
            name: item.product.name 
        });
    };

    // 2. Triggered when user clicks "Yes, Delete" in the modal
    const confirmDelete = async () => {
        const idToDelete = deleteModal.id;
        setDeleteModal({ show: false, id: null, name: '' }); // Close confirm modal
        setIsProcessing(true);

        try {
            // Call Context function to delete from DB
            await handleRemoveFromCart(idToDelete);
            
            // Show success message
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
            
            {/* 💡 RENDER MODALS */}
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
                {cart.map(item => (
                    <CartItem 
                        key={item.product_id} 
                        item={item} 
                        // 💡 CRITICAL CHANGE: Pass the initiate function down
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