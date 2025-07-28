<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Historique>
 */
class HistoriqueFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'description' => $this->faker->sentence(),
            'change_date' => $this->faker->dateTimeThisYear(),
            'dochistorique_path' => $this->faker->filePath(),
            'task_id' => rand(1, 10),
        ];
    }
}
