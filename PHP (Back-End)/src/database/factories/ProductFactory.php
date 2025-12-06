<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->words(3, true),
            'description' => $this->faker->paragraph(),
            'price' => $this->faker->randomFloat(2, 5, 100), 
            'stock' => $this->faker->numberBetween(0, 50), 
            'image_url' => 'https://placehold.co/400x400/eee/333/png?text=Random+Item', 
            'is_featured' => $this->faker->boolean(30),
            'category_id' => 1, 
        ];
    }
}