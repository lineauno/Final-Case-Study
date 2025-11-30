Try AI directly in your favorite apps … Use Gemini to generate drafts and refine content, plus get Gemini Pro with access to Google's next-gen AI for ₱1,100 ₱0 for 1 month
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        try {
            $categories = Category::all();
            return response()->json(['categories' => $categories], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch categories.', 'error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
{
    $validatedData = $request->validate([
        'name' => 'required|string|max:255|unique:categories,name',
        'slug' => 'nullable|string|max:255|unique:categories,slug', 
        'description' => 'nullable|string',
    ]);

    try {
        $newCategory = Category::create($validatedData);
        return response()->json(['message' => 'Category created successfully.', 'category' => $newCategory], 201);
    } catch (\Exception $e) {
        // ...
    }
}
    
    public function update(Request $request, Category $category)
    {
        $validatedData = $request->validate([
        'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
        'slug' => 'nullable|string|max:255|unique:categories,slug,' . $category->id,
        'description' => 'nullable|string',
    ]);
        
        try {
            $category->update($validatedData);
            return response()->json(['message' => 'Category updated successfully.', 'category' => $category], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to update category.', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Category $category)
    {
        try {
            $category->delete();
            return response()->json(['message' => 'Category deleted successfully.'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete category.', 'error' => $e->getMessage()], 500);
        }
    }
}