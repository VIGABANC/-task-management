<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

Route::get('/', function () {
    return view('welcome');
});

// Add this route for secure file downloads
Route::get('/download/{path}', function ($path) {
    try {
        // Prevent directory traversal
        if (strpos($path, '..') !== false || strpos($path, '/') === 0) {
            Log::warning('Directory traversal attempt detected: ' . $path);
            abort(403, 'Access denied');
        }
        
        // Try both storage locations
        $storagePath = storage_path('app/public/' . $path);
        $publicPath = public_path('storage/' . $path);
        
        // Log the paths for debugging
        Log::info('Storage path: ' . $storagePath);
        Log::info('Public path: ' . $publicPath);
        
        $fullPath = null;
        if (file_exists($storagePath)) {
            $fullPath = $storagePath;
            Log::info('File found in storage path');
        } elseif (file_exists($publicPath)) {
            $fullPath = $publicPath;
            Log::info('File found in public path');
        }
        
        if (!$fullPath) {
            Log::error('File not found in either location: ' . $path);
            abort(404, 'File not found');
        }
        
        // Get file extension for content type
        $extension = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION));
        $contentTypes = [
            'pdf' => 'application/pdf',
            'doc' => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'txt' => 'text/plain',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
        ];
        
        $contentType = $contentTypes[$extension] ?? 'application/octet-stream';
        
        // Check if file is readable
        if (!is_readable($fullPath)) {
            Log::error('File is not readable: ' . $fullPath);
            abort(403, 'Access denied');
        }
        
        return response()->file($fullPath, [
            'Content-Type' => $contentType,
            'Content-Disposition' => 'inline; filename="' . basename($fullPath) . '"',
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0'
        ]);
    } catch (\Exception $e) {
        Log::error('Error serving file: ' . $e->getMessage());
        abort(500, 'Internal server error');
    }
})->where('path', '.*');
