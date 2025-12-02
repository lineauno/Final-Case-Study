import React from 'react';
import { FaTrashAlt, FaMinus, FaPlus } from 'react-icons/fa';
import { useCart } from '../../contexts/CartContext';
import { Link } from 'react-router-dom';

const BACKEND_BASE_URL = 'http://localhost:8082'; 

// 💡 FIX: Accept 'onDeleteClick' and 'isProcessing' from parent
const CartItem = ({ item, onDeleteClick, isProcessing }) => {
    const { updateCartItem } = useCart(); 

    // 1. Safety Check
    if (!item || !item.product) {
        return null;
    }

    // 2. Data Prep
    const rawPrice = item.product.price ?? 0;
    const productPrice = parseFloat(rawPrice);
    const productName = item.product.name ?? 'Deleted Product';
    
    const rawImage = item.product.image_url;
    const productImageUrl = rawImage && rawImage.startsWith('http')
        ? rawImage 
        : rawImage
            ? `${BACKEND_BASE_URL}${rawImage}`
            : `${BACKEND_BASE_URL}/assets/images/default.png`;

    const subtotal = productPrice * item.quantity;

    // 💡 LOGIC: Handle Quantity Decrease
    const handleDecrease = () => {
        if (item.quantity > 1) {
            // Normal decrease
            updateCartItem(item.id, item.quantity - 1);
        } else {
            // Quantity is about to be 0? Trigger the Parent Modal
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

                {/* 💡 LOGIC: Delete Button Triggers Parent Modal */}
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