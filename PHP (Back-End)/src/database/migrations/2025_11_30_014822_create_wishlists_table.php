<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wishlists', function (Blueprint $table) {
            $table->id();
            // Foreign key to the users table
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            // Foreign key to the products table
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            // Ensure a user can only wish a product once
            $table->unique(['user_id', 'product_id']); 
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wishlists');
    }
};
