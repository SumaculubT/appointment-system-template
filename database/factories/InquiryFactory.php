<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Inquiry>
 */
class InquiryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $user = User::inRandomOrder()->first(); // Pick a random user from the DB

        return [
            'user_id' => $user?->id,
            'user_name' => $user?->name,
            'user_email' => $user?->email,
            'user_contact_number' => $user?->user_contact_number,
            'vehicle_desc' => $this->faker->sentence(),
            'plate_number' => $this->faker->regexify('[A-Z]{3}-[0-9]{3}'),
            'set_date' => $this->faker->date(),
            'set_time' => $this->faker->time(),
            'inquiry' => $this->faker->paragraph(),
            'status' => $this->faker->randomElement(['pending', 'waitlisted', 'rejected', 'approved']),
        ];
    }
}
