<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     * Contains the reference to the user and the snapshot total.
     */
    protected $fillable = ['user_id', 'total'];
    
    /**
     * Defines a one-to-many relationship with the CartItem model.
     * Allows access to all individual items currently held in this cart.
     */
    public function items()
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Defines a inverse one-to-one or many-to-one relationship with the User model.
     * Associates the shopping cart with its respective owner.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Accessor to dynamically calculate the live total of the cart.
     * Eager loads item products to calculate the sum based on current unit 
     * prices and requested quantities.
     */
    public function getTotalAttribute()
    {
        $this->loadMissing('items.product');
        return $this->items->sum(function ($item) {
            return $item->product ? ($item->product->price * $item->quantity) : 0;
        });
    }
}