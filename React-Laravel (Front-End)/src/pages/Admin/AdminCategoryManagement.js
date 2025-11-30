import React, { useState, useEffect, useCallback } from 'react'; // 💡 Added useCallback
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/api';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; 
import DeleteConfirmationModal from '../../components/Layout/DeleteConfirmationModal';
import SuccessModal from '../../components/Layout/SuccessModal';

function AdminCategoryManagement() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({ id: null, name: '', slug: '', productCount: 0 });
    const [isEditing, setIsEditing] = useState(false);

    // --- MODAL STATES ---
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: '' });
    const [successModal, setSuccessModal] = useState({ show: false, message: '' });

    // --- FETCH CATEGORIES ---
    // 💡 FIX: Wrapped in useCallback to satisfy the useEffect dependency warning
    const fetchCategories = useCallback(async () => {
        // Only show full loader on very first mount
        // We check inside the setter to avoid dependency issues with 'categories' state
        setCategories(prev => {
            if (prev.length === 0) setIsLoading(true);
            return prev;
        });
        
        setError(null);
        try {
            const response = await getCategories(); 
            const dataArray = response.categories || response || [];
            if (Array.isArray(dataArray)) {
                setCategories(dataArray); 
            } else {
                setCategories([]); 
            }
        } catch (err) {
            setError("Failed to fetch categories.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []); // Empty array means this function never changes, so it's safe for useEffect

    // 🎯 Fetch categories from the backend on component mount
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]); // 💡 Now we can safely include it here
    
    // --- CRUD OPERATION ---
    
    const handleAddOrUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true); 
        setError(null);

        const categoryData = { name: form.name, slug: form.slug, description: form.description || '' };
        
        try {
            if (isEditing) {
                await updateCategory(form.id, categoryData);
                setSuccessModal({ show: true, message: "Category updated successfully!" });
            } else {
                await createCategory(categoryData);
                setSuccessModal({ show: true, message: "Category created successfully!" });
            }
            
            setForm({ id: null, name: '', slug: '', productCount: 0 });
            setIsEditing(false);
            await fetchCategories();
            
        } catch (err) {
            setError(err.message || "Failed to save category.");
        } finally {
            setIsLoading(false); 
        }
    };

    // --- DELETE LOGIC ---
    
    const handleDeleteClick = (category) => {
        setDeleteModal({
            show: true,
            id: category.id,
            name: category.name
        });
    };

    const confirmDelete = async () => {
        setDeleteModal({ show: false, id: null, name: '' });
        setIsLoading(true);
        
        try {
            await deleteCategory(deleteModal.id);
            setSuccessModal({ show: true, message: "Category deleted successfully!" });
            setCategories(prev => prev.filter(cat => cat.id !== deleteModal.id));
        } catch (err) {
            setError("Failed to delete category.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const cancelDelete = () => {
        setDeleteModal({ show: false, id: null, name: '' });
    };

    const closeSuccessModal = () => {
        setSuccessModal({ show: false, message: '' });
    };

    // --- Form Helpers ---
    const handleEdit = (category) => {
        setForm(category);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setForm({ id: null, name: '', slug: '', productCount: 0 });
        setIsEditing(false);
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    return (
        <main className="admin-main-grid"> 
            
            <DeleteConfirmationModal 
                show={deleteModal.show}
                itemName={deleteModal.name}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />

            <SuccessModal 
                show={successModal.show}
                message={successModal.message}
                onClose={closeSuccessModal}
            />

            {/* Left - Add/Edit Form Panel */}
            <section className="admin-card category-form-panel">
                <h3>{isEditing ? "Edit Category" : "Add New Category"}</h3>
                <form onSubmit={handleAddOrUpdate}>
                    <label>Category Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={form.name} 
                        onChange={handleChange} 
                        placeholder="e.g., Watercolor Sets" 
                        required 
                        disabled={isLoading} 
                    />

                    <label>Slug (URL Identifier)</label>
                    <input 
                        type="text" 
                        name="slug" 
                        value={form.slug} 
                        onChange={handleChange} 
                        placeholder="e.g., watercolor-sets" 
                        required 
                        disabled={isLoading} 
                    />
                    
                    {/* 💡 FIX: Display Error if it exists */}
                    {error && <p className="admin-error-text" style={{color: 'red', marginTop: '10px'}}>{error}</p>}

                    <div className="form-btns">
                        <button 
                            type="submit" 
                            className={isEditing ? "update-btn" : "add-btn"} 
                            disabled={isLoading} 
                        >
                            {isLoading ? "Saving..." : (isEditing ? "Update Category" : "Add Category")}
                        </button>
                        
                        {isEditing && (
                            <button 
                                type="button" 
                                className="cancel-btn" 
                                onClick={handleCancel}
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </section>
            
            {/* Right - Existing Categories List */}
            <section className="admin-card category-list-panel">
                <h3>Existing Categories ({categories.length})</h3>
                
                {/* Loading Logic */}
                {isLoading && categories.length === 0 ? (
                    <div className="admin-loading">Loading Categories...</div>
                ) : (
                    <div className="category-list">
                        {categories.length === 0 ? (
                            <p>No categories found.</p>
                        ) : (
                            categories.map((category) => (
                                <div key={category.id} className={`category-card ${isLoading ? 'dimmed' : ''}`}>
                                    <div className="category-details">
                                        <h4>{category.name}</h4>
                                        <p className="product-count-text">Slug: <strong>{category.slug}</strong></p>
                                    </div>
                                    <div className="category-actions">
                                        <button 
                                            className="edit-btn" 
                                            onClick={() => handleEdit(category)}
                                            disabled={isLoading}
                                        >
                                            <FaEdit /> Edit
                                        </button>
                                        <button 
                                            className="delete-btn" 
                                            onClick={() => handleDeleteClick(category)}
                                            disabled={isLoading}
                                        >
                                            <FaTrashAlt /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </section>
        </main>
    );
}

export default AdminCategoryManagement;