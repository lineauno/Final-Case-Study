<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Order; 
use App\Models\Cart; 
use Illuminate\Support\Facades\DB; 
use Illuminate\Database\Eloquent\ModelNotFoundException; 

class OrderController extends Controller
{
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