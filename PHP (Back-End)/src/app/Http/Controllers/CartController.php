<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage; 

class CartController extends Controller
{
    protected function fetchFormattedCart()
    {
        $cart = Auth::user()->cart()->with('items.product')->firstOrCreate(['user_id' => Auth::id()]);
        
        $cartTotal = 0.00;
        
        $filteredItems = $cart->items->filter(fn($item) => $item->product !== null)->values();
        
        $filteredItems->transform(function ($item) {
            $product = $item->product;
            if ($product->image_url) {
                if (str_starts_with($product->image_url, 'http') || str_starts_with($product->image_url, '/assets')) {
                    $product->image_url = $product->image_url;
                } else {
                    $product->image_url = Storage::url($product->image_url);
                }
            } else {
                $product->image_url = null;
            }
            return $item;
        });

        foreach ($filteredItems as $item) {
            $price = (float) $item->product->price; 
            $cartTotal += ($price * $item->quantity); 
        }

        $cartCount = $filteredItems->sum('quantity');
        
        return response()->json([
            'cart'      => [
                'id'    => $cart->id,
                'items' => $filteredItems, 
                'total' => number_format($cartTotal, 2, '.', ''), 
            ],
            'cartCount' => $cartCount,
            'message'   => 'Cart fetched successfully',
        ]);
    }

    public function getCart()
    {
        return $this->fetchFormattedCart();
    }

    public function addToCart(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'required|integer|min:1', 
        ]);

        $cart = Auth::user()->cart()->firstOrCreate(['user_id' => Auth::id()]);

        $cartItem = CartItem::where('cart_id', $cart->id)
                            ->where('product_id', $request->product_id)
                            ->first();

        if ($cartItem) {
            $cartItem->quantity += $request->quantity;
            $cartItem->save();
        } else {
            $cartItem = CartItem::create([
                'cart_id'    => $cart->id,
                'product_id' => $request->product_id,
                'quantity'   => $request->quantity,
            ]);
        }
        
        return $this->fetchFormattedCart();
    }

    public function updateQuantity(Request $request, $itemId)
    {
        $request->validate(['quantity' => 'required|integer|min:0']);

        $cart = Auth::user()->cart()->first();
        if (!$cart) {
            return response()->json(['message' => 'Cart not found'], 404);
        }

        $cartItem = $cart->items()->find($itemId);

        if (!$cartItem) {
            return response()->json(['message' => 'Item not found in cart'], 404);
        }

        if ($request->quantity > 0) {
            $cartItem->quantity = $request->quantity;
            $cartItem->save();
        } else {
            $cartItem->delete(); 
        }

        return $this->fetchFormattedCart();
    }

    public function removeItem($id)
    {
        $cart = Auth::user()->cart()->first();
        if (!$cart) {
            return response()->json(['message' => 'Cart not found'], 404);
        }

        $deleted = $cart->items()->where('product_id', $id)->delete();
        
        if ($deleted === 0) { 
            $deleted = $cart->items()->where('id', $id)->delete();
        }
        
        if ($deleted === 0) { 
            return response()->json(['message' => 'Item not found in cart'], 404);
        }

        return $this->fetchFormattedCart();
    }
}