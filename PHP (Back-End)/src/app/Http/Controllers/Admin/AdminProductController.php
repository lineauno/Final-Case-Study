<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class AdminProductController extends Controller
{
    public function index()
    {
        try {
            $products = Product::with('category')->get();
            
            $products->map(function ($product) {
                if ($product->image_url) {
                    if (str_starts_with($product->image_url, 'http') || str_starts_with($product->image_url, '/assets')) {
                        $product->image_url = $product->image_url;
                    } else {
                        $product->image_url = Storage::url($product->image_url);
                    }
                } else {
                    $product->image_url = null;
                }
                
                $product->category_name = $product->category->name ?? 'Uncategorized';
                return $product;
            });
            
            return response()->json(['products' => $products], 200);

        } catch (\Exception $e) {
            Log::error('AdminProductController index error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to fetch products.', 'error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:products,name',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'category_name' => 'required|string', 
            'stock' => 'required|integer|min:0',
            'image_file' => 'nullable|image|max:5120',
            'image_url_input' => 'nullable|url', 
        ]);

        try {
            $dataToStore = $validatedData;
            
            $categoryName = $dataToStore['category_name'];
            $category = Category::whereRaw('LOWER(name) = ?', [strtolower($categoryName)])->first();

            if (!$category) {
                return response()->json(['message' => "Invalid category: '{$categoryName}'."], 400);
            }
            $dataToStore['category_id'] = $category->id; 
            unset($dataToStore['category_name']); 

            $dataToStore['image_url'] = null;

            if ($request->hasFile('image_file')) {
                $path = $request->file('image_file')->store('products', 'public');
                $dataToStore['image_url'] = $path;
            } elseif ($request->filled('image_url_input')) {
                $dataToStore['image_url'] = $request->image_url_input;
            }

            unset($dataToStore['image_file']);
            unset($dataToStore['image_url_input']);

            $newProduct = Product::create($dataToStore);
            
            return response()->json(['message' => 'Product created successfully.', 'product' => $newProduct], 201);

        } catch (\Exception $e) {
            Log::error('Product Create Error: ' . $e->getMessage());
            return response()->json(['message' => 'Server Error: ' . $e->getMessage()], 500);
        }
    }

    public function update(Request $request, Product $product)
    {
        $validatedData = $request->validate([
            'name' => 'nullable|string|max:255|unique:products,name,' . $product->id, 
            'price' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'category_name' => 'nullable|string', 
            'stock' => 'nullable|integer|min:0',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', 
            'image_url_input' => 'nullable|url',
        ]);
        
        try {
            $dataToUpdate = $validatedData;

            if (isset($dataToUpdate['category_name']) && $dataToUpdate['category_name'] !== null) {
                $categoryName = $dataToUpdate['category_name'];
                $category = Category::whereRaw('LOWER(name) = ?', [strtolower($categoryName)])->first();

                if (!$category) {
                    return response()->json(['message' => "Invalid category: '{$categoryName}'."], 400);
                }
                $dataToUpdate['category_id'] = $category->id; 
                unset($dataToUpdate['category_name']); 
            }

            if ($request->hasFile('image_file')) {
                if ($product->image_url && !str_starts_with($product->image_url, 'http')) {
                    Storage::disk('public')->delete($product->image_url);
                }
                $path = $request->file('image_file')->store('products', 'public');
                $dataToUpdate['image_url'] = $path;

            } elseif ($request->filled('image_url_input')) {
                $dataToUpdate['image_url'] = $request->image_url_input;
            }

            unset($dataToUpdate['image_file']);
            unset($dataToUpdate['image_url_input']);

            $product->update($dataToUpdate);
            
            return response()->json(['message' => 'Product updated successfully.', 'product' => $product->refresh()], 200);

        } catch (\Exception $e) {
            Log::error('AdminProductController update error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to update product.', 'error' => $e->getMessage()], 500);
        }
    }
    
    public function destroy(Product $product)
    {
        try {
            if ($product->image_url && !str_starts_with($product->image_url, 'http')) {
                Storage::disk('public')->delete($product->image_url);
            }
            
            $product->delete();
            return response()->json(null, 204);
            
        } catch (\Exception $e) {
            Log::error('AdminProductController destroy error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to delete product.', 'error' => $e->getMessage()], 500);
        }
    }
}