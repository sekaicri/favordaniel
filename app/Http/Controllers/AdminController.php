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

        // Filtrar por búsqueda (Tracking ID o Nombre del repartidor)
        if ($request->has('search') && $request->search != '') {
            $query->where(function($q) use ($request) {
                $q->where('tracking_id', 'like', '%' . $request->search . '%')
                  ->orWhereHas('user', function($qu) use ($request) {
                      $qu->where('name', 'like', '%' . $request->search . '%');
                  });
            });
        }

        // Filtrar por fecha
        if ($request->has('fecha') && $request->fecha != '') {
            $query->whereDate('created_at', $request->fecha);
        }

        $entregas = $query->orderBy('created_at', 'desc')->paginate(15);

        return Inertia::render('Admin/Deliveries', [
            'entregas' => $entregas,
            'filters' => $request->only(['search', 'fecha'])
        ]);
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
}
