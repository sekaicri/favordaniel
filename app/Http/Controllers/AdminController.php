<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;

class AdminController extends Controller
{
    /**
     * Web: Panel Admin (Gestión de usuarios).
     */
    public function usersIndex(Request $request)
    {
        if (Auth::user()->email !== 'hola@celumovilstore.com.co') {
            abort(403, 'Acceso denegado.');
        }

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
}
