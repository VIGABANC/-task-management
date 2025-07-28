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
        Schema::create('division', function (Blueprint $table) {
            $table->increments('division_id');
            $table->string('division_nom');
            $table->string('division_responsable');
            $table->string('password');
            $table->timestamps(); // Add timestamps for proper updates
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('division');
    }
};
