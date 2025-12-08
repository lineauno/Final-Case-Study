<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Creates the schema for the 'categories' database table.
     * * Establishes indexing requirements for names and URL slugs to ensure 
     * uniqueness across the storefront. Allows for optional descriptions 
     * and includes standard audit timestamps.
     */
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->string('slug')->unique();
            $table->timestamps();
        });
    }

    /**
     * Removes the 'categories' table from the database schema.
     * * Executed when rolling back migrations to reverse the table creation.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};