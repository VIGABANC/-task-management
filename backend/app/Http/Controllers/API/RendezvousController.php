<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\rendezvous;
use Illuminate\Http\Request;

class RendezvousController extends Controller
{
    // GET /api/rendezvouss
    public function index()
    {
        $rdv= rendezvous::all();
        return response()->json($rdv);
    }

    // POST /api/rendezvouss
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'date' => 'required|max:255',
            'time' => 'required|max:255',
            'person' => 'required|max:255',
            'subject' => 'required|max:255',
            'notes' => 'nullable|max:255',
            'location' => 'nullable|max:255',
            'admin_id' => 'required|max:255',
            'superadmin_id' => 'required|max:255',
        ]);

        $rdv = rendezvous::create($validatedData);
        return response()->json([
            'message' => 'rendezvous created successfully',
            'data'    => $rdv
        ], 201);
    }

    // GET /api/rendezvouss/{rendezvous}
    public function show(rendezvous $rdv)
    {
        return response()->json($rdv);
    }

    // PUT/PATCH /api/rendezvouss/{rendezvous}
    public function update(Request $request, rendezvous $rdv)
    {
        $validatedData = $request->validate([
            'date' => 'required|max:255',
            'time' => 'required|max:255',
            'person' => 'required|max:255',
            'subject' => 'required|max:255',
            'notes' => 'nullable|max:255',
            'location' => 'nullable|max:255',
            'admin_id' => 'required|max:255',
            'superadmin_id' => 'required|max:255',
        ]);

        $rdv->update($validatedData);
        return response()->json([
            'message' => 'rendezvous updated successfully',
            'data'    => $rdv
        ]);
    }

    // DELETE /api/rendezvouss/{rendezvous}
    public function destroy(rdv $rdv)
    {
        $rdv->delete();
        return response()->json(['message' => 'rendezvous deleted successfully']);
    }
}
