<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Documentpath>
 */
class DocumentpathFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'document_path' => $this->faker->filePath(),
            'task_id' => rand(1, 10),
            'hist_id' => rand(1, 10),
        ];
    }
}
