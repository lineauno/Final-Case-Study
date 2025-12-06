<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        Category::firstOrCreate(['name' => 'Art Supplies'], ['description' => 'Paints, brushes, and canvases.']);
        Category::firstOrCreate(['name' => 'Writing Instruments'], ['description' => 'Pens, pencils, and specialty markers.']);
        Category::firstOrCreate(['name' => 'Craft Kits'], ['description' => 'DIY kits and assembly sets.']);
    }
}