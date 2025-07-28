<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Documentpath;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class DocumentpathController extends Controller
{
    // GET /api/documentpaths
    public function index()
    {
        try {
            $documentpaths = Documentpath::with('task')->get();
            return response()->json($documentpaths);
        } catch (\Exception $e) {
            Log::error('Error fetching documentpaths: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching documents'
            ], 500);
        }
    }

    // POST /api/documentpaths
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'document_path' => 'required|file|mimes:pdf,doc,docx,txt|max:2048',
                'task_id'       => 'required|integer|exists:task,task_id',
                'hist_id'       => 'nullable|integer|exists:historique,hist_id',
            ]);

            if ($request->hasFile('document_path')) {
                $file = $request->file('document_path');
                
                // Generate unique filename
                $originalName = $file->getClientOriginalName();
                $extension = $file->getClientOriginalExtension();
                $filename = time() . '_' . uniqid() . '.' . $extension;
                
                // Save to the 'public' disk under 'uploads' directory
                $path = $file->storeAs('uploads', $filename, 'public');
        
                // Save to database
                $document = Documentpath::create([
                    'task_id' => $request->task_id,
                    'document_path' => $path,
                    'hist_id' => $request->hist_id,
                ]);
        
                return response()->json([
                    'success' => true,
                    'message' => 'File uploaded successfully!',
                    'data' => $document,
                ]);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'No file provided.',
            ], 400);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error uploading document: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'File upload failed.',
            ], 500);
        }
    }

    // GET /api/documentpaths/{documentpath}
    public function show(Documentpath $documentpath)
    {
        try {
            $documentpath->load('task');
            return response()->json([
                'success' => true,
                'data' => $documentpath
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching document: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching document'
            ], 500);
        }
    }

    // Download document
    public function download(Documentpath $documentpath)
    {
        try {
            $filePath = $documentpath->document_path;
            
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
            Log::error('Error downloading document: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error downloading file'
            ], 500);
        }
    }

    // PUT/PATCH /api/documentpaths/{documentpath}
    public function update(Request $request, Documentpath $documentpath)
    {
        try {
            $validatedData = $request->validate([
                'document_path' => 'nullable|file|mimes:pdf,doc,docx,txt|max:2048',
                'task_id'       => 'required|integer|exists:task,task_id',
                'hist_id'       => 'nullable|integer|exists:historique,hist_id',
            ]);

            // If new file is uploaded, delete old file and upload new one
            if ($request->hasFile('document_path')) {
                // Delete old file
                if (Storage::disk('public')->exists($documentpath->document_path)) {
                    Storage::disk('public')->delete($documentpath->document_path);
                }
                
                // Upload new file
                $file = $request->file('document_path');
                $originalName = $file->getClientOriginalName();
                $extension = $file->getClientOriginalExtension();
                $filename = time() . '_' . uniqid() . '.' . $extension;
                $path = $file->storeAs('uploads', $filename, 'public');
                
                $validatedData['document_path'] = $path;
            }

            $documentpath->update($validatedData);
            
            return response()->json([
                'success' => true,
                'message' => 'Document updated successfully',
                'data'    => $documentpath
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error updating document: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error updating document'
            ], 500);
        }
    }

    // DELETE /api/documentpaths/{documentpath}
    public function destroy(Documentpath $documentpath)
    {
        try {
            // Delete file from storage
            if (Storage::disk('public')->exists($documentpath->document_path)) {
                Storage::disk('public')->delete($documentpath->document_path);
            }
            
            $documentpath->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Document deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting document: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error deleting document'
            ], 500);
        }
    }
}
