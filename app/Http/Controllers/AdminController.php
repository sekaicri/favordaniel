<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Entrega;
use App\Models\ReglaGanancia;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Services\GoogleSheetsSyncService;
use App\Services\EntregaService;

class AdminController extends Controller
{
    public function __construct(
        protected EntregaService $entregaService
    ) {}

    /** Users management index. */
    public function usersIndex(Request $request)
    {
        $query = User::query();

        if ($request->has('search') && $request->search != '') {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('telefono', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->has('role') && $request->role != '') {
            $query->where('role', $request->role);
        }

        if ($request->has('estado') && $request->estado != '') {
            $query->where('estado', $request->estado === 'activo');
        }

        $usuarios = $query->orderBy('name', 'asc')->paginate(20);

        return Inertia::render('Admin/Index', [
            'usuarios' => $usuarios,
            'filters' => $request->only(['search', 'role', 'estado'])
        ]);
    }

    /** Create user form. */
    public function usersCreate()
    {
        return Inertia::render('Admin/UserForm', [
            'user' => null,
            'roles' => $this->getAvailableRoles(),
        ]);
    }

    /** Store new user. */
    public function usersStore(StoreUserRequest $request)
    {
        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password ?? \Illuminate\Support\Str::random(16)),
            'role' => $request->role,
            'telefono' => $request->telefono,
            'estado' => $request->estado,
            'permisos' => $request->permisos,
        ]);

        return redirect()->route('admin.usuarios')->with('status', '¡Usuario creado exitosamente!');
    }

    /** Edit user form. */
    public function usersEdit(User $user)
    {
        return Inertia::render('Admin/UserForm', [
            'user' => $user->only(['id', 'name', 'email', 'role', 'telefono', 'estado', 'ultimo_acceso', 'permisos']),
            'roles' => $this->getAvailableRoles(),
        ]);
    }

    /** Update existing user. */
    public function usersUpdate(UpdateUserRequest $request, User $user)
    {
        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'telefono' => $request->telefono,
            'estado' => $request->estado,
            'permisos' => $request->permisos,
        ];

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return redirect()->route('admin.usuarios')->with('status', '¡Usuario actualizado exitosamente!');
    }

    /** Delete user (prevents self-deletion). */
    public function usersDestroy(User $user)
    {
        if (Auth::id() === $user->id) {
            return redirect()->route('admin.usuarios')->with('status', 'No puedes eliminar tu propia cuenta.');
        }

        $user->delete();

        return redirect()->route('admin.usuarios')->with('status', '¡Usuario eliminado exitosamente!');
    }

    /** Deliveries dashboard — loads active rules once to avoid N+1. */
    public function deliveriesIndex(Request $request)
    {
        $query = Entrega::with('user');

        if ($request->has('search') && $request->search != '') {
            $query->where(function($q) use ($request) {
                $q->where('tracking_id', 'like', '%' . $request->search . '%')
                  ->orWhere('cliente', 'like', '%' . $request->search . '%')
                  ->orWhereHas('user', function($qu) use ($request) {
                      $qu->where('name', 'like', '%' . $request->search . '%');
                  });
            });
        }

        if ($request->has('fecha') && $request->fecha != '') {
            $query->whereDate('created_at', $request->fecha);
        }

        if ($request->has('estado') && $request->estado != '') {
            if ($request->estado === 'por_asignar') {
                $query->whereNull('user_id');
            } elseif ($request->estado === 'por_entregar') {
                $query->whereNotNull('user_id')->where('estado', '!=', 'entregado');
            } elseif ($request->estado === 'entregados') {
                $query->where('estado', 'entregado');
            }
        }

        if ($request->has('canal_compra') && $request->canal_compra != '') {
            $query->where('canal_compra', 'LIKE', '%' . $request->canal_compra . '%');
        }

        $entregas = $query->orderBy('created_at', 'desc')->paginate(50);

        // Evaluate time condition in-memory (single query for all active rules)
        $currentTime = \Carbon\Carbon::now()->format('H:i:s');
        $reglasActivas = ReglaGanancia::where('activa', true)
            ->where('hora_inicio', '<=', $currentTime)
            ->where('hora_fin', '>=', $currentTime)
            ->get();

        foreach ($entregas->items() as $entrega) {
            if ($entrega->estado !== 'entregado') {
                $regla = $reglasActivas->firstWhere('user_id', $entrega->user_id);
                if (!$regla) {
                    $regla = $reglasActivas->whereNull('user_id')->first();
                }
                $entrega->condicion_actual = $regla ? $regla->tipo : 'fuera_rango';
            }
        }

        $repartidores = User::where('role', 'repartidor')->get(['id', 'name']);

        return Inertia::render('Admin/Deliveries', [
            'entregas' => $entregas,
            'repartidores' => $repartidores,
            'filters' => $request->only(['search', 'fecha', 'estado', 'canal_compra'])
        ]);
    }

    /** Delivery detail view. */
    public function showDelivery(Entrega $entrega)
    {
        $entrega->load('user');

        return Inertia::render('Admin/DeliveryDetail', [
            'entrega' => $entrega
        ]);
    }

    /** Assign a driver to a delivery. */
    public function assignDelivery(Request $request, Entrega $entrega)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $this->entregaService->asignarRepartidor($entrega, $request->user_id);

        return redirect()->back()->with('status', 'Repartidor asignado correctamente.');
    }

    /** Unassign a driver from a delivery. */
    public function unassignDelivery(Entrega $entrega)
    {
        $this->entregaService->desasignarRepartidor($entrega);

        return redirect()->back()->with('status', 'Repartidor desasignado correctamente.');
    }

    private function getAvailableRoles(): array
    {
        return [
            ['value' => 'director', 'label' => 'Director'],
            ['value' => 'admin', 'label' => 'Administrador'],
            ['value' => 'facturador', 'label' => 'Facturador'],
            ['value' => 'inventario', 'label' => 'Inventario'],
            ['value' => 'repartidor', 'label' => 'Repartidor'],
            ['value' => 'soporte', 'label' => 'Soporte'],
            ['value' => 'experiencia', 'label' => 'Experiencia'],
        ];
    }

    /** Sync deliveries from Google Sheets. */
    public function syncSheets(GoogleSheetsSyncService $syncService)
    {
        $result = $syncService->syncDailyDeliveries();

        if ($result['success']) {
            return redirect()->back()->with('status', $result['message']);
        } else {
            return redirect()->back()->withErrors(['error' => $result['message']]);
        }
    }

    /** Earning rules index. */
    public function reglasIndex()
    {
        $reglas = ReglaGanancia::with('user')->orderBy('hora_inicio')->get();
        $repartidores = User::where('role', 'repartidor')->get(['id', 'name']);

        return Inertia::render('Admin/ReglasGanancia', [
            'reglas' => $reglas,
            'repartidores' => $repartidores
        ]);
    }

    /** Store earning rule. */
    public function storeRegla(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'hora_inicio' => 'required|date_format:H:i',
            'hora_fin' => 'required|date_format:H:i|after:hora_inicio',
            'monto' => 'required|numeric|min:0',
            'tipo' => 'required|in:a_tiempo,retraso',
        ]);

        ReglaGanancia::create($data);

        return redirect()->back()->with('status', 'Regla de ganancia creada exitosamente.');
    }

    /** Update earning rule. */
    public function updateRegla(Request $request, ReglaGanancia $regla)
    {
        $data = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'hora_inicio' => 'required|date_format:H:i',
            'hora_fin' => 'required|date_format:H:i|after:hora_inicio',
            'monto' => 'required|numeric|min:0',
            'tipo' => 'required|in:a_tiempo,retraso',
            'activa' => 'boolean'
        ]);

        $regla->update($data);

        return redirect()->back()->with('status', 'Regla actualizada correctamente.');
    }

    /** Delete earning rule. */
    public function destroyRegla(ReglaGanancia $regla)
    {
        $regla->delete();
        return redirect()->back()->with('status', 'Regla eliminada.');
    }
}
