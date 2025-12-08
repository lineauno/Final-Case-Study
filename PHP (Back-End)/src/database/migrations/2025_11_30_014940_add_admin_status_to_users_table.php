<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Updates the 'users' table schema with administrative and moderation flags.
     * * Adds 'is_admin' to facilitate role-based access control (RBAC) and 
     * 'is_banned' to handle user restrictions. These columns are strategically 
     * placed after authentication credentials for semantic logical grouping.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_admin')->default(false)->after('email');
            $table->boolean('is_banned')->default(false)->after('is_admin');
        });
    }

    /**
     * Reverts the modifications by removing the status and access columns.
     * * Drops the moderation and administration boolean flags from the 'users' 
     * table to return the schema to its previous state.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('is_banned');
            $table->dropColumn('is_admin');
        });
    }
};