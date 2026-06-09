<?php

namespace App\Services;

use App\Models\Entrega;
use App\Models\ReglaGanancia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

/** Centralized business logic for deliveries: earnings, evidence upload, and assignment. */
class EntregaService
{
    public function __construct(
        protected WhatsAppService $whatsApp
    ) {}

    /** Calculate earning amount and time condition for a delivery. */
    public function calcularGanancia(?int $userId, ?Carbon $momento = null): array
    {
        $hora = ($momento ?? Carbon::now())->format('H:i:s');
        $regla = ReglaGanancia::buscarActivaPara($userId, $hora);

        return [
            'ganancia' => $regla ? $regla->monto : 0,
            'condicion_tiempo' => $regla ? $regla->tipo : 'fuera_rango',
        ];
    }

    /**
     * Upload evidence + signature to S3, save delivery in DB with earning calculation.
     * Uses DB::transaction; rolls back S3 files on failure.
     */
    public function completarEntregaConEvidencia(
        string $trackingId,
        int $userId,
        string $firmaBase64,
        array $imagenesBase64 = [],
        ?string $descripcion = null
    ): Entrega {
        $now = Carbon::now();
        $folderPath = "evidencias/{$now->format('Y/m/d')}/{$trackingId}";
        $archivosSubidos = [];

        try {
            // Upload evidence images to S3
            $urls = [];
            foreach ($imagenesBase64 as $index => $base64Image) {
                $imageData = preg_replace('#^data:image/\w+;base64,#i', '', $base64Image);
                $imageBinary = base64_decode($imageData);

                $fullPath = "{$folderPath}/{$now->format('H_i_s')}_img{$index}.jpg";

                if (!Storage::disk('s3')->put($fullPath, $imageBinary)) {
                    throw new \Exception("Failed to upload image {$index} to S3.");
                }

                $archivosSubidos[] = $fullPath;
                $urls[] = Storage::disk('s3')->url($fullPath);
            }

            // Upload signature to S3
            $firmaData = preg_replace('#^data:image/\w+;base64,#i', '', $firmaBase64);
            $firmaBinary = base64_decode($firmaData);
            $firmaFullPath = "{$folderPath}/{$now->format('H_i_s')}_firma.jpg";

            if (!Storage::disk('s3')->put($firmaFullPath, $firmaBinary)) {
                throw new \Exception("Failed to upload signature to S3.");
            }
            $archivosSubidos[] = $firmaFullPath;
            $firmaUrl = Storage::disk('s3')->url($firmaFullPath);

            // Calculate earning
            $resultado = $this->calcularGanancia($userId, $now);

            // Persist in DB (transactional)
            $entrega = DB::transaction(function () use (
                $trackingId, $userId, $descripcion, $urls, $firmaUrl, $now, $resultado
            ) {
                return Entrega::updateOrCreate(
                    ['tracking_id' => $trackingId],
                    [
                        'user_id' => $userId,
                        'estado' => 'entregado',
                        'descripcion' => $descripcion,
                        'url_evidencia' => $urls,
                        'firma_entrega' => $firmaUrl,
                        'delivered_at' => $now,
                        'ganancia' => $resultado['ganancia'],
                        'condicion_tiempo' => $resultado['condicion_tiempo'],
                    ]
                );
            });

            return $entrega;

        } catch (\Exception $e) {
            // Rollback: delete orphan S3 files
            foreach ($archivosSubidos as $path) {
                try {
                    Storage::disk('s3')->delete($path);
                } catch (\Exception $deleteEx) {
                    Log::warning("[EntregaService] Could not delete orphan S3 file: {$path}");
                }
            }

            Log::error("[EntregaService] Failed to complete delivery #{$trackingId}: {$e->getMessage()}");
            throw $e;
        }
    }

    /** Assign a driver to a delivery and notify the client via WhatsApp. */
    public function asignarRepartidor(Entrega $entrega, int $userId): void
    {
        $entrega->update([
            'user_id' => $userId,
            'estado' => 'pendiente',
            'assigned_at' => Carbon::now(),
        ]);

        $msg = "Hola Celulover, vamos en camino a llevarte tu pedido.\nNo olvides tu palabra clave!";
        $this->whatsApp->send($entrega->celular, $msg);
    }

    /** Unassign the driver from a delivery. */
    public function desasignarRepartidor(Entrega $entrega): void
    {
        $entrega->update([
            'user_id' => null,
            'estado' => 'pendiente',
            'assigned_at' => null,
        ]);
    }
}
