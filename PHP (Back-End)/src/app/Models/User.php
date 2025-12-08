<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany; 

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     * Contains user identification, authentication, and status flags.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin',
        'is_banned',
    ];

    /**
     * The attributes that should be hidden for serialization.
     * Prevents sensitive security tokens and passwords from being exposed in JSON responses.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     * Ensures boolean flags and date fields are returned as their respective PHP types.
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_admin' => 'boolean', 
        'is_banned' => 'boolean',
    ];
    
    /**
     * Defines a one-to-one relationship with the Cart model.
     * Accesses the user's current shopping cart session.
     */
    public function cart()
    {
        return $this->hasOne(Cart::class);
    }
    
    /**
     * Defines a one-to-many relationship with the Order model.
     * Accesses the historical collection of purchase orders made by the user.
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Defines a one-to-many relationship with the Wishlist model.
     * Retrieves the collection of products saved to the user's wishlist.
     * * @return HasMany
     */
    public function wishlist(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }
}