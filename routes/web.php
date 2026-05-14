<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EntregaController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [EntregaController::class, 'home']);

Route::get('/acceso-denegado', [EntregaController::class, 'accessDenied'])->name('access.denied');

// Switchboard de redirección principal después del login
Route::get('/dashboard', [EntregaController::class, 'dashboardSwitchboard'])->middleware(['auth', 'verified'])->name('dashboard');

// Rutas exclusivas para repartidores
Route::middleware(['auth', 'verified', 'role:repartidor'])->group(function () {
    Route::get('/deliveries', [EntregaController::class, 'index'])->name('repartidor.deliveries');
    Route::post('/evidencia/upload', [EntregaController::class, 'uploadEvidence'])->name('evidencia.upload');
});

// Rutas exclusivas para administradores
Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('/admin/usuarios', [\App\Http\Controllers\AdminController::class, 'usersIndex'])->name('admin.usuarios');
});
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
