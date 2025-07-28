<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DivisionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Insert only the specific divisions for testing
        $divisions = [
            ['division_id' => 1,  'division_nom' => 'Division des Affaires Intérieures',           'division_responsable' => 'res1',     'password' => '1234'],
            ['division_id' => 2,  'division_nom' => 'Division des Collectivités Territoriales',     'division_responsable' => 'res2', 'password' => '1234'],
            ['division_id' => 3,  'division_nom' => 'Division des Ressources Humaines et des Moyens Généraux','division_responsable' => 'res3','password' => '1234'],
            ['division_id' => 4,  'division_nom' => 'Division des Affaires Sociales',               'division_responsable' => 'res4',     'password' => '1234'],
            ['division_id' => 5,  'division_nom' => 'Division des Budgets et des Marchés',          'division_responsable' => 'res5',     'password' => '1234'],
            ['division_id' => 6,  'division_nom' => 'Division des Équipements et des Techniques',   'division_responsable' => 'res6',     'password' => '1234'],
            ['division_id' => 7,  'division_nom' => 'Division d’Urbanisme et d’Environnement',      'division_responsable' => 'res7',     'password' => '1234'],
            ['division_id' => 8,  'division_nom' => 'Division des Affaires Rurales',                'division_responsable' => 'res8', 'password' => '1234'],
            ['division_id' => 9, 'division_nom' => 'Division des Affaires Économiques',            'division_responsable' => 'res9',     'password' => '1234'],
        ];
        foreach ($divisions as $division) {
            \App\Models\Division::create($division);
        }
    }
}
