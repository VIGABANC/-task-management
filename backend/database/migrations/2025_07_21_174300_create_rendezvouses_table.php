<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('rendezvouses', function (Blueprint $table) {
            $table->id('id_rendezvous');
            $table->date('date');
            $table->time('time');
            $table->string('person', 255);
            $table->string('subject', 255)->nullable();
            $table->text('notes')->nullable();
            
            // Foreign Keys
            $table->unsignedBigInteger('admin_id');       // Admin who gave the rendezvous
            $table->unsignedBigInteger('superadmin_id');  // Superadmin who receives it

            $table->foreign('admin_id')->references('admin_id')->on('admin')->onDelete('cascade');
            $table->foreign('superadmin_id')->references('superadmin_id')->on('superadmins')->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('rendezvouses');
    }
};
