import React from 'react';
import { FaTrashAlt, FaMinus, FaPlus } from 'react-icons/fa';
import { useCart } from '../../contexts/CartContext';
import { Link } from 'react-router-dom';

const BACKEND_BASE_URL = 'http://localhost:8083'; 

// CartItem component displays a single item within the shopping cart
const CartItem = ({ item, onDeleteClick, isProcessing }) => {
    const { updateCartItem } = useCart(); 

    if (!item || !item.product) {
        return null;
    }

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

    const handleDecrease = () => {
        if (item.quantity > 1) {
            updateCartItem(item.id, item.quantity - 1);
        } else {
            onDeleteClick(); 
        }
    };

    return (
        <div className="cart-item-row">
            {/* Container for product image and text details */}
            <div className="cart-item-details">
                {/* Link wrapper around the image to navigate to the product page */}
                <Link to={`/products/${item.product.id}`}>
                    <img
                        src={productImageUrl}
                        alt={productName}
                        className="cart-item-thumbnail"
                        // Error handling: replace broken images with a placeholder image
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/64x64/cccccc/333333?text=No+Img"; }}
                    />
                </Link>

                <div className='flex-grow'>
                    {/* Link for the product name */}
                    <Link to={`/products/${item.product.id}`} className="font-semibold text-gray-900 hover:text-pink-600" title={productName}>
                        {productName}
                    </Link>
                    {/* Display the unit price */}
                    <p className="text-gray-500 text-sm">₱{productPrice.toFixed(2)}</p>
                </div>
            </div>

            {/* Container for quantity controls and subtotal */}
            <div className="cart-item-controls">
                <div className='qty-controls'>
                    {/* Button to decrease quantity, disabled if a process is running */}
                    <button
                        onClick={handleDecrease}
                        disabled={isProcessing} 
                    >
                        <FaMinus />
                    </button>
                    {/* Display the current item quantity */}
                    <span className="text-gray-800">{item.quantity}</span>
                    {/* Button to increase quantity, disabled if a process is running */}
                    <button
                        // Directly calls updateCartItem with an increased quantity
                        onClick={() => updateCartItem(item.id, item.quantity + 1)}
                        disabled={isProcessing}
                    >
                        <FaPlus />
                    </button>
                </div>

                {/* Display the item's calculated subtotal */}
                <p className="font-bold text-gray-800 w-20 text-right">₱{subtotal.toFixed(2)}</p>

                {/* Button to remove the item from the cart */}
                <button
                    className="remove-item-btn"
                    // Triggers the parent component's delete logic (e.g., opens a modal)
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