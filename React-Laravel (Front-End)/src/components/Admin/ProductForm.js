import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

// ProductForm component handles the logic and UI for creating or editing a product
function ProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = id && id !== 'new';
    
    // State hook to manage all input fields for the product
    const [formData, setFormData] = useState({
        name: '', price: '', stock: '', category_id: '', description: '',
    });
    // State to hold the list of available categories fetched from the backend
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(isEditing);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // useEffect hook for fetching initial necessary data (categories and existing product data if editing)
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const cats = await api.request('/admin/categories');
                setCategories(cats);
                
                if (isEditing) {
                    const productData = await api.request(`/admin/products/${id}`);
                    setFormData({
                        name: productData.name,
                        price: productData.price,
                        stock: productData.stock,
                        category_id: productData.category_id || '',
                        description: productData.description || '',
                    });
                }
            } catch (err) {
                setError("Failed to load data.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, [id, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            if (isEditing) {
                await api.request(`/admin/products/${id}`, 'PUT', formData);
                alert('Product updated successfully!');
            } else {
                await api.request('/admin/products', 'POST', formData);
                alert('Product created successfully!');
            }
            navigate('/admin');
        } catch (err) {
            setError(err.message || 'Submission failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="loading-style">Loading Form...</div>;

    return (
        <div className="admin-product-form">
            {/* Display a dynamic title based on whether the form is for editing or creation */}
            <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
            {/* Display the error message if the error state is not null */}
            {error && <div className="admin-error">{error}</div>}

            {/* Form element with the submission handler */}
            <form onSubmit={handleSubmit}>
                {/* Input block for Product Name */}
                <label>Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                
                {/* Input block for Product Price */}
                <label>Price (₱):</label>
                {/* Input type number for price, requiring a minimum value and step for currency */}
                <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0.01" step="0.01" />

                {/* Input block for Product Stock/Quantity */}
                <label>Stock:</label>
                {/* Input type number for stock, requiring a minimum value of 0 */}
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} required min="0" />

                {/* Dropdown block for Category Selection */}
                <label>Category:</label>
                <select name="category_id" value={formData.category_id} onChange={handleChange} required>
                    {/* Default option for selection */}
                    <option value="">-- Select Category --</option>
                    {/* Map over the fetched categories to create options */}
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>

                {/* Textarea block for Product Description */}
                <label>Description:</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="4" />

                {/* Action buttons container */}
                <div className="form-actions">
                    {/* Submit button with dynamic text and disabled state */}
                    <button type="submit" disabled={isSubmitting} className="admin-save-btn">
                        {isSubmitting ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
                    </button>
                    {/* Cancel button that navigates back to the admin dashboard */}
                    <button type="button" onClick={() => navigate('/admin')} className="admin-cancel-btn">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ProductForm;