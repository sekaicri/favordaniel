<?php

namespace App\Http\Controllers;

use App\Models\Entrega;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class EntregaController extends Controller
{
    /**
     * API: Sube una evidencia a S3 y actualiza la base de datos.
     */
    public function uploadEvidence(Request $request)
    {
        $request->validate([
            'tracking_id' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'evidencias_comprimidas' => 'required|array', // Recibimos array de base64
            'evidencias_comprimidas.*' => 'string',
        ]);

        $tracking_id = $request->tracking_id;
        $base64Images = $request->evidencias_comprimidas;
        $now = Carbon::now();

        // 1. Estructura de carpetas: evidencias/Año/Mes/Día/ID_ORDEN/
        $folderPath = "evidencias/{$now->format('Y/m/d')}/{$tracking_id}";
        $urls = [];

        try {
            foreach ($base64Images as $index => $base64Image) {
                // Limpiar el prefijo data:image/jpeg;base64,
                $imageData = preg_replace('#^data:image/\w+;base64,#i', '', $base64Image);
                $imageBinary = base64_decode($imageData);

                // 2. Nombre del archivo
                $filename = "{$now->format('H_i_s')}_img{$index}.jpg";
                $fullPath = "{$folderPath}/{$filename}";
                
                // Subir el binario decodificado directamente a S3
                $uploaded = Storage::disk('s3')->put($fullPath, $imageBinary);
                
                if (!$uploaded) {
                    throw new \Exception("Error al guardar el archivo en el almacenamiento.");
                }

                // Obtener la URL pública manualmente
                $url = "https://" . env('AWS_BUCKET') . ".s3." . env('AWS_DEFAULT_REGION') . ".amazonaws.com/" . $fullPath;
                $urls[] = $url;
            }

            // 3. Crear o actualizar entrega
            $entrega = Entrega::updateOrCreate(
                ['tracking_id' => $tracking_id],
                [
                    'user_id' => Auth::id(),
                    'estado' => 'entregado',
                    'descripcion' => $request->descripcion,
                    'url_evidencia' => $urls
                ]
            );

            return redirect()->back()->with('status', "¡Éxito! Entrega #{$tracking_id} subida y optimizada correctamente.");

        } catch (\Exception $e) {
            \Log::error("Error en S3: " . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Error al subir la evidencia: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Web: Dashboard para el repartidor (ve sus propias fotos).
     */
    public function index(Request $request)
    {
        if (Auth::user()->role === 'admin') {
            return redirect()->route('admin.evidencias');
        }

        $query = Entrega::where('user_id', Auth::id());

        if ($request->has('fecha') && $request->fecha != '') {
            $query->whereDate('created_at', $request->fecha);
        }

        $entregas = $query->orderBy('created_at', 'desc')->get();

        return view('dashboard', compact('entregas'));
    }

    /**
     * Web: Panel Admin (ve todas las fotos).
     */
    public function adminIndex(Request $request)
    {
        if (Auth::user()->role !== 'admin') {
            abort(403);
        }

        $query = Entrega::with('user');

        // Filtrar por fecha
        if ($request->has('fecha') && $request->fecha != '') {
            $query->whereDate('created_at', $request->fecha);
        }

        // Filtrar por repartidor
        if ($request->has('user_id') && $request->user_id != '') {
            $query->where('user_id', $request->user_id);
        }

        $entregas = $query->orderBy('created_at', 'desc')->paginate(20);
        
        // Obtener lista de todos los usuarios que tienen al menos una entrega (para el filtro)
        $repartidores = \App\Models\User::whereHas('entregas')->get();

        return view('admin.index', compact('entregas', 'repartidores'));
    }
}
