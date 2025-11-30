import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

function ProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = id && id !== 'new';
    
    const [formData, setFormData] = useState({
        name: '', price: '', stock: '', category_id: '', description: '',
    });
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(isEditing);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

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
                        category_id: productData.category_id || '', // Handle null category
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
            navigate('/admin'); // Redirect back to dashboard
        } catch (err) {
            setError(err.message || 'Submission failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="admin-loading">Loading Form...</div>;

    return (
        <div className="admin-product-form">
            <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
            {error && <div className="admin-error">{error}</div>}

            <form onSubmit={handleSubmit}>
                {/* Name */}
                <label>Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                
                {/* Price */}
                <label>Price (₱):</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0.01" step="0.01" />

                {/* Stock */}
                <label>Stock:</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} required min="0" />

                {/* Category */}
                <label>Category:</label>
                <select name="category_id" value={formData.category_id} onChange={handleChange} required>
                    <option value="">-- Select Category --</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>

                {/* Description */}
                <label>Description:</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="4" />

                <div className="form-actions">
                    <button type="submit" disabled={isSubmitting} className="admin-save-btn">
                        {isSubmitting ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
                    </button>
                    <button type="button" onClick={() => navigate('/admin')} className="admin-cancel-btn">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ProductForm;