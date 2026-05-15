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
     * Switchboard: redirige al dashboard correcto según el rol.
     * Para agregar un nuevo rol, solo añade un caso al match.
     */
    public function dashboardSwitchboard()
    {
        $role = Auth::user()->role;
        return match($role) {
            'admin' => redirect()->route('admin.usuarios'),
            'repartidor' => redirect()->route('repartidor.deliveries'),
            default => redirect()->route('access.denied'),
        };
    }
}
