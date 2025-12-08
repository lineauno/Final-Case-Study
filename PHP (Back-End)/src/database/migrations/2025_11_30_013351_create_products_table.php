<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Creates the schema for the 'products' database table.
     * * Establishes columns for identity, financial data (price), and inventory levels.
     * Configures a nullable foreign key relationship to the 'categories' table with 
     * a cascade rule that sets the category ID to null if the parent is deleted.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            
            $table->integer('stock')->default(0);
            $table->text('image_url')->nullable();
            $table->boolean('is_featured')->default(false);
            
            $table->foreignId('category_id')
                ->nullable()
                ->constrained('categories')
                ->onDelete('set null'); 
            
            $table->timestamps();
        });
    }

    /**
     * Removes the 'products' table from the database schema.
     * * Used for reversing the migration during development or testing rollbacks.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};