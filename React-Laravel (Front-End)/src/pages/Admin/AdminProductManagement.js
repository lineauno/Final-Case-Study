import React, { useState, useEffect } from "react";
import { getAdminProducts, createProduct, updateProduct, deleteProduct, getCategories } from '../../services/api'; 
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import DeleteConfirmationModal from '../../components/Layout/DeleteConfirmationModal';
import SuccessModal from '../../components/Layout/SuccessModal';

const BACKEND_BASE_URL = 'http://localhost:8082'; 

export default function AdminProductManagement() {
    
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [form, setForm] = useState({
        id: null, name: "", price: "", description: "",
        category_name: "", stock: "",       
    });

    // 💡 IMAGE STATE: Two states to handle both methods
    const [imageFile, setImageFile] = useState(null);       // For File Uploads
    const [imageUrlInput, setImageUrlInput] = useState(""); // For Pasted Links
    
    const [isEditing, setIsEditing] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: '' });
    const [successModal, setSuccessModal] = useState({ show: false, message: '' });

    // --- API Read Functions ---
    const fetchCategories = async () => {
        try {
            const responseData = await getCategories(); 
            setCategories(responseData.categories || responseData || []); 
        } catch (err) {
            console.error("Category API Error:", err);
        }
    };

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const responseData = await getAdminProducts();
            const safeProducts = (responseData.products || []).map(p => ({
                ...p,
                category_name: p.category_name || '', 
                stock: p.stock !== undefined ? p.stock : 0,
            }));
            setProducts(safeProducts); 
            setError(null);
        } catch (err) {
            console.error("Products API Error:", err); 
            setError("Failed to load products from API.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories(); 
    }, []);

    // --- Form Handlers ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // 💡 HANDLE FILE SELECTION (Clears URL input)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImageUrlInput(""); // Clear URL if file picked
        }
    };

    // 💡 HANDLE URL TYPING (Clears File input)
    const handleUrlChange = (e) => {
        const url = e.target.value;
        setImageUrlInput(url);
        if (url) {
            setImageFile(null); // Clear file state
            // Visually clear the file input
            const fileInput = document.getElementById('productFileInput');
            if(fileInput) fileInput.value = "";
        }
    };

    const handleAddOrUpdate = async (e) => {
        e.preventDefault();
        
        // 💡 VALIDATION: Check if we have EITHER a file OR a URL OR an existing image (edit mode)
        const hasImage = imageFile || imageUrlInput || (isEditing && form.image_url);

        if (!form.name || !form.price || !form.category_name || !form.stock) {
             alert("Please fill in all required text fields.");
             return;
        }

        if (!hasImage && !isEditing) {
             alert("Please select an image file or paste an image URL.");
             return;
        }
        
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('price', parseFloat(form.price));
            formData.append('description', form.description);
            formData.append('stock', parseInt(form.stock, 10));
            formData.append('category_name', form.category_name); 

            // 💡 HYBRID LOGIC: Send the correct field to Laravel
            if (imageFile) {
                formData.append('image_file', imageFile); 
            } else if (imageUrlInput) {
                formData.append('image_url_input', imageUrlInput); 
            }

            if (isEditing) {
                formData.append('_method', 'PUT'); 
                await updateProduct(form.id, formData); 
                setSuccessModal({ show: true, message: "Product updated successfully!" });
            } else {
                await createProduct(formData); 
                setSuccessModal({ show: true, message: "Product added successfully!" });
            }
            
            fetchProducts(); 
        } catch (err) {
            console.error("CRUD Error:", err);
            // Try to show the specific message from the server if available
            const msg = err.message || "Failed to save product.";
            setError(msg);
        } finally {
            resetForm();
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setForm({ id: null, name: "", price: "", description: "", category_name: "", stock: "" });
        setImageFile(null);
        setImageUrlInput("");
        setIsEditing(false);
        // Clear file input visually
        const fileInput = document.getElementById('productFileInput');
        if(fileInput) fileInput.value = "";
    };

    const handleEdit = (product) => {
        setForm({ 
            id: product.id, 
            name: product.name, 
            price: String(product.price), 
            description: product.description,
            category_name: product.category_name || "", 
            stock: String(product.stock || 0),
            image_url: product.image_url // Track existing image
        });

        // If it's a URL link, fill the text box. If it's a file path, leave blank.
        if (product.image_url && product.image_url.startsWith('http')) {
            setImageUrlInput(product.image_url);
        } else {
            setImageUrlInput("");
        }
        
        setImageFile(null); 
        setIsEditing(true);
    };

    // --- DELETE ---
    const handleDeleteClick = (product) => {
        setDeleteModal({ show: true, id: product.id, name: product.name });
    };

    const confirmDelete = async () => {
        setDeleteModal({ show: false, id: null, name: '' });
        setIsLoading(true);
        try {
            await deleteProduct(deleteModal.id);
            setSuccessModal({ show: true, message: "Product deleted successfully!" });
            setProducts(prev => prev.filter(p => p.id !== deleteModal.id));
        } catch (error) {
            console.error("Deletion failed:", error);
            setError("Failed to delete product on the server.");
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
            
            {/* Left - Add/Edit Form */}
            <section className="admin-card form-card">
                <h2>{isEditing ? "Edit Product" : "Add Product"}</h2>
                <form onSubmit={handleAddOrUpdate}> 
                    <label>Product Name</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} required disabled={isLoading} />
                    <p></p>
                    
                    <label>Category</label>
                    <select 
                        name="category_name" 
                        value={form.category_name} 
                        onChange={handleChange} 
                        required 
                        className="product-category-select" 
                        disabled={isLoading}
                    >
                        <option value=""></option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                    <p></p>
                    
                    <label>Price (₱)</label>
                    <input type="number" name="price" value={form.price} onChange={handleChange} required step="0.01" min="0" disabled={isLoading} />
                    <p></p>
                    
                    <label>Stock Quantity</label>
                    <input type="number" name="stock" value={form.stock} onChange={handleChange} required min="0" disabled={isLoading} />
                    <p></p>
                    
                    {/* 💡 HYBRID IMAGE INPUT */}
                    <label>Product Image</label>
                    <div className="image-input-group" style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                        <input 
                            id="productFileInput"
                            type="file" 
                            name="image_file" 
                            onChange={handleFileChange} 
                            disabled={isLoading || imageUrlInput.length > 0} 
                        />
                        <span style={{textAlign:'center', fontSize:'0.8rem', color:'#888'}}>- OR -</span>
                        <input 
                            type="url" 
                            placeholder="Paste image URL (https://...)" 
                            value={imageUrlInput} 
                            onChange={handleUrlChange} 
                            disabled={isLoading || imageFile} 
                        />
                    </div>
                    
                    {/* Previews */}
                    {(isEditing && !imageFile && !imageUrlInput && form.image_url) && (
                        <p className="current-image-note">Current Image: Saved</p>
                    )}
                    {imageFile && (
                        <p className="file-preview-note">Selected File: {imageFile.name}</p>
                    )}
                    
                    <p></p>
                    <label>Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} disabled={isLoading} />

                    <div className="form-btns">
                        <button type="submit" className={isEditing ? "update-btn" : "add-btn"} disabled={isLoading}>
                            {isLoading ? "Saving..." : (isEditing ? "Update Product" : "Add Product")}
                        </button>
                        {isEditing && (
                            <button type="button" className="cancel-btn" onClick={resetForm}>Cancel</button>
                        )}
                    </div>
                </form>
            </section>

            {/* Right - Product Grid */}
            <section className="admin-card product-grid-section">
                <h2>Existing Products</h2>
                
                {isLoading && !deleteModal.show && !successModal.show && <p>Loading...</p>}
                {error && <p className="admin-error-message">{error}</p>}

                {products.length === 0 && !isLoading ? (
                    <p className="no-products">No products available.</p>
                ) : (
                    <div className="admin-product-row"> 
                        {products.map((p) => {
                            // Smart Image Display
                            const absoluteImageUrl = p.image_url && p.image_url.startsWith('http')
                                ? p.image_url 
                                : p.image_url 
                                    ? `${BACKEND_BASE_URL}${p.image_url}` 
                                    : `${BACKEND_BASE_URL}/assets/images/default.png`; 
                            
                            return (
                                <div key={p.id} className="existing-products-card">
                                    <div
                                        className="product-card-img"
                                        style={{ backgroundImage: `url('${absoluteImageUrl}')` }}
                                    ></div>
                                    
                                    <div className="product-card-info">
                                        <h4>{p.name}</h4>
                                        <p className="product-category">Category: {p.category_name}</p>
                                        <p className="product-quantity">Stock: {p.stock}</p>
                                        <p className="product-price">₱{Number(p.price).toFixed(2)}</p>
                                        
                                        <div className="category-actions">
                                            <button className="edit-btn" onClick={() => handleEdit(p)}>
                                                <FaEdit /> Edit
                                            </button>
                                            <button className="delete-btn" onClick={() => handleDeleteClick(p)}>
                                                <FaTrashAlt /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </main>
    );
}