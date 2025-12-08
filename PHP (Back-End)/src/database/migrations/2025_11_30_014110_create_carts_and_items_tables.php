<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Executes the creation of the 'carts' and 'cart_items' database tables.
     * * The 'carts' table establishes a one-to-one relationship with users, ensuring 
     * persistent cart ownership. The 'cart_items' table defines a many-to-many 
     * relationship between carts and products, including a unique constraint 
     * to prevent duplicate product entries within a single cart.
     */
    public function up(): void
    {
        Schema::create('carts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            
            $table->unique('user_id'); 
        });

        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cart_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->unsignedInteger('quantity');
            $table->timestamps();
            
            $table->unique(['cart_id', 'product_id']); 
        });
    }

    /**
     * Reverses the database changes by dropping the 'cart_items' and 'carts' tables.
     * * Tables are dropped in reverse order of creation to respect foreign key 
     * constraints and maintain referential integrity.
     */
    public function down(): void
    {
        Schema::dropIfExists('cart_items');
        Schema::dropIfExists('carts');
    }
};