<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Entrega;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Services\GoogleSheetsSyncService;

class AdminController extends Controller
{
    /**
     * Web: Panel Admin (Gestión de usuarios).
     */
    public function usersIndex(Request $request)
    {
        $query = User::query();

        // Filtrar por búsqueda de texto
        if ($request->has('search') && $request->search != '') {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('telefono', 'like', '%' . $request->search . '%');
            });
        }

        // Filtrar por rol
        if ($request->has('role') && $request->role != '') {
            $query->where('role', $request->role);
        }

        // Filtrar por estado
        if ($request->has('estado') && $request->estado != '') {
            $query->where('estado', $request->estado === 'activo');
        }

        $usuarios = $query->orderBy('name', 'asc')->paginate(20);

        return Inertia::render('Admin/Index', [
            'usuarios' => $usuarios,
            'filters' => $request->only(['search', 'role', 'estado'])
        ]);
    }

    /**
     * Web: Formulario para crear nuevo usuario.
     */
    public function usersCreate()
    {
        return Inertia::render('Admin/UserForm', [
            'user' => null,
            'roles' => $this->getAvailableRoles(),
        ]);
    }

    /**
     * API: Guardar nuevo usuario.
     */
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

    /**
     * Web: Formulario para editar usuario existente.
     */
    public function usersEdit(User $user)
    {
        return Inertia::render('Admin/UserForm', [
            'user' => $user->only(['id', 'name', 'email', 'role', 'telefono', 'estado', 'ultimo_acceso', 'permisos']),
            'roles' => $this->getAvailableRoles(),
        ]);
    }

    /**
     * API: Actualizar usuario existente.
     */
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

    /**
     * API: Eliminar usuario existente.
     */
    public function usersDestroy(User $user)
    {
        // Evitar que el administrador se elimine a sí mismo
        if (Auth::id() === $user->id) {
            return redirect()->route('admin.usuarios')->with('status', 'No puedes eliminar tu propia cuenta.');
        }

        $user->delete();

        return redirect()->route('admin.usuarios')->with('status', '¡Usuario eliminado exitosamente!');
    }

    /**
     * Web: Panel Admin (Gestión de entregas de todos los repartidores).
     */
    public function deliveriesIndex(Request $request)
    {
        $query = Entrega::with('user');

        // Filtrar por búsqueda (Tracking ID o Nombre del repartidor o cliente)
        if ($request->has('search') && $request->search != '') {
            $query->where(function($q) use ($request) {
                $q->where('tracking_id', 'like', '%' . $request->search . '%')
                  ->orWhere('cliente', 'like', '%' . $request->search . '%')
                  ->orWhereHas('user', function($qu) use ($request) {
                      $qu->where('name', 'like', '%' . $request->search . '%');
                  });
            });
        }

        // Filtrar por fecha
        if ($request->has('fecha') && $request->fecha != '') {
            $query->whereDate('created_at', $request->fecha);
        }

        // Filtrar por estado
        if ($request->has('estado') && $request->estado != '') {
            if ($request->estado === 'por_asignar') {
                $query->whereNull('user_id');
            } elseif ($request->estado === 'por_entregar') {
                $query->whereNotNull('user_id')->where('estado', '!=', 'entregado');
            } elseif ($request->estado === 'entregados') {
                $query->where('estado', 'entregado');
            }
        }

        // Filtrar por canal de compra
        if ($request->has('canal_compra') && $request->canal_compra != '') {
            $query->where('canal_compra', 'LIKE', '%' . $request->canal_compra . '%');
        }

        $entregas = $query->orderBy('created_at', 'desc')->paginate(50); // Increased pagination for better dashboard view

        // Calcular condición de tiempo actual para las pendientes
        $currentTime = \Carbon\Carbon::now()->format('H:i:s');
        foreach ($entregas->items() as $entrega) {
            if ($entrega->estado !== 'entregado') {
                $regla = \App\Models\ReglaGanancia::where('activa', true)
                    ->where('user_id', $entrega->user_id)
                    ->where('hora_inicio', '<=', $currentTime)
                    ->where('hora_fin', '>=', $currentTime)
                    ->first();
                
                if (!$regla) {
                    $regla = \App\Models\ReglaGanancia::where('activa', true)
                        ->whereNull('user_id')
                        ->where('hora_inicio', '<=', $currentTime)
                        ->where('hora_fin', '>=', $currentTime)
                        ->first();
                }

                $entrega->condicion_actual = $regla ? $regla->tipo : 'fuera_rango';
            }
        }

        // El redireccionamiento automático se ha eliminado para que la vista principal (Admin/Deliveries)
        // se encargue de renderizar el detalle si solo hay un resultado.

        $repartidores = User::where('role', 'repartidor')->get(['id', 'name']);

        return Inertia::render('Admin/Deliveries', [
            'entregas' => $entregas,
            'repartidores' => $repartidores,
            'filters' => $request->only(['search', 'fecha', 'estado', 'canal_compra'])
        ]);
    }

    /**
     * Web: Vista de detalle de una entrega para el Administrador.
     */
    public function showDelivery(Entrega $entrega)
    {
        // Cargar la relación del repartidor
        $entrega->load('user');
        
        return Inertia::render('Admin/DeliveryDetail', [
            'entrega' => $entrega
        ]);
    }

    /**
     * API: Asignar repartidor a una entrega.
     */
    public function assignDelivery(Request $request, Entrega $entrega)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $entrega->update([
            'user_id' => $request->user_id,
            'estado' => 'pendiente', // O el estado que represente "Por entregar"
        ]);

        // Disparar mensaje de WhatsApp de asignación
        $msg = "Hola Celulover, vamos en camino a llevarte tu pedido.\nNo olvides tu palabra clave!";
        app(\App\Services\WhatsAppService::class)->send($entrega->celular, $msg);

        return redirect()->back()->with('status', 'Repartidor asignado correctamente.');
    }

    /**
     * API: Desasignar repartidor de una entrega.
     */
    public function unassignDelivery(Entrega $entrega)
    {
        $entrega->update([
            'user_id' => null,
            'estado' => 'pendiente',
        ]);

        return redirect()->back()->with('status', 'Repartidor desasignado correctamente.');
    }

    /**
     * Retorna los roles disponibles del sistema.
     */
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

    /**
     * API: Sincronizar entregas manualmente desde Google Sheets
     */
    public function syncSheets(GoogleSheetsSyncService $syncService)
    {
        $result = $syncService->syncDailyDeliveries();
        
        if ($result['success']) {
            return redirect()->back()->with('status', $result['message']);
        } else {
            return redirect()->back()->withErrors(['error' => $result['message']]);
        }
    }
    // ==========================================
    // MOTOR DE REGLAS DE GANANCIA
    // ==========================================

    public function reglasIndex()
    {
        $reglas = \App\Models\ReglaGanancia::with('user')->orderBy('hora_inicio')->get();
        $repartidores = User::where('role', 'repartidor')->get(['id', 'name']);

        return Inertia::render('Admin/ReglasGanancia', [
            'reglas' => $reglas,
            'repartidores' => $repartidores
        ]);
    }

    public function storeRegla(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'hora_inicio' => 'required|date_format:H:i',
            'hora_fin' => 'required|date_format:H:i|after:hora_inicio',
            'monto' => 'required|numeric|min:0',
            'tipo' => 'required|in:a_tiempo,retraso',
        ]);

        \App\Models\ReglaGanancia::create($data);

        return redirect()->back()->with('status', 'Regla de ganancia creada exitosamente.');
    }

    public function updateRegla(Request $request, \App\Models\ReglaGanancia $regla)
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

    public function destroyRegla(\App\Models\ReglaGanancia $regla)
    {
        $regla->delete();
        return redirect()->back()->with('status', 'Regla eliminada.');
    }
}
