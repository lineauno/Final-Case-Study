import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import CartItem from '../../components/Cart/CartItem';
import DeleteConfirmationModal from '../../components/Layout/DeleteConfirmationModal';
import SuccessModal from '../../components/Layout/SuccessModal';

const BACKEND_BASE_URL = 'http://localhost:8082';

/**
 * CartPage Component
 * Renders the main shopping cart interface for authenticated users. 
 * Coordinates cart state from context, performs image URL correction, 
 * and manages confirmation modals for item removal.
 */
function CartPage() {
    const { cart, cartCount, isLoading, cartTotal, handleRemoveFromCart } = useCart(); 
    
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: '' });
    const [successModal, setSuccessModal] = useState({ show: false, message: '' });
    const [isProcessing, setIsProcessing] = useState(false);

    /**
     * Smart Image Normalization
     * Resolves product image paths by determining if they are external links 
     * or relative storage paths. Appends the backend base URL to local paths 
     * and provides a standard fallback for missing assets.
     */
    const getCorrectedImageUrl = (rawUrl) => {
        if (!rawUrl) {
            return `${BACKEND_BASE_URL}/assets/images/default.png`;
        }
        
        if (!rawUrl.startsWith('http')) {
            const correctedPath = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`;
            return `${BACKEND_BASE_URL}${correctedPath}`;
        }
        
        return rawUrl;
    };

    /**
     * Item Removal Orchestration
     * initiateDelete: Captures item metadata to trigger the confirmation modal.
     * confirmDelete: Executes the context-level removal logic, handles 
     * processing states, and displays feedback upon success.
     */
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

    /**
     * Optimistic State Processing
     * Maps the current cart data to an array where product images are 
     * fully resolved and normalized before being passed to child components.
     */
    const processedCart = cart.map(item => ({
        ...item,
        product: {
            ...item.product,
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