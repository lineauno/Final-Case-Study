Try AI directly in your favorite apps … Use Gemini to generate drafts and refine content, plus get Gemini Pro with access to Google's next-gen AI for ₱1,100 ₱0 for 1 month
<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class InventoryController extends Controller
{
    public function updateStock(Request $request, Product $product): JsonResponse
    {
        $request->validate([
            'stock' => 'required|integer|min:0',
        ]);

        $product->update(['stock' => $request->stock]);
        return response()->json(['message' => 'Stock updated successfully', 'product' => $product]);
    }

    public function updatePrice(Request $request, Product $product): JsonResponse
    {
        $request->validate([
            'price' => 'required|numeric|min:0',
        ]);

        $product->update(['price' => $request->price]);
        return response()->json(['message' => 'Price updated successfully', 'product' => $product]);
    }

    public function getStockLevels(Request $request): JsonResponse
    {
        $lowStockThreshold = $request->get('low_stock', 10);
        $products = Product::where('stock', '<=', $lowStockThreshold)->get();
        return response()->json(['low_stock_products' => $products]);
    }

    public function monitorInventory(): JsonResponse
    {
        $products = Product::select('id', 'name', 'stock', 'price')->get();
        return response()->json($products);
    }
}