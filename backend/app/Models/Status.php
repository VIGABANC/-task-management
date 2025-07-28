<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Status extends Model
{
    use HasFactory;
    public $timestamps = false;

    protected $table = 'status';
    protected $primaryKey = 'state_id';

    protected $fillable = [
        'statut',
        'date_changed',
        'task_id',
    ];

    public function task()
    {
        return $this->belongsTo(Task::class, 'task_id', 'task_id');
    }
}
