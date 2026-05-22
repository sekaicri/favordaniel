<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/**
 * Controlador para rutas generales del sistema:
 * redirección raíz, acceso denegado y switchboard post-login.
 */
class AppController extends Controller
{
    /**
     * Redirige la raíz al login.
     */
    public function home()
    {
        return redirect()->route('login');
    }

    /**
     * Vista de acceso denegado.
     */
    public function accessDenied()
    {
        return Inertia::render('Auth/AccessDenied');
    }

    /**
     * Dashboard: landing page provisional para todos los usuarios.
     */
    public function dashboardSwitchboard()
    {
        return Inertia::render('Dashboard');
    }
}
