<?php

namespace Database\Factories;

use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Service>
 */
class ServiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Service::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->words(4, true),
            'description' => $this->faker->sentence(),
            'price' => $this->faker->randomFloat(2, 10, 1000),
            'category' => $this->faker->randomElement(['electronics', 'clothing', 'books', 'furniture']),
            'image' => $this->faker->imageUrl(640, 480, 'service', true),
        ];
    }
}
