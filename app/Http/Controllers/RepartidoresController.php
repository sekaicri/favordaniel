<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Entrega;
use Illuminate\Support\Facades\Auth;

class RepartidoresController extends Controller
{
    /**
     * Listado de todos los repartidores con sus estadísticas generales.
     */
    public function index(Request $request)
    {
        $query = User::where('role', 'repartidor');

        // Filtrar por búsqueda de texto (nombre, correo o teléfono)
        if ($request->has('search') && $request->search != '') {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('telefono', 'like', '%' . $request->search . '%');
            });
        }

        // Obtener repartidores con conteo de entregas por estados
        $repartidores = $query->withCount([
            'entregas as total_asignadas',
            'entregas as entregadas' => function ($q) {
                $q->where('estado', 'entregado');
            },
            'entregas as por_entregar' => function ($q) {
                $q->where('estado', 'en_ruta');
            },
            'entregas as pendientes' => function ($q) {
                $q->where('estado', 'pendiente');
            }
        ])->orderBy('name', 'asc')->paginate(15);

        return Inertia::render('Admin/Repartidores/Index', [
            'repartidores' => $repartidores,
            'filters' => $request->only(['search'])
        ]);
    }

    /**
     * Vista de detalle de un repartidor específico con entregas y ganancias.
     */
    public function show(User $repartidor)
    {
        if ($repartidor->role !== 'repartidor') {
            abort(404, 'El usuario no es un repartidor.');
        }

        // Obtener entregas
        $entregasQuery = Entrega::where('user_id', $repartidor->id);

        $totalAsignadas = (clone $entregasQuery)->count();
        $entregadas = (clone $entregasQuery)->where('estado', 'entregado')->count();
        $porEntregar = (clone $entregasQuery)->where('estado', 'en_ruta')->count();
        // Si no hay ninguna "en_ruta", podemos considerar las "pendiente" como pendientes de entrega
        $pendientes = (clone $entregasQuery)->where('estado', 'pendiente')->count();

        // Si por alguna razón la suma no cuadra o queremos asegurar el flujo:
        // Por entregar: en_ruta (o activo)
        // Pendientes: pendiente (o programado)
        
        $porEntregarList = (clone $entregasQuery)
            ->where('estado', '!=', 'entregado')
            ->orderBy('created_at', 'desc')
            ->get();

        $entregadosList = (clone $entregasQuery)
            ->where('estado', 'entregado')
            ->orderBy('updated_at', 'desc')
            ->get();

        // Tasa estimada de pago por entrega (Placeholder para el tarifario futuro)
        $valorPorEntrega = 5000; // Valor default de ejemplo (COP)
        $gananciasEstimadas = $entregadas * $valorPorEntrega;

        return Inertia::render('Admin/Repartidores/Show', [
            'repartidor' => [
                'id' => $repartidor->id,
                'name' => $repartidor->name,
                'email' => $repartidor->email,
                'telefono' => $repartidor->telefono,
                'estado' => $repartidor->estado,
                'ultimo_acceso' => $repartidor->ultimo_acceso ? $repartidor->ultimo_acceso->format('d/M/Y - h:i a') : 'Nunca',
            ],
            'stats' => [
                'total_asignadas' => $totalAsignadas,
                'entregadas' => $entregadas,
                'por_entregar' => $porEntregar,
                'pendientes' => $pendientes,
                'avance_general' => $totalAsignadas > 0 ? round(($entregadas / $totalAsignadas) * 100) : 0,
            ],
            'entregas' => [
                'por_entregar' => $porEntregarList,
                'entregados' => $entregadosList,
            ],
            'ganancias' => [
                'estimadas' => $gananciasEstimadas,
                'valor_por_entrega' => $valorPorEntrega,
                'entregadas_validas' => $entregadas
            ]
        ]);
    }
}
