<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Division extends Model
{
    use HasFactory;
    
    // Enable timestamps since we added them to the migration
    public $timestamps = true;

    protected $table = 'division'; // Match the actual table name from migration
    protected $primaryKey = 'division_id';

    protected $fillable = [
        'division_nom',
        'division_responsable',
        'password',
    ];

    public function tasks()
    {
        return $this->hasMany(Task::class, 'division_id', 'division_id');
    }
    
}
