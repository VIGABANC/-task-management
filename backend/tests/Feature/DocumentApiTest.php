<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Task;
use App\Models\Documentpath;
use App\Models\Historique;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Testing\RefreshDatabase;

class DocumentApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    public function test_can_upload_document()
    {
        // Create a task first
        $task = Task::factory()->create();

        $file = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');

        $response = $this->postJson('/api/v1/documentpaths', [
            'document_path' => $file,
            'task_id' => $task->task_id,
        ]);

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'message' => 'File uploaded successfully!'
                ]);

        $this->assertDatabaseHas('documentpath', [
            'task_id' => $task->task_id,
        ]);

        // Check if file was stored - get the actual path from the response
        $responseData = $response->json();
        $documentPath = $responseData['data']['document_path'];
        Storage::disk('public')->assertExists($documentPath);
    }

    public function test_can_upload_historique_document()
    {
        // Create a task first
        $task = Task::factory()->create();

        $file = UploadedFile::fake()->create('historique.pdf', 100, 'application/pdf');

        $response = $this->postJson('/api/v1/historiques', [
            'dochistorique_path' => $file,
            'description' => 'Test historique',
            'task_id' => $task->task_id,
            'change_date' => now()->toISOString(),
        ]);

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'message' => 'History entry created successfully!'
                ]);

        $this->assertDatabaseHas('historique', [
            'task_id' => $task->task_id,
            'description' => 'Test historique',
        ]);

        // Check if file was stored - get the actual path from the response
        $responseData = $response->json();
        $documentPath = $responseData['data']['dochistorique_path'];
        Storage::disk('public')->assertExists($documentPath);
    }

    public function test_validates_file_type()
    {
        $task = Task::factory()->create();
        $file = UploadedFile::fake()->create('document.exe', 100, 'application/octet-stream');

        $response = $this->postJson('/api/v1/documentpaths', [
            'document_path' => $file,
            'task_id' => $task->task_id,
        ]);

        $response->assertStatus(422);
    }

    public function test_validates_file_size()
    {
        $task = Task::factory()->create();
        $file = UploadedFile::fake()->create('document.pdf', 3000, 'application/pdf'); // 3MB

        $response = $this->postJson('/api/v1/documentpaths', [
            'document_path' => $file,
            'task_id' => $task->task_id,
        ]);

        $response->assertStatus(422);
    }

    public function test_can_download_document()
    {
        $task = Task::factory()->create();
        $document = Documentpath::factory()->create([
            'task_id' => $task->task_id,
            'document_path' => 'uploads/test.pdf',
        ]);

        // Create a fake file
        Storage::disk('public')->put('uploads/test.pdf', 'fake pdf content');

        $response = $this->get("/api/v1/documentpaths/{$document->document_id}/download");

        $response->assertStatus(200);
        // The response should contain the file content
        $this->assertNotEmpty($response->getContent());
    }

    public function test_can_download_historique()
    {
        $task = Task::factory()->create();
        $historique = Historique::factory()->create([
            'task_id' => $task->task_id,
            'dochistorique_path' => 'historiques/test.pdf',
        ]);

        // Create a fake file
        Storage::disk('public')->put('historiques/test.pdf', 'fake pdf content');

        $response = $this->get("/api/v1/historiques/{$historique->hist_id}/download");

        $response->assertStatus(200);
        // The response should contain the file content
        $this->assertNotEmpty($response->getContent());
    }

    public function test_returns_404_for_nonexistent_document()
    {
        $response = $this->get('/api/v1/documentpaths/999/download');
        $response->assertStatus(404);
    }

    public function test_returns_404_for_nonexistent_historique()
    {
        $response = $this->get('/api/v1/historiques/999/download');
        $response->assertStatus(404);
    }

    public function test_can_delete_document()
    {
        $task = Task::factory()->create();
        $document = Documentpath::factory()->create([
            'task_id' => $task->task_id,
            'document_path' => 'uploads/test.pdf',
        ]);

        // Create a fake file
        Storage::disk('public')->put('uploads/test.pdf', 'fake pdf content');

        $response = $this->deleteJson("/api/v1/documentpaths/{$document->document_id}");

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'message' => 'Document deleted successfully'
                ]);

        $this->assertDatabaseMissing('documentpath', [
            'document_id' => $document->document_id,
        ]);

        // Check if file was deleted
        Storage::disk('public')->assertMissing('uploads/test.pdf');
    }

    public function test_can_delete_historique()
    {
        $task = Task::factory()->create();
        $historique = Historique::factory()->create([
            'task_id' => $task->task_id,
            'dochistorique_path' => 'historiques/test.pdf',
        ]);

        // Create a fake file
        Storage::disk('public')->put('historiques/test.pdf', 'fake pdf content');

        $response = $this->deleteJson("/api/v1/historiques/{$historique->hist_id}");

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'message' => 'Historique deleted successfully'
                ]);

        $this->assertDatabaseMissing('historique', [
            'hist_id' => $historique->hist_id,
        ]);

        // Check if file was deleted
        Storage::disk('public')->assertMissing('historiques/test.pdf');
    }
} 