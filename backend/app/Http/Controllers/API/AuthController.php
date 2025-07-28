<?php

namespace App\Http\Controllers\API;

use App\Models\Admin;
use App\Models\Division;
use App\Models\Superadmin;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class AuthController extends Controller
{
    public function login(Request $request)
{
    $credentials = $request->validate([
        'username' => 'required|string',
        'password' => 'required|string'
    ]);
    // chek superadmin
    $superadmin = Superadmin::where('username', $credentials['username'])->first();
    if ($superadmin && $credentials['password'] === $superadmin->password) {
        return response()->json([
            'message' => 'SuperAdmin login successful',
            'user' => [
                'username' => $superadmin->username,
                'role' => $superadmin->role,

                'division_id' => null // Explicitly null for admin
            ]
        ], 200);
    }
    // Check Admin
    $admin = Admin::where('username', $credentials['username'])->first();
    if ($admin && $credentials['password'] === $admin->password) {
        return response()->json([
            'message' => 'Admin login successful',
            'user' => [
                'username' => $admin->username,
                'role' => $admin->role,
                'division_id' => null // Explicitly null for admin
            ]
        ], 200);
    }

    // Check Division Responsable
    $division = Division::where('division_responsable', $credentials['username'])->first();
    if ($division && $credentials['password'] === $division->password) {
        return response()->json([
            'message' => 'Division login successful',
            'user' => [
                'username' => $division->division_responsable,
                'role' => 'division_responsable',
                'division_id' => $division->division_id // Add division ID here
            ]
        ], 200);
    }

    return response()->json(['message' => 'Invalid credentials'], 401);
}
    

    // Optional: A method to securely rehash passwords (if you want to transition to bcrypt in the future)
    public function rehashPasswords()
    {
        // Rehash Admin passwords if necessary
        $admins = Admin::all();
        foreach ($admins as $admin) {
            // Check if the password is plain-text and rehash it (optional rehashing)
            if (!Hash::needsRehash($admin->password)) {
                $admin->password = bcrypt($admin->password); // Bcrypt the password
                $admin->save();
            }
        }

        // Rehash Division passwords if necessary
        $divisions = Division::all();
        foreach ($divisions as $division) {
            // Check if the password is plain-text and rehash it (optional rehashing)
            if (!Hash::needsRehash($division->password)) {
                $division->password = bcrypt($division->password); // Bcrypt the password
                $division->save();
            }
        }

        return response()->json([
            'message' => 'Passwords have been rehashed where needed.'
        ], 200);
    }
}
