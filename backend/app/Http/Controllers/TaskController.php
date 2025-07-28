<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    // List all tasks
    public function index()
    {
        // You can include relationships if needed, e.g., with('division', 'statuses')
        $tasks = Task::all();
        return response()->json($tasks);
    }

    // Insert a new task
    public function store(Request $request)
    {
        // Validate incoming data
        $validatedData = $request->validate([
            'task_name'  => 'required|max:255',
            'description'=> 'required|max:255',
            'due_date'   => 'nullable|date',
            'fin_date'   => 'nullable|date',
            'division_id'=> 'required|integer',
        ]);

        $task = Task::create($validatedData);

        return response()->json([
            'message' => 'Task created successfully',
            'data'    => $task,
        ], 201);
    }

    // Read an individual task
    public function show(Task $task)
    {
        return response()->json($task);
    }

    // Update an existing task
    public function update(Request $request, Task $task)
    {
        $validatedData = $request->validate([
            'task_name'  => 'required|max:255',
            'description'=> 'required|max:255',
            'due_date'   => 'nullable|date',
            'fin_date'   => 'nullable|date',
            'division_id'=> 'required|integer',
        ]);

        $task->update($validatedData);

        return response()->json([
            'message' => 'Task updated successfully',
            'data'    => $task,
        ]);
    }

    // Delete a task
    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json([
            'message' => 'Task deleted successfully'
        ]);
    }
}
