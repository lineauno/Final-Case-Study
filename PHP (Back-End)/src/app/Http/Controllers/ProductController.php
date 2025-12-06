<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage; 

class ProductController extends Controller
{
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