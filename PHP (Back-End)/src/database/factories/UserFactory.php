<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     * Links this factory specifically to the User authenticatable model.
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     * Generates a unique set of user credentials, including fake names, 
     * safe emails, and a default hashed password for testing purposes.
     * * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9p4uWzE1gH9/aD701rF/l.',
            'remember_token' => Str::random(10),
        ];
    }
}