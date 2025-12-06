<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            // Link to the main order
            $table->foreignId('order_id')
                  ->constrained('orders')
                  ->onDelete('cascade'); 
                  
            // Link to the product
            $table->foreignId('product_id')
                  ->constrained('products'); 
            
            $table->unsignedInteger('quantity');
            $table->decimal('price_at_purchase', 10, 2); // Store the price at time of order
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};