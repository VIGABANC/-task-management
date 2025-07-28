<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Historique;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class HistoriqueController extends Controller
{
    // GET /api/historiques
    public function index()
    {
        try {
            $historiques = Historique::with('task')->get();
            return response()->json($historiques);
        } catch (\Exception $e) {
            Log::error('Error fetching historiques: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching historiques'
            ], 500);
        }
    }

    // POST /api/historiques
    public function store(Request $request) {
        try {
            // Validate the request
            $validatedData = $request->validate([
                'dochistorique_path' => 'required|file|mimes:pdf,doc,docx,txt|max:2048',
                'description' => 'required|string|max:500',
                'task_id' => 'required|integer|exists:task,task_id',
                'change_date' => 'required|date',
            ]);
        
            // Store the file and get the path
            $file = $request->file('dochistorique_path');
            $originalName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $filename = time() . '_' . uniqid() . '.' . $extension;
            $filePath = $file->storeAs('historiques', $filename, 'public');
        
            // Save to database
            $historique = Historique::create([
                'description' => $request->description,
                'task_id' => $request->task_id,
                'change_date' => $request->change_date,
                'dochistorique_path' => $filePath,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'History entry created successfully!',
                'data' => $historique
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error creating historique: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error creating history entry'
            ], 500);
        }
    }

    // GET /api/historiques/{historique}
    public function show(Historique $historique)
    {
        try {
            $historique->load('task');
            return response()->json([
                'success' => true,
                'data' => $historique
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching historique: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching history entry'
            ], 500);
        }
    }

    // Download historique document
    public function download(Historique $historique)
    {
        try {
            $filePath = $historique->dochistorique_path;
            
            if (!Storage::disk('public')->exists($filePath)) {
                return response()->json([
                    'success' => false,
                    'message' => 'File not found'
                ], 404);
            }

            $fullPath = Storage::disk('public')->path($filePath);
            $originalName = basename($filePath);
            
            // Get file extension for content type
            $extension = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION));
            $contentTypes = [
                'pdf' => 'application/pdf',
                'doc' => 'application/msword',
                'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'txt' => 'text/plain',
            ];
            
            $contentType = $contentTypes[$extension] ?? 'application/octet-stream';
            
            // For testing, return the file content directly
            if (app()->environment('testing')) {
                return response(Storage::disk('public')->get($filePath), 200, [
                    'Content-Type' => $contentType,
                ]);
            }
            
            return response()->download($fullPath, $originalName, [
                'Content-Type' => $contentType,
            ]);
        } catch (\Exception $e) {
            Log::error('Error downloading historique document: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error downloading file'
            ], 500);
        }
    }

    // PUT/PATCH /api/historiques/{historique}
    public function update(Request $request, Historique $historique)
    {
        try {
            $validatedData = $request->validate([
                'description' => 'required|string|max:500',
                'change_date' => 'required|date',
                'dochistorique_path' => 'nullable|file|mimes:pdf,doc,docx,txt|max:2048',
                'task_id'     => 'required|integer|exists:task,task_id',
            ]);

            // If new file is uploaded, delete old file and upload new one
            if ($request->hasFile('dochistorique_path')) {
                // Delete old file
                if (Storage::disk('public')->exists($historique->dochistorique_path)) {
                    Storage::disk('public')->delete($historique->dochistorique_path);
                }
                
                // Upload new file
                $file = $request->file('dochistorique_path');
                $originalName = $file->getClientOriginalName();
                $extension = $file->getClientOriginalExtension();
                $filename = time() . '_' . uniqid() . '.' . $extension;
                $filePath = $file->storeAs('historiques', $filename, 'public');
                
                $validatedData['dochistorique_path'] = $filePath;
            }

            $historique->update($validatedData);
            
            return response()->json([
                'success' => true,
                'message' => 'Historique updated successfully',
                'data'    => $historique
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error updating historique: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error updating history entry'
            ], 500);
        }
    }

    // DELETE /api/historiques/{historique}
    public function destroy(Historique $historique)
    {
        try {
            // Delete file from storage
            if (Storage::disk('public')->exists($historique->dochistorique_path)) {
                Storage::disk('public')->delete($historique->dochistorique_path);
            }
            
            $historique->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Historique deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting historique: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error deleting history entry'
            ], 500);
        }
    }
}
