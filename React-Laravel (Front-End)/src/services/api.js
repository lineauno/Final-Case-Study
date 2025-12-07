const LARAVEL_HOST = 'http://localhost:8082'; 
const API_URL = `${LARAVEL_HOST}/api`;

const getToken = () => localStorage.getItem('user_token');

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
    updateProduct: (id, data) => request(`/admin/products/${id}`, 'POST', data), // Using POST + _method=PUT
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

export const { 
    // Auth and User
    login,
    register,
    logout,
    fetchUser,
    updateProfile,

    // Public Products
    getProducts,
    getProductById,
    searchProducts,

    // Cart & Orders
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    checkout,
    getOrders,

    // Wishlist
    getWishlist,
    addToWishlist,
    removeFromWishlist,

    // Admin Dashboard & Products
    getDashboardData,
    getAdminMetrics, 
    getRecentActivity, 
    getAdminProducts, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    
    // Admin Categories
    getCategories,
    getAdminCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    
    // Admin User Management
    getAdminUsers,
    getAdminUser,
    updateAdminUser,
    deleteAdminUser,
    toggleBan,

    // Admin Inventory
    getInventoryPaginatedProducts, 
    getLowStockProducts,
    updateProductStock
} = api;

export default api;