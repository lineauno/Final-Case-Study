<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage; 

class InventoryController extends Controller
{
    /**
     * Retrieves paginated products filtered by an optional search query.
     * Maps the collection to resolve local image storage URLs, sanitizes 
     * null stock levels, and appends the category name for front-end display.
     */
    public function getPaginatedProducts(Request $request): JsonResponse
    {
        try {
            $perPage = $request->get('per_page', 10);
            $searchQuery = $request->get('search');

            $query = Product::with('category');

            if ($searchQuery) {
                $query->where('name', 'LIKE', "%{$searchQuery}%");
            }
            
            $productsPaginator = $query->paginate($perPage);

            $productsPaginator->getCollection()->map(function ($product) {
                if ($product->image_url) {
                    if (!(str_starts_with($product->image_url, 'http') || str_starts_with($product->image_url, '/assets'))) {
                        $product->image_url = Storage::url($product->image_url);
                    }
                }
                
                $product->stock = $product->stock ?? 0;
                $product->category_name = $product->category->name ?? 'Uncategorized';
                return $product;
            });
            
            return response()->json($productsPaginator, 200); 

        } catch (\Exception $e) {
            Log::error('InventoryController getPaginatedProducts error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to fetch paginated products.', 'error' => $e->getMessage()], 500);
        }
    }
    
    /**
     * Updates the current stock count for a specific product record.
     * Validates that the stock input is a non-negative integer before persisting.
     */
    public function updateStock(Request $request, Product $product): JsonResponse
    {
        try {
            $validated = $request->validate([
                'stock' => 'required|integer|min:0',
            ]);

            $product->update(['stock' => $validated['stock']]);
            
            return response()->json([
                'message' => 'Stock updated successfully', 
                'product' => $product->refresh() 
            ], 200);

        } catch (\Exception $e) {
            Log::error('Inventory Stock Update Error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to update stock due to a server error.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Updates the retail price of a specific product record.
     * Ensures price values are numeric and at least zero before refreshing the model.
     */
    public function updatePrice(Request $request, Product $product): JsonResponse
    {
        try {
            $validated = $request->validate([
                'price' => 'required|numeric|min:0',
            ]);

            $product->update(['price' => $validated['price']]);
            return response()->json(['message' => 'Price updated successfully', 'product' => $product->refresh() ], 200);
            
        } catch (\Exception $e) {
            Log::error('Inventory Price Update Error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to update price.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Filters and retrieves a list of products falling below the provided threshold.
     * Defaults to a threshold of 10 if the 'low_stock' parameter is not provided.
     */
    public function getStockLevels(Request $request): JsonResponse
    {
        try {
            $lowStockThreshold = $request->get('low_stock', 10); 
            $products = Product::where('stock', '<=', $lowStockThreshold)->get();
            return response()->json(['low_stock_products' => $products], 200);
            
        } catch (\Exception $e) {
            Log::error('Inventory GetStockLevels Error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to retrieve low stock alerts.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Fetches a snapshot of critical inventory fields for all products.
     * Optimized to select only ID, Name, Stock, and Price for lightweight monitoring.
     */
    public function monitorInventory(): JsonResponse
    {
        try {
            $products = Product::select('id', 'name', 'stock', 'price')->get();
            return response()->json($products, 200);
            
        } catch (\Exception $e) {
            Log::error('Inventory Monitor Error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to retrieve inventory monitor data.', 'error' => $e->getMessage()], 500);
        }
    }
}