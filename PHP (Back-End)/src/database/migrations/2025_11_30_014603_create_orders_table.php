<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Executes the creation of the 'orders' table schema.
     * * Establishes a foreign key link to the user entity to track order ownership. 
     * Configures storage for the shipping address snapshot, financial totals, 
     * and a dynamic fulfillment status field which defaults to 'Pending'.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->constrained()
                  ->onDelete('cascade'); 
            
            $table->text('shipping_address');
            $table->decimal('order_total', 10, 2);
            $table->string('status')->default('Pending');
            
            $table->timestamps();
        });
    }

    /**
     * Drops the 'orders' table from the database.
     * * Reverses the table creation during a migration rollback, deleting 
     * all historical order data and associated fulfillment records.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};