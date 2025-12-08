<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Retrieves a complete listing of all categories.
     * Returns a JSON collection of category models or a 500 error on failure.
     */
    public function index()
    {
        try {
            $categories = Category::all();
            return response()->json(['categories' => $categories], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch categories.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Validates and stores a new category record.
     * Ensures uniqueness for both the category name and the slug.
     */
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
            return response()->json(['message' => 'Failed to create category.', 'error' => $e->getMessage()], 500);
        }
    }
    
    /**
     * Updates an existing category record via Route Model Binding.
     * Validates uniqueness while ignoring the current category's ID.
     */
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

    /**
     * Removes the specified category from the database.
     * Uses model instance injection to identify the record to be deleted.
     */
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