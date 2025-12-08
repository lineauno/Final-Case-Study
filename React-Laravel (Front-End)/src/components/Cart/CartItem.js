import React from 'react';
import { FaTrashAlt, FaMinus, FaPlus } from 'react-icons/fa';
import { useCart } from '../../contexts/CartContext';
import { Link } from 'react-router-dom';

const BACKEND_BASE_URL = 'http://localhost:8082'; 

/**
 * CartItem Component
 * Renders a row within the shopping cart representing a specific product entry.
 * Displays product metadata, provides quantity control toggles, and calculates
 * item-specific subtotals.
 */
const CartItem = ({ item, onDeleteClick, isProcessing }) => {
    const { updateCartItem } = useCart(); 

    /**
     * Safety Check
     * Prevents rendering if the item or associated product data is missing.
     */
    if (!item || !item.product) {
        return null;
    }

    /**
     * Product Metadata Normalization
     * Resolves fallbacks for prices and names, and constructs absolute image URLs
     * by checking if the source is a full link or a local asset requiring the backend base URL.
     */
    const rawPrice = item.product.price ?? 0;
    const productPrice = parseFloat(rawPrice);
    const productName = item.product.name ?? 'Deleted Product';
    
    const rawImage = item.product.image_url;
    const productImageUrl = rawImage && rawImage.startsWith('http')
        ? rawImage 
        : rawImage
            ? `${BACKEND_BASE_URL}/${rawImage.startsWith('/') ? rawImage.substring(1) : rawImage}`
            : `${BACKEND_BASE_URL}/assets/images/default.png`;

    const subtotal = productPrice * item.quantity;

    /**
     * Quantity Reduction Logic
     * If quantity > 1, dispatches an update to the cart context.
     * If quantity is 1, triggers the deletion handler to remove the item from the cart.
     */
    const handleDecrease = () => {
        if (item.quantity > 1) {
            updateCartItem(item.id, item.quantity - 1);
        } else {
            onDeleteClick(); 
        }
    };

    return (
        <div className="cart-item-row">
            <div className="cart-item-details">
                <Link to={`/products/${item.product.id}`}>
                    <img
                        src={productImageUrl}
                        alt={productName}
                        className="cart-item-thumbnail"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/64x64/cccccc/333333?text=No+Img"; }}
                    />
                </Link>

                <div className='flex-grow'>
                    <Link to={`/products/${item.product.id}`} className="font-semibold text-gray-900 hover:text-pink-600" title={productName}>
                        {productName}
                    </Link>
                    <p className="text-gray-500 text-sm">₱{productPrice.toFixed(2)}</p>
                </div>
            </div>

            <div className="cart-item-controls">
                <div className='qty-controls'>
                    <button
                        onClick={handleDecrease}
                        disabled={isProcessing} 
                    >
                        <FaMinus />
                    </button>
                    <span className="text-gray-800">{item.quantity}</span>
                    <button
                        onClick={() => updateCartItem(item.id, item.quantity + 1)}
                        disabled={isProcessing}
                    >
                        <FaPlus />
                    </button>
                </div>

                <p className="font-bold text-gray-800 w-20 text-right">₱{subtotal.toFixed(2)}</p>

                <button
                    className="remove-item-btn"
                    onClick={onDeleteClick}
                    aria-label="Remove Item"
                    disabled={isProcessing}
                >
                    <FaTrashAlt />
                </button>
            </div>
        </div>
    );
};

export default CartItem;