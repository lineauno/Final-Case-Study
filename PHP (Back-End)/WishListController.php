<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage; 
use App\Models\Wishlist; 

class WishlistController extends Controller
{
    public function index()
    {
        $wishlistItems = Auth::user()->wishlist()->with('product')->get();
        
        $products = $wishlistItems->pluck('product');

        $products->transform(function ($product) {
            if ($product && $product->image_url) {
                if (str_starts_with($product->image_url, 'http') || str_starts_with($product->image_url, '/assets')) {
                } else {
                    $product->image_url = Storage::url($product->image_url);
                }
            }
            $product->is_wished = true; 
            return $product;
        });

        return response()->json($products);
    }

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