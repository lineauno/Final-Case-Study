<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     * Links this factory specifically to the Product Eloquent model.
     */
    protected $model = Product::class;

    /**
     * Define the model's default state.
     * Utilizes Faker to generate localized, unique, and realistic 
     * dummy data for names, descriptions, pricing, and stock levels.
     * * @return array<string, mixed>
     */
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