<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     * Maps essential product data including identification, pricing, inventory 
     * levels, and administrative flags for featured items.
     */
    protected $fillable = [
        'name', 
        'description', 
        'price', 
        'image_url',
        'stock',       
        'category_id',    
        'is_featured'
    ];

    /**
     * Defines an inverse relationship with the Category model.
     * Links each product to its parent category via the 'category_id' foreign key.
     * * @return BelongsTo
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class); 
    }
}