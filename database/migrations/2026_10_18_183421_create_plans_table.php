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
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->decimal('precio', 10, 2);
            $table->string('nombre'); // Para poder implementar el softDelete
            $table->text('descripcion')->nullable();
            $table->integer('duracion')->default(30);
            $table->boolean('incluye_entrenador')->default(false); // Determina si el cliente tiene acceso a un entrenador o no...
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
