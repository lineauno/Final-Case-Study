<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage; 
use App\Models\Wishlist; 

class WishlistController extends Controller
{
    /**
     * Retrieves the authenticated user's complete wishlist.
     * Eager loads associated product details, normalizes product image URLs 
     * based on their storage location, and appends a boolean 'is_wished' 
     * flag for front-end consistency.
     */
    public function index()
    {
        $wishlistItems = Auth::user()->wishlist()->with('product')->get();
        
        $products = $wishlistItems->pluck('product');

        $products->transform(function ($product) {
            if ($product && $product->image_url) {
                if (str_starts_with($product->image_url, 'http') || str_starts_with($product->image_url, '/assets')) {
                    // Path is already a web link or asset reference
                } else {
                    $product->image_url = Storage::url($product->image_url);
                }
            }
            $product->is_wished = true; 
            return $product;
        });

        return response()->json($products);
    }

    /**
     * Adds a specific product to the authenticated user's wishlist.
     * Ensures that duplicate entries are prevented using a unique composite 
     * check and returns a 201 status for new creations or a 200 status 
     * if the item was already present.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $wishlistItem = Wishlist::firstOrCreate(
            ['user_id' => Auth::id(), 'product_id' => $request->product_id]
        );

        if ($wishlistItem->wasRecentlyCreated) {
            return response()->json(['message' => 'Added to wishlist'], 201);
        }
        return response()->json(['message' => 'Already in wishlist'], 200); 
    }

    /**
     * Removes a product from the user's wishlist.
     * Searches for the record using the authenticated user's ID and the provided 
     * product ID. Returns a 204 No Content status on successful deletion 
     * or a 404 status if the record does not exist.
     */
    public function destroy($productId)
    {
        $deleted = Wishlist::where('user_id', Auth::id())
                           ->where('product_id', $productId)
                           ->delete();

        if ($deleted) {
            return response()->noContent();
        }
        return response()->json(['message' => 'Not found'], 404);
    }
}