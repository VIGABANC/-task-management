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
        Schema::create('documentpath', function (Blueprint $table) {
            $table->increments('document_id');
            $table->string('document_path');
            $table->integer('task_id')->unsigned()->nullable();
            $table->integer('hist_id')->unsigned()->nullable();
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documentpath');
    }
};
