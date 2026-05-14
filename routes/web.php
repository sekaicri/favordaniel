<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EntregaController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/acceso-denegado', function () {
    return Inertia::render('Auth/AccessDenied');
})->name('access.denied');

// Switchboard de redirección principal después del login
Route::get('/dashboard', function () {
    $role = \Illuminate\Support\Facades\Auth::user()->role;
    return match($role) {
        'admin' => redirect()->route('admin.usuarios'),
        'repartidor' => redirect()->route('repartidor.entregas'),
        default => redirect()->route('access.denied'),
    };
})->middleware(['auth', 'verified'])->name('dashboard');

// Rutas exclusivas para repartidores
Route::middleware(['auth', 'verified', 'role:repartidor'])->group(function () {
    Route::get('/mis-entregas', [EntregaController::class, 'index'])->name('repartidor.entregas');
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
