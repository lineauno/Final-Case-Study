<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Executes the creation of the 'order_items' table schema.
     * * Establishes a many-to-one relationship between specific order line items 
     * and their parent orders and products. Includes a financial snapshot 
     * ('price_at_purchase') to preserve the product's unit price at the 
     * exact moment the transaction was finalized, regardless of future 
     * product price updates.
     */
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')
                  ->constrained('orders')
                  ->onDelete('cascade'); 
                  
            $table->foreignId('product_id')
                  ->constrained('products'); 
            
            $table->unsignedInteger('quantity');
            $table->decimal('price_at_purchase', 10, 2); 
            
            $table->timestamps();
        });
    }

    /**
     * Reverses the database migration by dropping the 'order_items' table.
     * * Dropping this table will remove all line-item data associated with orders, 
     * but will not affect the core order or product records.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};