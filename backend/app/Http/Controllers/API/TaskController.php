<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    // GET /api/tasks
    public function index()
    {
        // Loads related relationships (optional)
        $tasks = Task::with(['division', 'statuses', 'historiques', 'documentpaths'])->get();
        return response()->json($tasks);
    }
    
    // POST /api/tasks
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'task_name'   => 'required|max:255',
            'description' => 'nullable|max:255',
            'due_date'    => 'required|date',
            'fin_date'    => 'nullable|date',
            'division_id' => 'required|integer',
        ]);

        $task = Task::create($validatedData);
        return response()->json([
            'message' => 'Task created successfully',
            'data'    => $task
        ], 201);
    }

    // GET /api/tasks/{task}
    public function show(Task $task)
    {
        return response()->json($task);
    }

    // PUT/PATCH /api/tasks/{task}
    public function update(Request $request, Task $task)
    {
        $validatedData = $request->validate([
            'task_name'   => 'required|max:255',
            'description' => 'nullable|max:255',
            'due_date'    => 'required|date',
            'fin_date'    => 'nullable|date',
            'division_id' => 'required|integer',
        ]);

        $task->update($validatedData);
        return response()->json([
            'message' => 'Task updated successfully',
            'data'    => $task
        ]);
    }

    // DELETE /api/tasks/{task}
    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json(['message' => 'Task deleted successfully']);
    }
}
