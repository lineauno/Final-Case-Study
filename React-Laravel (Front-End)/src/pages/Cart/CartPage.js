import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import CartItem from '../../components/Cart/CartItem';
import DeleteConfirmationModal from '../../components/Layout/DeleteConfirmationModal';
import SuccessModal from '../../components/Layout/SuccessModal';

/**
 * CartPage: Displays the user's shopping cart contents, total, and checkout actions.
 * It integrates with the CartContext for data and CRUD operations, and uses modals 
 * for confirmation before item removal.
 */
function CartPage() {
    /* * --- Cart Context  ---
     * Destructure necessary values and handlers from the CartContext. 
     * handleRemoveFromCart is the key function for deleting items via API.
     */
    const { cart, cartCount, isLoading, cartTotal, handleRemoveFromCart } = useCart(); 
    
    /* --- MODAL STATE -- */
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: '' });
    const [successModal, setSuccessModal] = useState({ show: false, message: '' });
    const [isProcessing, setIsProcessing] = useState(false);

    // --- DELETE LOGIC ---
    
    /* * initiateDelete: Function passed to CartItem to be called when the trash icon is clicked.
     * It extracts the product ID and sets the state to display the DeleteConfirmationModal.
     * It prioritizes 'product_id' which is typically the unique cart item identifier on the backend.
     */
    const initiateDelete = (item) => {
        const targetId = item.product_id || item.id;
        
        setDeleteModal({
            show: true,
            id: targetId,           
            name: item.product.name 
        });
    };

    /* * confirmDelete: Executes the asynchronous item removal after user confirmation.
     * It closes the confirmation modal, sets processing state, calls the context's removal handler, 
     * and displays a success notification.
     */
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

    /* * cancelDelete: Closes the confirmation modal without performing any action.
     */
    const cancelDelete = () => {
        setDeleteModal({ show: false, id: null, name: '' });
    };

    /* * closeSuccessModal: Closes the success notification modal.
     */
    const closeSuccessModal = () => {
        setSuccessModal({ show: false, message: '' });
    };

    // --- Conditional Rendering ---

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

    /* * --- Main Render ---
     * Renders the CartPage with the list of CartItem components, the total summary, 
     * and the checkout/shopping links. Modals are placed at the top level of the return for overlay display.
     */
    return (
        <div className="cart-page-container">
            
            {/* RENDER MODALS */}
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