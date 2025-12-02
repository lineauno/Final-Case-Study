<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Carts Table
        Schema::create('carts', function (Blueprint $table) {
            $table->id();
            // Link to the user who owns this cart
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            
            // Ensures a user can only have one cart
            $table->unique('user_id'); 
        });

        // 2. Cart Items Table
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            // Link to the specific cart
            $table->foreignId('cart_id')->constrained()->onDelete('cascade');
            // Link to the product being held
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->unsignedInteger('quantity');
            $table->timestamps();
            
            // Ensures a product is only listed once per cart
            $table->unique(['cart_id', 'product_id']); 
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cart_items');
        Schema::dropIfExists('carts');
    }
};