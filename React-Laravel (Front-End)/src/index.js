import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; 
import App from './App'; 
import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import { CartProvider } from './contexts/CartContext'; 

/**
 * Root Entry Point
 * * Initializes the React application by mounting it to the DOM.
 * * Orchestrates the Provider pattern hierarchy to ensure state dependency requirements:
 * 1. BrowserRouter: Enables navigation hooks within the Providers.
 * 2. AuthProvider: Core identity layer used by Cart and UI guards.
 * 3. CartProvider: Authenticated shopping state.
 * 4. ProductProvider: Catalog state for shop browsing.
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> 
      <AuthProvider> 
        <CartProvider> 
            <ProductProvider>
                <App /> 
            </ProductProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);