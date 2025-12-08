<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Executes the category table seeding.
     * * Uses 'firstOrCreate' to verify the existence of standard inventory 
     * categories before insertion. This ensures that the base categories 
     * (Art Supplies, Writing Instruments, and Craft Kits) are present 
     * without creating duplicate records during repeated migrations or 
     * environment refreshes.
     */
    public function run(): void
    {
        Category::firstOrCreate(['name' => 'Art Supplies'], ['description' => 'Paints, brushes, and canvases.']);
        Category::firstOrCreate(['name' => 'Writing Instruments'], ['description' => 'Pens, pencils, and specialty markers.']);
        Category::firstOrCreate(['name' => 'Craft Kits'], ['description' => 'DIY kits and assembly sets.']);
    }
}