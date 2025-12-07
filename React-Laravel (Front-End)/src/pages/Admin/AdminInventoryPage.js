import React, { useState, useEffect, useCallback } from 'react';
import { getInventoryPaginatedProducts, updateProductStock } from '../../services/api';
import SuccessModal from '../../components/Layout/SuccessModal';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa'; 
import '../../pagesstyles/AdminInventoryPage.css'; 

const ITEMS_PER_PAGE = 10; 

function AdminInventoryPage() {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const [successModal, setSuccessModal] = useState({ show: false, message: '' }); 

    const [editingId, setEditingId] = useState(null);
    const [newStock, setNewStock] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    
    const isOutOfStock = (stock) => stock <= 0;
    const getStockStatusClass = (stock) => {
        if (stock <= 0) return 'stock-out';
        if (stock <= 10) return 'stock-low';
        return 'stock-sufficient';
    };

    const fetchInventory = useCallback(async (page = 1) => {
        setIsLoading(true);
        setError(null);
        try {
            const paginator = await getInventoryPaginatedProducts({ page: page, per_page: ITEMS_PER_PAGE }); 
            
            setProducts(paginator.data || []); 
            setTotalPages(paginator.last_page || 1); 
            setCurrentPage(paginator.current_page || 1);

        } catch (err) {
            console.error("Inventory Fetch Error:", err);
            setError(err.message || "Failed to load inventory data.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInventory(currentPage);
    }, [currentPage, fetchInventory]);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    
    const handleEditClick = (product) => {
        setEditingId(product.id);
        setNewStock(String(product.stock));
    };

    const handleCancelStock = () => {
        setEditingId(null);
        setNewStock('');
    };

    const handleSaveStock = async (productId) => {
        const stockValue = parseInt(newStock);

        if (isNaN(stockValue) || stockValue < 0) {
            setError("Stock value must be a non-negative number.");
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            await updateProductStock(productId, { stock: stockValue });
            
            setSuccessModal({ show: true, message: `Product ID ${productId} stock updated successfully.` });
            
            fetchInventory(currentPage);
            
            handleCancelStock();

        } catch (err) {
            console.error("Update Error:", err);
            setError(err.message || `Failed to update product ID ${productId}.`);
        } finally {
            setIsSaving(false);
        }
    };
    
    return (
        <div className="admin-page-container">
            <SuccessModal 
                show={successModal.show} 
                message={successModal.message} 
                onClose={() => setSuccessModal({ show: false, message: '' })}
            />

            <h2 className="page-header">📦 Inventory Quick Management</h2>
            <p className="page-subtext">Quickly manage current stock levels across the entire product catalog.</p>
            {error && <p className="error-message">{error}</p>}


            <div className="admin-card inventory-table-card">
                {isLoading && products.length === 0 ? (
                    <div className="admin-loading">Loading Inventory...</div>
                ) : (
                    <>
                        {products.length > 0 ? (
                            <table className="inventory-table">
                                <thead>
                                    <tr>
                                        {/* Adjusted headers to align with rendering logic */}
                                        <th>Product</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th className="text-center">Stock Level</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr 
                                            key={product.id} 
                                            className={`inventory-row ${isOutOfStock(product.stock) ? 'out-of-stock-row' : ''}`}
                                        >
                                            {}
                                            <td className="text-bold">{product.name}</td>
                                            
                                            <td>{product.category_name || 'N/A'}</td> 
                                            <td>₱{product.price}</td>
                                            
                                            {/* STOCK EDITING CELL */}
                                            <td className="text-center">
                                                {editingId === product.id ? (
                                                    <input
                                                        type="number"
                                                        value={newStock}
                                                        onChange={(e) => setNewStock(e.target.value)}
                                                        min="0"
                                                        className="stock-input"
                                                    />
                                                ) : (
                                                    <span className={`stock-level-display ${getStockStatusClass(product.stock)}`}>
                                                        {product.stock}
                                                    </span>
                                                )}
                                            </td>
                                            
                                            {/* ACTION BUTTONS */}
                                            <td className="action-button-group">
                                                {editingId === product.id ? (
                                                    <>
                                                        <button 
                                                            onClick={() => handleSaveStock(product.id)} 
                                                            disabled={isSaving || newStock === String(product.stock) || parseInt(newStock) < 0 || newStock === ''}
                                                            className="btn-save-stock"
                                                        >
                                                            {isSaving ? <FaSave style={{ verticalAlign: 'middle' }} /> : 'Save'}
                                                        </button>
                                                        <button 
                                                            onClick={handleCancelStock}
                                                            disabled={isSaving}
                                                            className="btn-cancel-stock"
                                                        >
                                                            <FaTimes />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button 
                                                        onClick={() => handleEditClick(product)}
                                                        disabled={isSaving || isLoading}
                                                        className="btn-edit-stock"
                                                    >
                                                        <FaEdit style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Edit Stock
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            !isLoading && <p className="no-inventory-message">No inventory items found.</p>
                        )}

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="pagination-controls">
                                <button 
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1 || isLoading}
                                >
                                    Previous
                                </button>
                                <span style={{ fontWeight: 'bold' }}>
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button 
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages || isLoading}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default AdminInventoryPage;