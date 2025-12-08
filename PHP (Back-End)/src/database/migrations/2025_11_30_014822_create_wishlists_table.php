<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Executes the creation of the 'wishlists' table schema.
     * * Establishes a many-to-many relationship between users and products. 
     * Foreign keys are configured to cascade on delete, ensuring orphaned 
     * wishlist entries are removed. A unique composite index on 'user_id' 
     * and 'product_id' prevents duplicate entries for the same product.
     */
    public function up(): void
    {
        Schema::create('wishlists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            $table->unique(['user_id', 'product_id']); 
        });
    }

    /**
     * Reverses the database migration by dropping the 'wishlists' table.
     * * This action is typically used during rollbacks to cleanly remove the 
     * wishlist entity and its associated composite indexes.
     */
    public function down(): void
    {
        Schema::dropIfExists('wishlists');
    }
};