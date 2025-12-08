<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     * Maps the order to a user and tracks logistical data such as 
     * shipping address, financial totals, and current fulfillment status.
     */
    protected $fillable = [
        'user_id',
        'shipping_address',
        'order_total',
        'status',
    ];

    /**
     * Defines an inverse one-to-many relationship with the User model.
     * Identifies the customer record associated with this order.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    /**
     * Defines a one-to-many relationship with the OrderItem model.
     * Provides access to the line items (product snapshots) contained within the order.
     */
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}