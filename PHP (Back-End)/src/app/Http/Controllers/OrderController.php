<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Order; 
use App\Models\Cart; 
use App\Models\Product;
use Illuminate\Support\Facades\DB; 
use Illuminate\Database\Eloquent\ModelNotFoundException; 

class OrderController extends Controller
{
    /**
     * Executes the checkout process using a database transaction.
     * Validates stock availability for each item, decrements product inventory,
     * generates an order record with snapshots of product prices, and clears 
     * the user's cart upon success.
     * * @param Request $request Contains shipping_address and total amount.
     * @return \Illuminate\Http\JsonResponse
     */
    public function processCheckout(Request $request)
    {
        $request->validate([
            'shipping_address' => 'required|string|max:255',
            'total' => 'required|numeric|min:0',
        ]);

        $user = Auth::user();
        
        $cart = Cart::where('user_id', $user->id)
                    ->with('items.product')
                    ->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'Your cart is empty.'], 400);
        }

        try {
            DB::beginTransaction();
            
            foreach ($cart->items as $item) {
                $product = $item->product;
                $quantity = $item->quantity;

                if ($product->stock < $quantity) {
                    DB::rollback();
                    return response()->json(['message' => "Insufficient stock for product: {$product->name}. Only {$product->stock} remaining."], 409);
                }

                $product->stock -= $quantity;
                $product->save();
            }

            $order = Order::create([
                'user_id' => $user->id,
                'shipping_address' => $request->shipping_address,
                'order_total' => $request->total,
                'status' => 'Pending',
            ]);

            $orderItemsData = $cart->items->map(function ($item) use ($order) {
                return [
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price_at_purchase' => $item->product->price, 
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            })->toArray();
            
            DB::table('order_items')->insert($orderItemsData);

            $cart->items()->delete();
            $cart->delete();
            
            DB::commit(); 

            return response()->json([
                'message' => 'Order placed successfully!',
                'order_id' => $order->id
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            \Log::error("Order processing failed for user {$user->id}: " . $e->getMessage()); 

            return response()->json(['message' => 'Failed to place order due to a server error.'], 500);
        }
    }
    
    /**
     * Retrieves the order history for the currently authenticated user.
     * Eager loads order items and product details, returning results sorted
     * by the most recent creation date.
     */
    public function index()
    {
        $user = Auth::user();

        $orders = Order::where('user_id', $user->id)
                       ->with(['items.product']) 
                       ->latest()
                       ->get();

        return response()->json($orders, 200); 
    }
}