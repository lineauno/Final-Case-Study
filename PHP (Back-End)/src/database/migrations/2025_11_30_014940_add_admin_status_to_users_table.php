<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Add column to determine admin access (required by 'role:admin' middleware)
            $table->boolean('is_admin')->default(false)->after('email');
            
            // Add column to handle user banning (required by UserController)
            $table->boolean('is_banned')->default(false)->after('is_admin');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('is_banned');
            $table->dropColumn('is_admin');
        });
    }
};