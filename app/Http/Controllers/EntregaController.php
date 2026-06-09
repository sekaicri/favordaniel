<?php

namespace App\Http\Controllers;

use App\Models\Entrega;
use App\Services\EntregaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Inertia\Inertia;

class EntregaController extends Controller
{
    public function __construct(
        protected EntregaService $entregaService
    ) {}

    /** Upload evidence to S3 and complete the delivery. */
    public function uploadEvidence(Request $request)
    {
        $request->validate([
            'tracking_id' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'evidencias_comprimidas' => 'nullable|array',
            'evidencias_comprimidas.*' => 'string',
            'firma_comprimida' => 'required|string',
        ]);

        try {
            $this->entregaService->completarEntregaConEvidencia(
                trackingId: $request->tracking_id,
                userId: Auth::id(),
                firmaBase64: $request->firma_comprimida,
                imagenesBase64: $request->evidencias_comprimidas ?? [],
                descripcion: $request->descripcion,
            );

            return redirect()->route('repartidor.assign')
                ->with('status', "¡Éxito! Entrega #{$request->tracking_id} completada y firmada.");

        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => 'Error al subir la evidencia: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /** Driver dashboard — list own deliveries. */
    public function index(Request $request)
    {
        $query = Entrega::where('user_id', Auth::id());

        if ($request->has('fecha') && $request->fecha != '') {
            $query->whereDate('created_at', $request->fecha);
        }

        return Inertia::render('Repartidor/Index', [
            'entregas' => $query->orderBy('created_at', 'desc')->get()
        ]);
    }

    /** Driver assignment view. */
    public function assignView()
    {
        $entregas = Entrega::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Repartidor/Assign', [
            'entregas' => $entregas
        ]);
    }

    /** Self-assign a delivery to the logged-in driver. */
    public function assignDelivery(Request $request)
    {
        $request->validate([
            'tracking_id' => 'required|string|max:255',
        ]);

        $tracking_id = $request->tracking_id;
        $entrega = Entrega::where('tracking_id', $tracking_id)->first();

        if (!$entrega) {
            return redirect()->back()
                ->withErrors(['tracking_id' => 'No se encontró ninguna entrega con este Número de Guía.'])
                ->withInput();
        }

        if ($entrega->user_id && $entrega->user_id !== Auth::id()) {
            return redirect()->back()
                ->withErrors(['tracking_id' => 'Esta entrega ya está asignada a otro repartidor.'])
                ->withInput();
        }

        if ($entrega->user_id === Auth::id()) {
            return redirect()->back()->with('status', 'Ya tienes asignada esta entrega.');
        }

        $this->entregaService->asignarRepartidor($entrega, Auth::id());

        return redirect()->route('repartidor.assign')
            ->with('status', "¡Éxito! La entrega #{$tracking_id} te ha sido asignada correctamente.");
    }

    /** Delivery detail for keyword verification. */
    public function detailView(Entrega $entrega)
    {
        if ($entrega->user_id !== Auth::id()) {
            abort(403, 'Acceso denegado');
        }

        return Inertia::render('Repartidor/DeliveryDetail', [
            'entrega' => $entrega
        ]);
    }

    /** Evidence upload view. */
    public function evidenceView(Entrega $entrega)
    {
        if ($entrega->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Repartidor/Evidence', [
            'entrega' => $entrega
        ]);
    }

    /** Completed delivery audit view. */
    public function completedDetailView(Entrega $entrega)
    {
        if ($entrega->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Repartidor/CompletedDetail', [
            'entrega' => $entrega
        ]);
    }

    /** Validate keyword + document before allowing evidence upload. */
    public function attemptDelivery(Request $request, Entrega $entrega)
    {
        if ($entrega->user_id !== Auth::id()) {
            abort(403, 'Acceso denegado');
        }

        $request->validate([
            'palabra_clave' => 'required|string',
            'documento' => 'nullable|string',
        ]);

        // Check keyword (case-insensitive)
        if (strtoupper(trim($request->palabra_clave)) !== strtoupper($entrega->palabra_clave)) {
            $entrega->intentos_fallidos = ($entrega->intentos_fallidos ?? 0) + 1;

            if ($entrega->intentos_fallidos >= 3) {
                $entrega->estado = 'bloqueado';
                $entrega->motivo_bloqueo = 'Palabra Clave';
                $entrega->save();
                return redirect()->route('repartidor.assign')
                    ->with('error', 'Se ha bloqueado la entrega por exceder los intentos de palabra clave.');
            }

            $entrega->save();
            return redirect()->back()
                ->withErrors(['palabra_clave' => 'La palabra clave no coincide. Te quedan ' . (3 - $entrega->intentos_fallidos) . ' intentos.'])
                ->withInput();
        }

        // Keyword correct — reset attempts
        $entrega->intentos_fallidos = 0;
        if ($request->filled('documento')) {
            $entrega->documento = $request->documento;
        }
        $entrega->save();

        return redirect()->route('repartidor.evidence.view', $entrega->id)
            ->with('status', 'Validación exitosa. Por favor ingresa las evidencias.');
    }

    /** Block a delivery manually (driver could not deliver). */
    public function blockDelivery(Request $request, Entrega $entrega)
    {
        if ($entrega->user_id !== Auth::id()) {
            abort(403, 'Acceso denegado');
        }

        $request->validate([
            'motivo' => 'required|string',
        ]);

        $entrega->estado = 'bloqueado';
        $entrega->motivo_bloqueo = $request->motivo;
        $entrega->save();

        return redirect()->route('repartidor.assign')
            ->with('status', 'La entrega ha sido marcada como no entregada.');
    }
}
