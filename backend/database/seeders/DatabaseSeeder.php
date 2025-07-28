<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed 10 random users
        \App\Models\User::factory(10)->create();

        // Ensure a specific test user exists
        \App\Models\User::firstOrCreate([
            'email' => 'test@example.com',
        ], [
            'name' => 'Test User',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
            'remember_token' => \Illuminate\Support\Str::random(10),
        ]);

        // Call other model seeders
        $this->call([
            Superadmin::class,
            AdminSeeder::class,
            DivisionSeeder::class,
            TaskSeeder::class,
            HistoriqueSeeder::class,
            StatusSeeder::class,
            DocumentpathSeeder::class,
            RendezvousSeeder::class,
        ]);
    }
}
