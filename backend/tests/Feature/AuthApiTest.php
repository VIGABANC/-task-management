<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Division;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
    }

    /**
     * Test admin login with valid credentials
     */
    public function test_admin_can_login_with_valid_credentials(): void
    {
        $admin = Admin::create([
            'username' => 'testadmin',
            'password' => '1234'
        ]);

        $response = $this->postJson('/api/login', [
            'username' => 'testadmin',
            'password' => '1234'
        ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Admin login successful'
                 ])
                 ->assertJsonStructure([
                     'message',
                     'user' => [
                         'username',
                         'role',
                         'division_id'
                     ]
                 ]);
    }

    /**
     * Test division responsable login with valid credentials
     */
    public function test_division_responsable_can_login_with_valid_credentials(): void
    {
        $division = Division::create([
            'division_nom' => 'Test Division',
            'division_responsable' => 'testuser',
            'password' => '1234'
        ]);

        $response = $this->postJson('/api/login', [
            'username' => 'testuser',
            'password' => '1234'
        ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Division login successful'
                 ])
                 ->assertJsonStructure([
                     'message',
                     'user' => [
                         'username',
                         'role',
                         'division_id'
                     ]
                 ])
                 ->assertJson([
                     'user' => [
                         'role' => 'division_responsable',
                         'division_id' => $division->division_id
                     ]
                 ]);
    }

    /**
     * Test login with invalid credentials
     */
    public function test_login_fails_with_invalid_credentials(): void
    {
        $response = $this->postJson('/api/login', [
            'username' => 'invaliduser',
            'password' => 'wrongpassword'
        ]);

        $response->assertStatus(401)
                 ->assertJson([
                     'message' => 'Invalid credentials'
                 ]);
    }

    /**
     * Test login with missing username
     */
    public function test_login_fails_with_missing_username(): void
    {
        $response = $this->postJson('/api/login', [
            'password' => '1234'
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['username']);
    }

    /**
     * Test login with missing password
     */
    public function test_login_fails_with_missing_password(): void
    {
        $response = $this->postJson('/api/login', [
            'username' => 'testuser'
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['password']);
    }

    /**
     * Test admin login with wrong password
     */
    public function test_admin_login_fails_with_wrong_password(): void
    {
        $admin = Admin::create([
            'username' => 'testadmin',
            'password' => '1234'
        ]);

        $response = $this->postJson('/api/login', [
            'username' => 'testadmin',
            'password' => 'wrongpassword'
        ]);

        $response->assertStatus(401)
                 ->assertJson([
                     'message' => 'Invalid credentials'
                 ]);
    }

    /**
     * Test division responsable login with wrong password
     */
    public function test_division_login_fails_with_wrong_password(): void
    {
        $division = Division::create([
            'division_nom' => 'Test Division',
            'division_responsable' => 'testuser',
            'password' => '1234'
        ]);

        $response = $this->postJson('/api/login', [
            'username' => 'testuser',
            'password' => 'wrongpassword'
        ]);

        $response->assertStatus(401)
                 ->assertJson([
                     'message' => 'Invalid credentials'
                 ]);
    }

    /**
     * Test login with empty request
     */
    public function test_login_fails_with_empty_request(): void
    {
        $response = $this->postJson('/api/login', []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['username', 'password']);
    }

    /**
     * Test admin login returns correct role
     */
    public function test_admin_login_returns_admin_role(): void
    {
        $admin = Admin::create([
            'username' => 'testadmin',
            'password' => '1234'
        ]);

        $response = $this->postJson('/api/login', [
            'username' => 'testadmin',
            'password' => '1234'
        ]);

        $response->assertJson([
            'user' => [
                'role' => 'admin',
                'division_id' => null
            ]
        ]);
    }

    /**
     * Test division responsable login returns correct role and division_id
     */
    public function test_division_login_returns_correct_role_and_division_id(): void
    {
        $division = Division::create([
            'division_nom' => 'Test Division',
            'division_responsable' => 'testuser',
            'password' => '1234'
        ]);

        $response = $this->postJson('/api/login', [
            'username' => 'testuser',
            'password' => '1234'
        ]);

        $response->assertJson([
            'user' => [
                'role' => 'division_responsable',
                'division_id' => $division->division_id
            ]
        ]);
    }
} 