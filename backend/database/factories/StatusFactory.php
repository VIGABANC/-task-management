<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Status>
 */
class StatusFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'statut' => $this->faker->randomElement(['pending', 'in_progress', 'completed', 'cancelled']),
            'date_changed' => $this->faker->dateTimeThisYear(),
            'task_id' => rand(1, 10),
        ];
    }
}
