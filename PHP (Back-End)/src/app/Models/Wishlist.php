<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Wishlist extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     * Links a user's unique identifier to a specific product identifier 
     * to form a wishlist entry.
     */
    protected $fillable = ['user_id', 'product_id']; 

    /**
     * Defines an inverse relationship with the Product model.
     * Provides access to the detailed product record saved in the wishlist.
     * * @return BelongsTo
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Defines an inverse relationship with the User model.
     * Identifies the owner of this specific wishlist entry.
     * * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}