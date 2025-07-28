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
        Schema::create('historique', function (Blueprint $table) {
            $table->increments('hist_id');
            $table->string('description');
            $table->dateTime('change_date');
            $table->string('dochistorique_path');
            $table->integer('task_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historique');
    }
};
