import React, { useState, useEffect, useCallback } from 'react'; 
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/api';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; 
import DeleteConfirmationModal from '../../components/Layout/DeleteConfirmationModal';
import SuccessModal from '../../components/Layout/SuccessModal';

/**
 * AdminCategoryManagement Component
 * Renders the administrative dashboard for viewing, creating, updating, 
 * and deleting product categories. 
 */
function AdminCategoryManagement() {
    /**
     * Component state definitions for managing local data, 
     * loading statuses, form validation, and modal visibility.
     */
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({ id: null, name: '', slug: '', productCount: 0 });
    const [isEditing, setIsEditing] = useState(false);

    const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: '' });
    const [successModal, setSuccessModal] = useState({ show: false, message: '' });

    /**
     * Asynchronous function to fetch existing categories from the backend.
     * Uses memoized callback to prevent unnecessary re-renders in hooks.
     */
    const fetchCategories = useCallback(async () => {
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
    }, []); 

    /**
     * Initial side effect hook to load category data on mount.
     */
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]); 
    
    /**
     * Handles form submission for both creation and updates.
     * Selects specific API service based on toggle 'isEditing'.
     */
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

    /**
     * Captures category metadata to open the confirmation delete modal.
     */
    const handleDeleteClick = (category) => {
        setDeleteModal({
            show: true,
            id: category.id,
            name: category.name
        });
    };

    /**
     * Executes physical deletion of the category via the API 
     * and performs optimistic UI updates on success.
     */
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

    /**
     * Closes current modal windows without taking data action.
     */
    const cancelDelete = () => {
        setDeleteModal({ show: false, id: null, name: '' });
    };

    const closeSuccessModal = () => {
        setSuccessModal({ show: false, message: '' });
    };

    /**
     * Populates the local form state with category data for editing.
     */
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
            
            {/* Modal Components for workflow confirmation and success notification */}
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

            {/* Panel section for Category CRUD Form */}
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
            
            {/* Panel section for displaying current listings */}
            <section className="admin-card category-list-panel">
                <h3>Existing Categories ({categories.length})</h3>
                
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