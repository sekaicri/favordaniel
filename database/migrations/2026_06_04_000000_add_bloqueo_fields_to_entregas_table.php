<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('entregas', function (Blueprint $table) {
            $table->string('motivo_bloqueo')->nullable();
            $table->integer('intentos_fallidos')->default(0);
        });
    }

    public function down()
    {
        Schema::table('entregas', function (Blueprint $table) {
            $table->dropColumn(['motivo_bloqueo', 'intentos_fallidos']);
        });
    }
};
