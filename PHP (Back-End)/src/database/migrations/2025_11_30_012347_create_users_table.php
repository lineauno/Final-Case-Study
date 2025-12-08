<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Executes the creation of the 'users' table schema.
     * * Defines unique constraints for identification (id, email) and standard 
     * Laravel columns for authentication (password, remember_token) and 
     * audit logs (timestamps).
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id(); 
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverts the database changes by dropping the 'users' table.
     * * This is typically used during database refreshes or rollbacks.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};