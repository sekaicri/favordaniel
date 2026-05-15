<?php

use App\Http\Controllers\AppController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EntregaController;
use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;

// ─── Rutas Públicas ─────────────────────────────────────────────
Route::get('/', [AppController::class, 'home']);
Route::get('/acceso-denegado', [AppController::class, 'accessDenied'])->name('access.denied');

// ─── Switchboard Post-Login ─────────────────────────────────────
Route::get('/dashboard', [AppController::class, 'dashboardSwitchboard'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// ─── Rutas Admin (role:admin) ───────────────────────────────────
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/usuarios', [AdminController::class, 'usersIndex'])->name('admin.usuarios');
    Route::get('/usuarios/crear', [AdminController::class, 'usersCreate'])->name('admin.usuarios.create');
    Route::post('/usuarios', [AdminController::class, 'usersStore'])->name('admin.usuarios.store');
    Route::get('/usuarios/{user}/editar', [AdminController::class, 'usersEdit'])->name('admin.usuarios.edit');
    Route::put('/usuarios/{user}', [AdminController::class, 'usersUpdate'])->name('admin.usuarios.update');
});

// ─── Rutas Repartidor (role:repartidor) ─────────────────────────
Route::middleware(['auth', 'role:repartidor'])->group(function () {
    Route::get('/deliveries', [EntregaController::class, 'index'])->name('repartidor.deliveries');
    Route::post('/evidencia/upload', [EntregaController::class, 'uploadEvidence'])->name('evidencia.upload');
});

// ─── Rutas Compartidas (auth) ───────────────────────────────────
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
