<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     * Maps the individual item to a specific cart and product, 
     * while maintaining the requested quantity.
     */
    protected $fillable = [
        'cart_id', 
        'product_id', 
        'quantity'
    ];

    /**
     * Defines an inverse relationship with the Product model.
     * Provides access to the product details associated with this specific cart line item.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Defines an inverse relationship with the Cart model.
     * Identifies the parent cart container to which this item belongs.
     */
    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }
}