<?php

namespace App\Http\Controllers;

use App\Models\Entrega;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Inertia\Inertia;

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
            'evidencias_comprimidas' => 'nullable|array', // Ahora puede ser opcional
            'evidencias_comprimidas.*' => 'string',
            'firma_comprimida' => 'required|string', // La firma ahora es obligatoria
        ]);

        $tracking_id = $request->tracking_id;
        $base64Images = $request->evidencias_comprimidas ?? [];
        $base64Firma = $request->firma_comprimida;
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
                
                // Subir el binario decodificado localmente (public)
                $uploaded = Storage::disk('public')->put($fullPath, $imageBinary);
                
                if (!$uploaded) {
                    throw new \Exception("Error al guardar el archivo en el almacenamiento.");
                }

                // Crear URL relativa segura para cualquier puerto/entorno
                $url = "/storage/{$fullPath}";
                $urls[] = $url;
            }

            // Procesar la firma
            $firmaData = preg_replace('#^data:image/\w+;base64,#i', '', $base64Firma);
            $firmaBinary = base64_decode($firmaData);
            $firmaFilename = "{$now->format('H_i_s')}_firma.jpg";
            $firmaFullPath = "{$folderPath}/{$firmaFilename}";
            $firmaUploaded = Storage::disk('public')->put($firmaFullPath, $firmaBinary);
            
            if (!$firmaUploaded) {
                throw new \Exception("Error al guardar la firma en el almacenamiento.");
            }
            // Crear URL relativa para la firma
            $firmaUrl = "/storage/{$firmaFullPath}";

            // 3. Calcular Ganancia basada en reglas
            $time = $now->format('H:i:s');
            $regla = \App\Models\ReglaGanancia::where('user_id', Auth::id())
                ->where('activa', true)
                ->where('hora_inicio', '<=', $time)
                ->where('hora_fin', '>=', $time)
                ->first();

            if (!$regla) {
                $regla = \App\Models\ReglaGanancia::whereNull('user_id')
                    ->where('activa', true)
                    ->where('hora_inicio', '<=', $time)
                    ->where('hora_fin', '>=', $time)
                    ->first();
            }

            $gananciaCalculada = $regla ? $regla->monto : 0;
            $condicionTiempo = $regla ? $regla->tipo : 'fuera_rango';

            // 4. Crear o actualizar entrega
            $entrega = Entrega::updateOrCreate(
                ['tracking_id' => $tracking_id],
                [
                    'user_id' => Auth::id(),
                    'estado' => 'entregado',
                    'descripcion' => $request->descripcion,
                    'url_evidencia' => $urls,
                    'firma_entrega' => $firmaUrl,
                    'delivered_at' => $now,
                    'ganancia' => $gananciaCalculada,
                    'condicion_tiempo' => $condicionTiempo
                ]
            );

            return redirect()->route('repartidor.assign')->with('status', "¡Éxito! Entrega #{$tracking_id} completada y firmada.");

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
        $query = Entrega::where('user_id', Auth::id());

        if ($request->has('fecha') && $request->fecha != '') {
            $query->whereDate('created_at', $request->fecha);
        }

        $entregas = $query->orderBy('created_at', 'desc')->get();

        return Inertia::render('Repartidor/Index', [
            'entregas' => $entregas
        ]);
    }

    /**
     * Web: Vista para que el repartidor se asigne entregas y vea su lista.
     */
    public function assignView()
    {
        $entregas = Entrega::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Repartidor/Assign', [
            'entregas' => $entregas
        ]);
    }

    /**
     * Web: Procesa la asignación de una entrega al repartidor logueado.
     */
    public function assignDelivery(Request $request)
    {
        $request->validate([
            'tracking_id' => 'required|string|max:255',
        ]);

        $tracking_id = $request->tracking_id;
        
        // Buscar la entrega por ID de seguimiento
        $entrega = Entrega::where('tracking_id', $tracking_id)->first();

        if (!$entrega) {
            return redirect()->back()->withErrors(['tracking_id' => 'No se encontró ninguna entrega con este Número de Guía.'])->withInput();
        }

        // Si ya está asignada a otro usuario
        if ($entrega->user_id && $entrega->user_id !== Auth::id()) {
            return redirect()->back()->withErrors(['tracking_id' => 'Esta entrega ya está asignada a otro repartidor.'])->withInput();
        }

        // Si ya está asignada a este usuario
        if ($entrega->user_id === Auth::id()) {
            return redirect()->back()->with('status', 'Ya tienes asignada esta entrega.');
        }

        // Asignar al repartidor actual
        $entrega->user_id = Auth::id();
        
        // Si el estado era pendiente o nulo, pasarlo a asignado o por recoger
        if (!$entrega->estado || $entrega->estado === 'pendiente' || $entrega->estado === 'por asignar') {
            $entrega->estado = 'asignado';
            $entrega->assigned_at = Carbon::now();
        }

        $entrega->save();

        // Disparar mensaje de WhatsApp de asignación
        $msg = "Hola Celulover, vamos en camino a llevarte tu pedido.\nNo olvides tu palabra clave!";
        app(\App\Services\WhatsAppService::class)->send($entrega->celular, $msg);

        return redirect()->back()->with('status', "¡Éxito! La entrega #{$tracking_id} te ha sido asignada correctamente.");
    }

    /**
     * Web: Vista detalle de una entrega para que el repartidor realice la verificación.
     */
    public function detailView(Entrega $entrega)
    {
        // Verificar que pertenezca a este repartidor
        if ($entrega->user_id !== Auth::id()) {
            abort(403, 'Acceso denegado');
        }

        return Inertia::render('Repartidor/DeliveryDetail', [
            'entrega' => $entrega
        ]);
    }

    public function evidenceView(Entrega $entrega)
    {
        // Solo el repartidor asignado puede ver la evidencia
        if ($entrega->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Repartidor/Evidence', [
            'entrega' => $entrega
        ]);
    }

    public function completedDetailView(Entrega $entrega)
    {
        // Solo el repartidor asignado puede ver su auditoría de entrega finalizada
        if ($entrega->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Repartidor/CompletedDetail', [
            'entrega' => $entrega
        ]);
    }

    /**
     * Web: Intento de entrega validando la palabra clave y el documento.
     */
    public function attemptDelivery(Request $request, Entrega $entrega)
    {
        // Verificar que pertenezca a este repartidor
        if ($entrega->user_id !== Auth::id()) {
            abort(403, 'Acceso denegado');
        }

        $request->validate([
            'palabra_clave' => 'required|string',
            'documento' => 'nullable|string',
        ]);

        // Verificamos si la palabra clave coincide (ignorando mayúsculas/minúsculas)
        if (strtoupper(trim($request->palabra_clave)) !== strtoupper($entrega->palabra_clave)) {
            return redirect()->back()->withErrors(['palabra_clave' => 'La palabra clave no coincide. Inténtalo de nuevo.'])->withInput();
        }

        // Si es correcta, podemos actualizar el documento que proporcionaron si era necesario
        if ($request->filled('documento')) {
            $entrega->documento = $request->documento;
            $entrega->save();
        }

        // Redirigir a la vista de evidencias para terminar el flujo
        return redirect()->route('repartidor.evidence.view', $entrega->id)->with('status', 'Validación exitosa. Por favor ingresa las evidencias.');
    }
}
