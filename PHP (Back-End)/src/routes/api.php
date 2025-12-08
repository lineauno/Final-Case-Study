<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\WishlistController; 
use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\InventoryController;
use App\Http\Controllers\Admin\UserController;

use Illuminate\Http\JsonResponse;

/**
 * Public Authentication & Error Routes
 * Defines the entry points for login/registration and the fallback 
 * unauthorized response for unauthenticated API requests.
 */
Route::get('/login', function () {
    return response()->json(['message' => 'Unauthenticated. Please login to access this resource.'], 401);
})->name('login');

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

/**
 * Public Product Catalog Routes
 * Allows any visitor to browse products, view featured collections, 
 * or see specific product details.
 */
Route::get('products', [ProductController::class, 'index']);
Route::get('products/featured', [ProductController::class, 'featured']);
Route::get('products/{id}', [ProductController::class, 'show']);

/**
 * Authenticated User Routes (Sanctum)
 * Protected routes requiring a valid bearer token. Manages the profile, 
 * wishlist, shopping cart, and personal order history.
 */
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::put('/profile', [ProfileController::class, 'updateProfile']);
    Route::post('logout', [AuthController::class, 'logout']);

    Route::get('/user/wishlist', [WishlistController::class, 'index']); 
    Route::post('/user/wishlist', [WishlistController::class, 'store']); 
    Route::delete('/user/wishlist/{productId}', [WishlistController::class, 'destroy']); 
    
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'getCart']);
        Route::post('/', [CartController::class, 'addToCart']);
        Route::put('items/{itemId}', [CartController::class, 'updateQuantity']);
        Route::delete('items/{itemId}', [CartController::class, 'removeItem']);
    });
    
    Route::post('checkout', [OrderController::class, 'processCheckout']);
    Route::get('orders', [OrderController::class, 'index']);
});

/**
 * Administrative Routes Tier
 * Encapsulated within the 'admin' prefix and protected by role-based middleware.
 * Includes dashboard analytics, CRUD operations for categories/products, 
 * user moderation, and inventory oversight.
 */
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('dashboard-data', [DashboardController::class, 'index']);
    
    Route::apiResource('products', AdminProductController::class); 
    Route::apiResource('categories', CategoryController::class);
    
    Route::get('users', [UserController::class, 'index']);
    Route::put('users/{user}', [UserController::class, 'update']); 
    Route::post('users/{user}/ban', [UserController::class, 'toggleBan']);
    Route::delete('users/{user}', [UserController::class, 'destroy']);
    
    Route::put('/profile', [ProfileController::class, 'updateProfile']); 
    Route::get('/profile', [ProfileController::class, 'show']);

    Route::get('inventory/products-paginated', [InventoryController::class, 'getPaginatedProducts']); 
    Route::get('inventory/low-stock', [InventoryController::class, 'getStockLevels']); 
    Route::put('inventory/{product}/stock', [InventoryController::class, 'updateStock']); 
    Route::put('inventory/{product}/price', [InventoryController::class, 'updatePrice']);
    Route::get('inventory/all', [InventoryController::class, 'monitorInventory']);
});