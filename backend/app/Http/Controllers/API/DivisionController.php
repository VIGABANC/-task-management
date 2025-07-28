<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Division;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DivisionController extends Controller
{
    // GET /api/divisions
    public function index()
    {
        $divisions = Division::all();
        return response()->json($divisions);
    }

    // POST /api/divisions
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'division_nom'         => 'required|max:255',
            'division_responsable' => 'required|max:255',
            'password'             => 'required|max:255',
        ]);

        $division = Division::create($validatedData);
        return response()->json([
            'message' => 'Division created successfully',
            'data'    => $division
        ], 201);
    }

    // GET /api/divisions/{division}
    public function show(Division $division)
    {
        return response()->json($division);
    }

    // PUT/PATCH /api/divisions/{division}
    public function update(Request $request, Division $division)
    {
        try {
            $validatedData = $request->validate([
                'division_nom'         => 'required|max:255',
                'division_responsable' => 'required|max:255',
                'password'             => 'required|max:255', // Password is now required since we show it
            ]);

            // Update all fields including password
            $updateData = $validatedData;

            // Log the update attempt
            Log::info('Updating division', [
                'division_id' => $division->division_id,
                'old_data' => $division->toArray(),
                'new_data' => $updateData
            ]);

            $division->update($updateData);
            
            // Log successful update
            Log::info('Division updated successfully', [
                'division_id' => $division->division_id
            ]);

            return response()->json([
                'message' => 'Division updated successfully',
                'data'    => $division
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Division update validation failed', [
                'division_id' => $division->division_id,
                'errors' => $e->errors()
            ]);
            
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Division update failed', [
                'division_id' => $division->division_id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'message' => 'Failed to update division: ' . $e->getMessage()
            ], 500);
        }
    }

    // DELETE /api/divisions/{division}
    public function destroy(Division $division)
    {
        $division->delete();
        return response()->json(['message' => 'Division deleted successfully']);
    }
}
