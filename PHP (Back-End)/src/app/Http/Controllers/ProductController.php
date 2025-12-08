<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage; 

class ProductController extends Controller
{
    /**
     * Normalizes the product image URL for the front-end.
     * Determines if the path is an external link, a static asset, or a 
     * file in local storage requiring a generated public URL.
     */
    private function processProductImage($product)
    {
        if ($product->image_url) {
            if (str_starts_with($product->image_url, 'http') || str_starts_with($product->image_url, '/assets')) {
                return $product;
            }
            
            $product->image_url = Storage::url($product->image_url);
        } else {
            $product->image_url = null;
        }
        return $product;
    }

    /**
     * Retrieves a list of products with optional search filtering.
     * Searches against product names and descriptions. If a user is 
     * authenticated, it checks their wishlist to mark products accordingly.
     */
    public function index(Request $request)
    {
        $query = Product::with('category');

        if ($request->has('search') && $request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'LIKE', '%' . $searchTerm . '%')
                  ->orWhere('description', 'LIKE', '%' . $searchTerm . '%');
            });
        }

        $products = $query->get();

        $products->transform(function ($product) {
            return $this->processProductImage($product);
        });

        if (auth('sanctum')->check()) {
            $user = auth('sanctum')->user();
            if (method_exists($user, 'wishlist')) {
                $wishedProductIds = $user->wishlist()->pluck('product_id')->toArray();
                $products->map(function ($product) use ($wishedProductIds) {
                    $product->is_wished = in_array($product->id, $wishedProductIds);
                    return $product;
                });
            }
        }

        return response()->json($products);
    }
    
    /**
     * Fetches products flagged as 'featured' for display on the landing page.
     * Limits the result set to 6 items and processes images and user 
     * wishlist status similar to the index method.
     */
    public function featured()
    {
        $products = Product::with('category')->where('is_featured', true)->take(6)->get();
        
        $products->transform(function ($product) {
            return $this->processProductImage($product);
        });
        
        if (auth('sanctum')->check()) {
            $user = auth('sanctum')->user();
            if (method_exists($user, 'wishlist')) {
                $wishedProductIds = $user->wishlist()->pluck('product_id')->toArray();
                $products->map(function ($product) use ($wishedProductIds) {
                    $product->is_wished = in_array($product->id, $wishedProductIds);
                    return $product;
                });
            }
        }

        return response()->json($products);
    }

    /**
     * Provides detailed information for a single product record.
     * Returns a 404 response if the ID is invalid. Maps the image URL 
     * and performs a boolean check on the authenticated user's wishlist.
     */
    public function show($id)
    {
        $product = Product::with('category')->find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }
        
        $this->processProductImage($product);
        
        if (auth('sanctum')->check()) {
            $user = auth('sanctum')->user();
            if (method_exists($user, 'wishlist')) {
                $product->is_wished = $user->wishlist()->where('product_id', $product->id)->exists();
            }
        }
        
        return response()->json($product);
    }
}