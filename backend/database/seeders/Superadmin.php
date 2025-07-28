<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class Superadmin extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
          $superadmins = [
            ['username' => 'gouverneur','role'=>'governeur', 'password' => '1234'],
            ['username' => 'secretaire_general','role'=>'secretaire_general', 'password' => '1234']
        ];
        foreach ($superadmins as $superadmin) {
            \App\Models\Superadmin::create($superadmin);
        }
    }
}
