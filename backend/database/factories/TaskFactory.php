<?php

namespace Database\Factories;

use App\Models\Division;
use App\Models\Task;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Task Factory
 * 
 * Generates fake task data for testing and seeding purposes.
 * Follows PSR-12 coding standards and project conventions.
 */
class TaskFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Task::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Get a random division ID or create one if none exists
        $divisionId = Division::inRandomOrder()->first()?->division_id ?? 
                     Division::factory()->create()->division_id;

        return [
            'task_name' => $this->faker->sentence(3, 6),
            'description' => $this->faker->paragraph(2, 4),
            'due_date' => $this->faker->dateTimeBetween('now', '+2 months'),
            'fin_date' => $this->faker->optional(0.3)->dateTimeBetween('-1 month', 'now'),
            'division_id' => $divisionId,
        ];
    }

    /**
     * Indicate that the task is completed.
     *
     * @return static
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'fin_date' => $this->faker->dateTimeBetween('-1 month', 'now'),
        ]);
    }

    /**
     * Indicate that the task is overdue.
     *
     * @return static
     */
    public function overdue(): static
    {
        return $this->state(fn (array $attributes) => [
            'due_date' => $this->faker->dateTimeBetween('-2 months', '-1 week'),
            'fin_date' => null,
        ]);
    }

    /**
     * Indicate that the task is urgent (due within a week).
     *
     * @return static
     */
    public function urgent(): static
    {
        return $this->state(fn (array $attributes) => [
            'due_date' => $this->faker->dateTimeBetween('now', '+1 week'),
        ]);
    }
} 