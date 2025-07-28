<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Superadmin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SuperadminController extends Controller
{
    // GET /api/admins
    public function index()
    {
        $sadmins = Superadmin::all();
        return response()->json($sadmins);
    }

    // POST /api/admins
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'username' => 'required|max:255',
            'password' => 'required|max:255',
            'role'=> 'required|max:255',
        ]);

        $sadmin = Superadmin::create($validatedData);
        return response()->json([
            'message' => 'Admin created successfully',
            'data'    => $sadmin
        ], 201);
    }

    // GET /api/superadmins/{superadmin}
    public function show($superadmin_id)
    {
        $sadmin = Superadmin::findOrFail($superadmin_id);
        return response()->json($sadmin);
    }

    // PUT/PATCH /api/superadmins/{superadmin}
    public function update(Request $request, $superadmin_id)
    {
        try {
            // Find the superadmin manually since route model binding might not work
            $sadmin = Superadmin::findOrFail($superadmin_id);
            
            $validatedData = $request->validate([
                'username' => 'required|max:255',
                'password' => 'required|max:255', // Password is now required since we show it
                'role' => 'required|in:governeur,secretaire_general',
            ]);

            // Update all fields including password
            $updateData = $validatedData;

            // Log the update attempt
            Log::info('Updating superadmin', [
                'superadmin_id' => $sadmin->superadmin_id,
                'old_data' => $sadmin->toArray(),
                'new_data' => $updateData
            ]);

            // Use database transaction to ensure data consistency
            \DB::beginTransaction();
            
            try {
                $sadmin->update($updateData);
                
                // Refresh the model to get the updated data
                $sadmin->refresh();
                
                \DB::commit();
                
                // Log successful update
                Log::info('Superadmin updated successfully', [
                    'superadmin_id' => $sadmin->superadmin_id,
                    'updated_data' => $sadmin->toArray()
                ]);

                return response()->json([
                    'message' => 'Admin updated successfully',
                    'data'    => $sadmin
                ]);
            } catch (\Exception $e) {
                \DB::rollback();
                throw $e;
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Superadmin update validation failed', [
                'superadmin_id' => $superadmin_id,
                'errors' => $e->errors()
            ]);
            
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Superadmin update failed', [
                'superadmin_id' => $superadmin_id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Failed to update superadmin: ' . $e->getMessage()
            ], 500);
        }
    }

    // DELETE /api/superadmins/{superadmin}
    public function destroy($superadmin_id)
    {
        $sadmin = Superadmin::findOrFail($superadmin_id);
        $sadmin->delete();
        return response()->json(['message' => 'Superadmin deleted successfully']);
    }
}
