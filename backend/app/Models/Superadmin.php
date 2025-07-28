<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Superadmin extends Model
{
    // Enable timestamps since the migration includes them
    public $timestamps = true;
    
    protected $table = 'superadmins'; // This matches the migration
    protected $primaryKey = 'superadmin_id';
    
    protected $fillable = [
        'username',
        'password',
        'role'
    ];
}
