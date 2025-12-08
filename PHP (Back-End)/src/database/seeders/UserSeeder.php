<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Executes the user table seeding logic.
     * * Establishes specific static accounts for testing authentication flows, 
     * including a standard customer and an administrative user. Utilizes 
     * 'firstOrCreate' to prevent duplication and chains with the User factory 
     * to generate a set of randomized additional users for load and pagination testing.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'test@example.com'], 
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'is_admin' => false,
            ]
        );

        User::firstOrCreate(
            ['email' => 'admin@example.com'], 
            [
                'name' => 'Admin User',
                'password' => Hash::make('secret'),
                'is_admin' => true,
            ]
        );

        User::factory(5)->create();
    }
}