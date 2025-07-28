<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\Division;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a test division
        $this->division = Division::create([
            'division_nom' => 'Test Division',
            'division_responsable' => 'Test User',
            'password' => '1234'
        ]);
    }

    /**
     * Test getting all tasks
     */
    public function test_can_get_all_tasks(): void
    {
        // Create test tasks
        Task::create([
            'task_name' => 'Test Task 1',
            'description' => 'Test Description 1',
            'due_date' => '2024-12-31',
            'division_id' => $this->division->division_id
        ]);

        Task::create([
            'task_name' => 'Test Task 2',
            'description' => 'Test Description 2',
            'due_date' => '2024-12-30',
            'division_id' => $this->division->division_id
        ]);

        $response = $this->getJson('/api/v1/tasks');

        $response->assertStatus(200)
                 ->assertJsonCount(2)
                 ->assertJsonStructure([
                     '*' => [
                         'task_id',
                         'task_name',
                         'description',
                         'due_date',
                         'fin_date',
                         'division_id'
                     ]
                 ]);
    }

    /**
     * Test creating a new task
     */
    public function test_can_create_task(): void
    {
        $taskData = [
            'task_name' => 'New Test Task',
            'description' => 'New Test Description',
            'due_date' => '2024-12-31',
            'division_id' => $this->division->division_id
        ];

        $response = $this->postJson('/api/v1/tasks', $taskData);

        $response->assertStatus(201)
                 ->assertJson([
                     'message' => 'Task created successfully'
                 ])
                 ->assertJsonStructure([
                     'message',
                     'data' => [
                         'task_id',
                         'task_name',
                         'description',
                         'due_date',
                         'division_id'
                     ]
                 ]);

        $this->assertDatabaseHas('task', $taskData);
    }

    /**
     * Test getting a specific task
     */
    public function test_can_get_specific_task(): void
    {
        $task = Task::create([
            'task_name' => 'Specific Task',
            'description' => 'Specific Description',
            'due_date' => '2024-12-31',
            'division_id' => $this->division->division_id
        ]);

        $response = $this->getJson("/api/v1/tasks/{$task->task_id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'task_id' => $task->task_id,
                     'task_name' => 'Specific Task'
                 ]);
    }

    /**
     * Test updating a task
     */
    public function test_can_update_task(): void
    {
        $task = Task::create([
            'task_name' => 'Original Task',
            'description' => 'Original Description',
            'due_date' => '2024-12-31',
            'division_id' => $this->division->division_id
        ]);

        $updateData = [
            'task_name' => 'Updated Task',
            'description' => 'Updated Description',
            'due_date' => '2024-12-30',
            'division_id' => $this->division->division_id
        ];

        $response = $this->putJson("/api/v1/tasks/{$task->task_id}", $updateData);

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Task updated successfully'
                 ]);

        $this->assertDatabaseHas('task', $updateData);
    }

    /**
     * Test deleting a task
     */
    public function test_can_delete_task(): void
    {
        $task = Task::create([
            'task_name' => 'Task to Delete',
            'description' => 'Description to Delete',
            'due_date' => '2024-12-31',
            'division_id' => $this->division->division_id
        ]);

        $response = $this->deleteJson("/api/v1/tasks/{$task->task_id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Task deleted successfully'
                 ]);

        $this->assertDatabaseMissing('task', ['task_id' => $task->task_id]);
    }

    /**
     * Test validation when creating task
     */
    public function test_validates_required_fields_when_creating_task(): void
    {
        $response = $this->postJson('/api/v1/tasks', []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['task_name', 'due_date', 'division_id']);
    }

    /**
     * Test validation when updating task
     */
    public function test_validates_required_fields_when_updating_task(): void
    {
        $task = Task::create([
            'task_name' => 'Test Task',
            'description' => 'Test Description',
            'due_date' => '2024-12-31',
            'division_id' => $this->division->division_id
        ]);

        $response = $this->putJson("/api/v1/tasks/{$task->task_id}", []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['task_name', 'due_date', 'division_id']);
    }

    /**
     * Test getting non-existent task
     */
    public function test_returns_404_for_non_existent_task(): void
    {
        $response = $this->getJson('/api/v1/tasks/999');

        $response->assertStatus(404);
    }
} 