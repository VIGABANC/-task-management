<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Documentpath extends Model
{
    use HasFactory;
    public $timestamps = false;

    protected $table = 'documentpath';
    protected $primaryKey = 'document_id';

    protected $fillable = [
        'document_path',
        'task_id',
        'hist_id',
    ];

    public function task()
    {
        return $this->belongsTo(Task::class, 'task_id', 'task_id');
    }

    public function historique()
    {
        return $this->belongsTo(Historique::class, 'hist_id', 'hist_id');
    }
}
