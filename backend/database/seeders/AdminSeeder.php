<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Insert at least 5 specific admins for testing
        $admins = [
            ['username' => 'secretaire_sg', 'password' => '1234','role'=>'secretaire_sg','superadmin_id'=>1],
            ['username' => 'secretaire_ssg', 'password' => '1234','role'=>'secretaire_ssg','superadmin_id'=>2],
        ];
        foreach ($admins as $admin) {
            \App\Models\Admin::create($admin);
        }
    }
}
