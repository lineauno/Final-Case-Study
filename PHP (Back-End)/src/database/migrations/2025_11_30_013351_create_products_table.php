<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
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
            
            // 💡 FIX: Added ->nullable() here
            $table->foreignId('category_id')
                ->nullable() // <--- THIS IS THE KEY FIX
                ->constrained('categories')
                ->onDelete('set null'); 
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};