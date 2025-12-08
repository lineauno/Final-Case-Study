const LARAVEL_HOST = 'http://localhost:8082'; 
const API_URL = `${LARAVEL_HOST}/api`;

/**
 * Helper to retrieve the Bearer token from browser localStorage.
 */
const getToken = () => localStorage.getItem('user_token');

/**
 * Core request handler.
 * * Orchestrates all outgoing fetch calls. 
 * Standardizes headers (JSON vs FormData), injects authentication tokens, 
 * processes query parameters, and handles global status errors (204, 422, etc.).
 */
const request = async (endpoint, method = 'GET', data = null, params = null) => {
    let url = `${API_URL}${endpoint}`;
    if (params) {
        url += '?' + new URLSearchParams(params).toString();
    }
    
    const token = getToken();

    let finalBody = null;
    let headers = {
        'Accept': 'application/json',
    };
    
    const isFormData = data instanceof FormData; 

    if (data) {
        if (isFormData) {
            finalBody = data;
        } else {
            headers['Content-Type'] = 'application/json';
            finalBody = JSON.stringify(data);
        }
    }
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers: headers, 
        body: finalBody,
    };

    try {
        const response = await fetch(url, config);
        
        if (response.status === 204) return null; 
        
        /**
         * Validation Error Handler (422)
         * Extracts Laravel validation errors and formats the first relevant 
         * message for immediate UI feedback.
         */
        if (!response.ok && response.status === 422) {
            const validationErrors = await response.json();
            const firstError = validationErrors.errors ? validationErrors.errors[Object.keys(validationErrors.errors)[0]][0] : 'Validation failed.';
            throw new Error(`Validation Error: ${firstError}`);
        }
        
        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || `API error occurred with status ${response.status}.`);
        }

        return responseData;

    } catch (error) {
        console.error('API Request Failed:', error.message);
        throw error;
    }
};

/**
 * Service Object Definition
 * * Groups individual API endpoints by logical module: 
 * Auth, Products, Orders, Wishlist, and Admin oversight.
 */
const api = {
    // --- AUTH & USER ---
    login: (credentials) => request('/login', 'POST', credentials),
    register: (data) => request('/register', 'POST', data),
    logout: () => request('/logout', 'POST'),
    fetchUser: () => request('/user'),
    updateProfile: (data) => request('/profile', 'PUT', data),

    // --- PUBLIC PRODUCTS ---
    getProducts: () => request('/products'), 
    getProductById: (id) => request(`/products/${id}`),
    searchProducts: (query) => {
        const endpoint = query ? `/products?search=${encodeURIComponent(query)}` : '/products';
        return request(endpoint);
    },

    // --- CART & ORDERS ---
    getCart: () => request('/cart'),
    addToCart: (productId, quantity) => request('/cart', 'POST', { product_id: productId, quantity }),
    updateCartItem: (cartItemId, quantity) => request(`/cart/items/${cartItemId}`, 'PUT', { quantity }),
    removeFromCart: (cartItemId) => request(`/cart/items/${cartItemId}`, 'DELETE'),
    checkout: (data) => request('/checkout', 'POST', data), 
    getOrders: () => request('/orders'),

    // --- WISHLIST ---
    getWishlist: () => request('/user/wishlist'),
    addToWishlist: (productId) => request('/user/wishlist', 'POST', { product_id: productId }),
    removeFromWishlist: (productId) => request(`/user/wishlist/${productId}`, 'DELETE'),

    // --- ADMIN DASHBOARD & PRODUCTS ---
    getDashboardData: () => request('/admin/dashboard-data'),
    getAdminMetrics: () => request('/admin/metrics'), 
    getRecentActivity: () => request('/admin/activity'),
    
    getAdminProducts: (params) => request('/admin/products', 'GET', null, params), 
    getAdminProduct: (id) => request(`/admin/products/${id}`),
    createProduct: (data) => request('/admin/products', 'POST', data), 
    updateProduct: (id, data) => request(`/admin/products/${id}`, 'POST', data),
    deleteProduct: (id) => request(`/admin/products/${id}`, 'DELETE'),
    
    // --- ADMIN CATEGORIES ---
    getCategories: () => request('/admin/categories'), 
    getAdminCategories: () => request('/admin/categories'),
    createCategory: (data) => request('/admin/categories', 'POST', data),
    updateCategory: (id, data) => request(`/admin/categories/${id}`, 'PUT', data),
    deleteCategory: (id) => request(`/admin/categories/${id}`, 'DELETE'),

    // --- ADMIN USER MANAGEMENT ---
    getAdminUsers: (params) => request('/admin/users', 'GET', null, params), 
    getAdminUser: (id) => request(`/admin/users/${id}`),
    updateAdminUser: (id, data) => request(`/admin/users/${id}`, 'PUT', data), 
    deleteAdminUser: (id) => request(`/admin/users/${id}`, 'DELETE'),
    toggleBan: (id) => request(`/admin/users/${id}/ban`, 'POST'),

    // --- ADMIN INVENTORY ---
    getInventoryPaginatedProducts: (params) => request('/admin/inventory/products-paginated', 'GET', null, params),
    
    getLowStockProducts: (threshold = 10) => {
        return request(`/admin/inventory/low-stock?low_stock=${threshold}`);
    },
    updateProductStock: (id, data) => request(`/admin/inventory/${id}/stock`, 'PUT', data),
};

/**
 * Named Exports
 * Destructures the api object for cleaner imports within components.
 */
export const { 
    login,
    register,
    logout,
    fetchUser,
    updateProfile,
    getProducts,
    getProductById,
    searchProducts,
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    checkout,
    getOrders,
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    getDashboardData,
    getAdminMetrics, 
    getRecentActivity, 
    getAdminProducts, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    getCategories,
    getAdminCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getAdminUsers,
    getAdminUser,
    updateAdminUser,
    deleteAdminUser,
    toggleBan,
    getInventoryPaginatedProducts, 
    getLowStockProducts,
    updateProductStock
} = api;

export default api;