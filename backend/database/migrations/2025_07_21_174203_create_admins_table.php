<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('admin', function (Blueprint $table) {
            $table->id('admin_id');
            $table->string('username');
            $table->string('password');
           $table->enum('role', ['secretaire_sg', 'secretaire_ssg']);
           $table->unsignedBigInteger('superadmin_id'); 
            $table->foreign('superadmin_id')->references('superadmin_id')->on('superadmins')->onDelete('cascade');
            $table->timestamps(); // Add timestamps for proper updates
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin');
    }
};
