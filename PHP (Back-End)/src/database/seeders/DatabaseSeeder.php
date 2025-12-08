<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     * * Orchestrates the execution of individual seeder classes in a specific 
     * logical order. Ensures that lookup data (Categories) exists before 
     * relational data (Products) and test users are created, preventing 
     * foreign key constraint errors during the seeding process.
     */
    public function run(): void
    {
        $this->call([
            CategorySeeder::class,
            ProductSeeder::class,
            UserSeeder::class,
        ]);
    }
}