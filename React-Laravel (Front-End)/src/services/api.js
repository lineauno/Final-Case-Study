const LARAVEL_HOST = 'http://localhost:8082'; 
const API_URL = `${LARAVEL_HOST}/api`;

const getToken = () => localStorage.getItem('user_token');

const request = async (endpoint, method = 'GET', data = null) => {
    const url = `${API_URL}${endpoint}`;
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
        headers: isFormData ? headers : headers, 
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
    login: (credentials) => request('/login', 'POST', credentials),
    register: (data) => request('/register', 'POST', data),
    logout: () => request('/logout', 'POST'),
    fetchUser: () => request('/user'),

    getProducts: () => request('/products'), 
    getProductById: (id) => request(`/products/${id}`),

    searchProducts: (query) => {
        const endpoint = query ? `/products?search=${encodeURIComponent(query)}` : '/products';
        return request(endpoint);
    },

    getCart: () => request('/cart'),
    addToCart: (productId, quantity) => request('/cart', 'POST', { product_id: productId, quantity }),
    updateCartItem: (cartItemId, quantity) => request(`/cart/items/${cartItemId}`, 'PUT', { quantity }),
    removeFromCart: (cartItemId) => request(`/cart/items/${cartItemId}`, 'DELETE'),
    
    checkout: (data) => request('/checkout', 'POST', data), 
    getOrders: () => request('/orders'),
    updateProfile: (data) => request('/profile', 'PUT', data),

    getWishlist: () => request('/user/wishlist'),
    addToWishlist: (productId) => request('/user/wishlist', 'POST', { product_id: productId }),
    removeFromWishlist: (productId) => request(`/user/wishlist/${productId}`, 'DELETE'),

    getAdminMetrics: () => request('/admin/metrics'), 
    getRecentActivity: () => request('/admin/activity'),
    getAdminProducts: () => request('/admin/products'),
    getAdminProduct: (id) => request(`/admin/products/${id}`),
    getDashboardData: () => request('/admin/dashboard-data'),
    
    createProduct: (data) => request('/admin/products', 'POST', data), 
    updateProduct: (id, data) => request(`/admin/products/${id}`, 'POST', data), // Using POST + _method=PUT
    deleteProduct: (id) => request(`/admin/products/${id}`, 'DELETE'),
    
    getCategories: () => request('/admin/categories'), 
    getAdminCategories: () => request('/admin/categories'),
    createCategory: (data) => request('/admin/categories', 'POST', data),
    updateCategory: (id, data) => request(`/admin/categories/${id}`, 'PUT', data),
    deleteCategory: (id) => request(`/admin/categories/${id}`, 'DELETE'),
};

export const { 
    getAdminMetrics, 
    getRecentActivity, 
    getAdminProducts, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getDashboardData,
    logout
} = api;

export default api;