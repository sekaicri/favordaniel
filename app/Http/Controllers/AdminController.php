<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use App\Models\User;

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
    public function usersStore(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|string',
            'telefono' => 'nullable|string|max:20',
            'estado' => 'required|boolean',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'telefono' => $request->telefono,
            'estado' => $request->estado,
        ]);

        return redirect()->route('admin.usuarios')->with('status', '¡Usuario creado exitosamente!');
    }

    /**
     * Web: Formulario para editar usuario existente.
     */
    public function usersEdit(User $user)
    {
        return Inertia::render('Admin/UserForm', [
            'user' => $user->only(['id', 'name', 'email', 'role', 'telefono', 'estado', 'ultimo_acceso']),
            'roles' => $this->getAvailableRoles(),
        ]);
    }

    /**
     * API: Actualizar usuario existente.
     */
    public function usersUpdate(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6',
            'role' => 'required|string',
            'telefono' => 'nullable|string|max:20',
            'estado' => 'required|boolean',
        ]);

        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'telefono' => $request->telefono,
            'estado' => $request->estado,
        ];

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return redirect()->route('admin.usuarios')->with('status', '¡Usuario actualizado exitosamente!');
    }

    /**
     * Retorna los roles disponibles del sistema.
     */
    private function getAvailableRoles(): array
    {
        return [
            ['value' => 'admin', 'label' => 'Administrador'],
            ['value' => 'facturador', 'label' => 'Facturador'],
            ['value' => 'inventarios', 'label' => 'Inventarios'],
            ['value' => 'repartidor', 'label' => 'Repartidor'],
            ['value' => 'soporte', 'label' => 'Soporte'],
            ['value' => 'experiencia', 'label' => 'Experiencia'],
            ['value' => 'user', 'label' => 'Usuario'],
        ];
    }
}
