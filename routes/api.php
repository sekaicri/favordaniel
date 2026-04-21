<?php

use App\Http\Controllers\EntregaController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::post('/evidencia/upload', [EntregaController::class, 'uploadEvidence']);
