<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('entregas', function (Blueprint $table) {
            $table->id();
            $table->string('tracking_id')->unique();
            $table->foreignId('user_id')->constrained();
            $table->string('estado')->default('pendiente');
            $table->json('url_evidencia')->nullable();
            $table->timestamps();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('user'); // 'user' or 'admin'
        });
    }

    public function down()
    {
        Schema::dropIfExists('entregas');
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }
};
