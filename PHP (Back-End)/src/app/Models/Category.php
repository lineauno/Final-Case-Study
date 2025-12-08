<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str; 
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     * Includes basic category identification and search engine friendly slugs.
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
    ];

    /**
     * Booted method to handle model lifecycle events.
     * Automatically generates a URL-friendly slug from the category name
     * during creation or updates if one is not manually provided.
     */
    protected static function booted()
    {
        static::creating(function ($category) {
            if (empty($category->slug)) {
                $category->slug = Str::slug($category->name);
            }
        });

        static::updating(function ($category) {
            if ($category->isDirty('name') && empty($category->slug)) {
                $category->slug = Str::slug($category->name);
            }
        });
    }

    /**
     * Defines a one-to-many relationship with the Product model.
     * Allows retrieval of all products associated with this specific category via 'category_id'.
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'category_id');
    }
}