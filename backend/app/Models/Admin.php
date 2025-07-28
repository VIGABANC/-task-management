<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    use HasFactory;
    
    // Enable timestamps since we added them to the migration
    public $timestamps = true;

    protected $table = 'admin'; // Match the actual table name from migration
    protected $primaryKey = 'admin_id';

    protected $fillable = [
        'username',
        'password',
        'role',
        'superadmin_id'
    ];
}
