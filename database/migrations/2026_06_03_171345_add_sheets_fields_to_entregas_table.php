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
        Schema::table('entregas', function (Blueprint $table) {
            $table->string('canal_compra')->nullable()->after('cliente');
            $table->string('documento')->nullable()->after('canal_compra');
            $table->string('direccion')->nullable()->after('documento');
            $table->string('celular')->nullable()->after('direccion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('entregas', function (Blueprint $table) {
            $table->dropColumn(['canal_compra', 'documento', 'direccion', 'celular']);
        });
    }
};
