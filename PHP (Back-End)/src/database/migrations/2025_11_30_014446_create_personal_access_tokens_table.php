<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Creates the 'personal_access_tokens' table schema.
     * * This table is required by Laravel Sanctum to store API tokens. It uses 
     * polymorphic relationships ('tokenable') to associate tokens with users 
     * or other entities, tracks specific token abilities (permissions), 
     * and monitors token usage and expiration.
     */
    public function up(): void
    {
        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->morphs('tokenable');
            $table->text('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable()->index();
            $table->timestamps();
        });
    }

    /**
     * Drops the 'personal_access_tokens' table.
     * * This action will invalidate all currently active API sessions generated 
     * via Sanctum upon execution.
     */
    public function down(): void
    {
        Schema::dropIfExists('personal_access_tokens');
    }
};