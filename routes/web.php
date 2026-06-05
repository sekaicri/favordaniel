<?php

use App\Http\Controllers\AppController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EntregaController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\RepartidoresController;
use Illuminate\Support\Facades\Route;

// ─── Rutas Públicas ─────────────────────────────────────────────
Route::get('/', [AppController::class, 'home']);
Route::get('/acceso-denegado', [AppController::class, 'accessDenied'])->name('access.denied');

// ─── Switchboard Post-Login ─────────────────────────────────────
Route::get('/dashboard', [AppController::class, 'dashboardSwitchboard'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// ─── Rutas Admin (Protegidas por módulo) ───────────────────────────
Route::prefix('admin')->middleware(['auth'])->group(function () {
    
    // Módulo de Usuarios (Solo Soporte y Director)
    Route::middleware(['role:soporte'])->group(function () {
        Route::get('/usuarios', [AdminController::class, 'usersIndex'])->name('admin.usuarios');
        Route::get('/usuarios/crear', [AdminController::class, 'usersCreate'])->name('admin.usuarios.create');
        Route::post('/usuarios', [AdminController::class, 'usersStore'])->name('admin.usuarios.store');
        Route::get('/usuarios/{user}/editar', [AdminController::class, 'usersEdit'])->name('admin.usuarios.edit');
        Route::put('/usuarios/{user}', [AdminController::class, 'usersUpdate'])->name('admin.usuarios.update');
        Route::delete('/usuarios/{user}', [AdminController::class, 'usersDestroy'])->name('admin.usuarios.destroy');
    });

    // Módulo de Entregas (Admin, Facturador, Experiencia, Director)
    Route::middleware(['role:admin,facturador,experiencia'])->group(function () {
        Route::get('/admin/entregas', [AdminController::class, 'deliveriesIndex'])->name('admin.entregas');
        Route::get('/admin/entregas/{entrega}', [AdminController::class, 'showDelivery'])->name('admin.entregas.show');
        Route::post('/entregas/sync', [AdminController::class, 'syncSheets'])->name('admin.entregas.sync');
        Route::post('/entregas/{entrega}/assign', [AdminController::class, 'assignDelivery'])->name('admin.entregas.assign');
        Route::post('/entregas/{entrega}/unassign', [AdminController::class, 'unassignDelivery'])->name('admin.entregas.unassign');

        // Motor de Reglas de Ganancia
        Route::get('/admin/reglas-ganancia', [AdminController::class, 'reglasIndex'])->name('admin.reglas');
        Route::post('/admin/reglas-ganancia', [AdminController::class, 'storeRegla'])->name('admin.reglas.store');
        Route::put('/admin/reglas-ganancia/{regla}', [AdminController::class, 'updateRegla'])->name('admin.reglas.update');
        Route::delete('/admin/reglas-ganancia/{regla}', [AdminController::class, 'destroyRegla'])->name('admin.reglas.destroy');
    });

    // Módulo de Repartidores (Admin, Director, Soporte, Experiencia)
    Route::middleware(['role:admin,director,soporte,experiencia'])->group(function () {
        Route::get('/repartidores', [RepartidoresController::class, 'index'])->name('admin.repartidores');
        Route::get('/repartidores/{repartidor}', [RepartidoresController::class, 'show'])->name('admin.repartidores.show');
    });
});

// ─── Rutas Repartidor (role:repartidor) ─────────────────────────
Route::middleware(['auth', 'role:repartidor'])->group(function () {
    Route::get('/entregas/asignar', [EntregaController::class, 'assignView'])->name('repartidor.assign');
    Route::post('/entregas/asignar', [EntregaController::class, 'assignDelivery'])->name('repartidor.assign.post');
    Route::get('/entregas/{entrega}/detalle', [EntregaController::class, 'detailView'])->name('repartidor.delivery.detail');
    Route::post('/entregas/{entrega}/entregar', [EntregaController::class, 'attemptDelivery'])->name('repartidor.delivery.attempt');
    Route::post('/entregas/{entrega}/bloquear', [EntregaController::class, 'blockDelivery'])->name('repartidor.delivery.block');
    Route::get('/entregas/{entrega}/evidencia', [EntregaController::class, 'evidenceView'])->name('repartidor.delivery.evidence');
    Route::get('/entregas/{entrega}/completada', [EntregaController::class, 'completedDetailView'])->name('repartidor.delivery.completed');
    Route::post('/entregas/{entrega}/evidencia', [EntregaController::class, 'uploadEvidence'])->name('repartidor.delivery.evidence.upload');
    Route::get('/entregas/{entrega}/evidencia', [EntregaController::class, 'evidenceView'])->name('repartidor.evidence.view');
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
