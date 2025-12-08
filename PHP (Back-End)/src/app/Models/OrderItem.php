<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;
    
    /**
     * Defines an inverse one-to-many relationship with the Order model.
     * Links this specific line item back to its parent order record.
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
    
    /**
     * Defines an inverse one-to-many relationship with the Product model.
     * Provides access to the product data associated with this line item.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}