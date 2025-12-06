import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; 
import App from './App'; 
import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import { CartProvider } from './contexts/CartContext'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* BrowserRouter must be top-level for all hooks */}
    <BrowserRouter> 
      {/* AuthProvider wraps all, as cart/products depend on authentication */}
      <AuthProvider> 
        {/* CartProvider wraps all pages that need cart data */}
        <CartProvider> 
            {/* ProductProvider wraps all pages that need product list data */}
            <ProductProvider>
                <App /> 
            </ProductProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);