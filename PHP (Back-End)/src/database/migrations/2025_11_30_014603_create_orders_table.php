<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            // Link to the user who placed the order
            $table->foreignId('user_id')
                  ->constrained() // Assumes a 'users' table exists
                  ->onDelete('cascade'); 
            
            $table->text('shipping_address'); // Stores the address provided at checkout
            $table->decimal('order_total', 10, 2); // Stores the final total price
            $table->string('status')->default('Pending'); // Initial status (e.g., Pending, Processing, Shipped)
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};