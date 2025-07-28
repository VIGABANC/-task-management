<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    // Specify the table and primary key
    protected $table = 'task';
    protected $primaryKey = 'task_id';
    public $timestamps = false;

    // Allow mass assignment on these fields
    protected $fillable = [
        'task_name',
        'description',
        'due_date',
        'fin_date',
        'division_id',
    ];

    // A Task belongs to a Division
    public function division()
    {
        return $this->belongsTo(Division::class, 'division_id', 'division_id');
    }

    // A Task may have many statuses
    public function statuses()
    {
        return $this->hasMany(Status::class, 'task_id', 'task_id');
    }

    // A Task may have many historiques
    public function historiques()
    {
        return $this->hasMany(Historique::class, 'task_id', 'task_id');
    }

    // A Task may have many documentpaths
    public function documentpaths()
    {
        return $this->hasMany(Documentpath::class, 'task_id', 'task_id');
    }
}
