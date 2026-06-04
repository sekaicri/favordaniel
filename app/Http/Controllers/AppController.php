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
        $user = Auth::user();
        $metrics = [];

        if ($user && $user->role === 'repartidor') {
            $currentMonth = \Carbon\Carbon::now()->month;
            $currentYear = \Carbon\Carbon::now()->year;
            
            $entregasMes = \App\Models\Entrega::where('user_id', $user->id)
                ->whereMonth('created_at', $currentMonth)
                ->whereYear('created_at', $currentYear)
                ->count();
                
            $metrics = [
                'entregas_mes' => $entregasMes,
                'ganancias_estimadas' => 0, // Por ahora placeholder
                'novedades' => 0, // Por ahora placeholder
            ];
        }

        return Inertia::render('Dashboard', [
            'metrics' => $metrics
        ]);
    }
}
