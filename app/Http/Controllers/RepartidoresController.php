<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Entrega;

class RepartidoresController extends Controller
{
    /** List all drivers with delivery stats. */
    public function index(Request $request)
    {
        $query = User::where('role', 'repartidor');

        if ($request->has('search') && $request->search != '') {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('telefono', 'like', '%' . $request->search . '%');
            });
        }

        $repartidores = $query->withCount([
            'entregas as total_asignadas',
            'entregas as entregadas' => fn ($q) => $q->where('estado', 'entregado'),
            'entregas as por_entregar' => fn ($q) => $q->where('estado', 'en_ruta'),
            'entregas as pendientes' => fn ($q) => $q->where('estado', 'pendiente'),
        ])->orderBy('name', 'asc')->paginate(15);

        return Inertia::render('Admin/Repartidores/Index', [
            'repartidores' => $repartidores,
            'filters' => $request->only(['search'])
        ]);
    }

    /** Driver detail with deliveries and real earnings from DB. */
    public function show(User $repartidor)
    {
        if ($repartidor->role !== 'repartidor') {
            abort(404, 'El usuario no es un repartidor.');
        }

        $entregasQuery = Entrega::where('user_id', $repartidor->id);

        $totalAsignadas = (clone $entregasQuery)->count();
        $entregadas = (clone $entregasQuery)->where('estado', 'entregado')->count();
        $porEntregar = (clone $entregasQuery)->where('estado', 'en_ruta')->count();
        $pendientes = (clone $entregasQuery)->where('estado', 'pendiente')->count();

        $porEntregarList = (clone $entregasQuery)
            ->where('estado', '!=', 'entregado')
            ->orderBy('created_at', 'desc')
            ->get();

        $entregadosList = (clone $entregasQuery)
            ->where('estado', 'entregado')
            ->orderBy('updated_at', 'desc')
            ->get();

        // Use real earnings from DB (sum of ganancia column)
        $gananciasReales = (clone $entregasQuery)
            ->where('estado', 'entregado')
            ->sum('ganancia');

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
                'total' => $gananciasReales,
                'entregadas_validas' => $entregadas,
            ]
        ]);
    }
}
