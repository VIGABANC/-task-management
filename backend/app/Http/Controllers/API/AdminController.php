<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AdminController extends Controller
{
    // GET /api/admins
    public function index()
    {
        $admins = Admin::all();
        return response()->json($admins);
    }

    // POST /api/admins
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'username' => 'required|max:255',
            'password' => 'required|max:255',
            'role'=> 'required|max:255',
            'superadmin_id'=> 'required|max:255',
        ]);

        $admin = Admin::create($validatedData);
        return response()->json([
            'message' => 'Admin created successfully',
            'data'    => $admin
        ], 201);
    }

    // GET /api/admins/{admin}
    public function show(Admin $admin)
    {
        return response()->json($admin);
    }

    // PUT/PATCH /api/admins/{admin}
    public function update(Request $request, Admin $admin)
    {
        try {
            $validatedData = $request->validate([
                'username' => 'required|max:255',
                'password' => 'required|max:255', // Password is now required since we show it
                'role' => 'required|max:255',
                'superadmin_id' => 'required|max:255',
            ]);

            // Update all fields including password
            $updateData = $validatedData;
            
            // Log the update attempt
            Log::info('Updating admin', [
                'admin_id' => $admin->admin_id,
                'old_data' => $admin->toArray(),
                'new_data' => $updateData
            ]);

            $admin->update($updateData);
            
            // Log successful update
            Log::info('Admin updated successfully', [
                'admin_id' => $admin->admin_id
            ]);

            return response()->json([
                'message' => 'Admin updated successfully',
                'data'    => $admin
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Admin update validation failed', [
                'admin_id' => $admin->admin_id,
                'errors' => $e->errors()
            ]);
            
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Admin update failed', [
                'admin_id' => $admin->admin_id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'message' => 'Failed to update admin: ' . $e->getMessage()
            ], 500);
        }
    }

    // DELETE /api/admins/{admin}
    public function destroy(Admin $admin)
    {
        $admin->delete();
        return response()->json(['message' => 'Admin deleted successfully']);
    }
}
