<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Status;
use Illuminate\Http\Request;

class StatusController extends Controller
{
    // GET /api/statuses
    public function index()
    {
        $statuses = Status::all();
        return response()->json($statuses);
    }

    // POST /api/statuses
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'statut'       => 'required|max:255',
            'date_changed' => 'required|date',
            'task_id'      => 'required|integer',
        ]);

        $status = Status::create($validatedData);
        return response()->json([
            'message' => 'Status created successfully',
            'data'    => $status
        ], 201);
    }

    // GET /api/statuses/{status}
    public function show(Status $status)
    {
        return response()->json($status);
    }

    // PUT/PATCH /api/statuses/{status}
    public function update(Request $request, Status $status)
    {
        $validatedData = $request->validate([
            'statut'       => 'required|max:255',
            'date_changed' => 'required|date',
            'task_id'      => 'required|integer',
        ]);

        $status->update($validatedData);
        return response()->json([
            'message' => 'Status updated successfully',
            'data'    => $status
        ]);
    }

    // DELETE /api/statuses/{status}
    public function destroy(Status $status)
    {
        $status->delete();
        return response()->json(['message' => 'Status deleted successfully']);
    }
}
