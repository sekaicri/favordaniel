<?php

namespace App\Services;

use App\Models\Entrega;
use Google\Client;
use Google\Service\Sheets;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

/** Syncs deliveries from a Google Sheets spreadsheet (one sheet per day). */
class GoogleSheetsSyncService
{
    protected Client $client;
    protected Sheets $service;
    protected ?string $spreadsheetId;

    public function __construct()
    {
        $this->spreadsheetId = config('services.google_sheets.spreadsheet_id');
        $credentialsPath = base_path(config('services.google_sheets.credentials_path'));

        $this->client = new Client();
        $this->client->setApplicationName('CMSUP Sheets Sync');
        $this->client->setScopes([Sheets::SPREADSHEETS_READONLY]);

        if (file_exists($credentialsPath)) {
            $this->client->setAuthConfig($credentialsPath);
        } else {
            Log::warning("[GoogleSheets] Credentials file not found: {$credentialsPath}");
        }

        $this->service = new Sheets($this->client);
    }

    /** Sync today's sheet tab into the entregas table. */
    public function syncDailyDeliveries(): array
    {
        if (empty($this->spreadsheetId)) {
            Log::error("[GoogleSheets] Missing GOOGLE_SHEETS_SPREADSHEET_ID in .env");
            return ['success' => false, 'message' => 'Falta configurar el SPREADSHEET_ID.'];
        }

        $sheetName = Carbon::now()->format('d-m-Y');
        $range = "{$sheetName}!A:F";

        try {
            $response = $this->service->spreadsheets_values->get($this->spreadsheetId, $range);
            $values = $response->getValues();

            if (empty($values)) {
                return ['success' => true, 'message' => "La pestaña '{$sheetName}' está vacía o no tiene datos."];
            }

            $headers = array_map('strtolower', array_shift($values));

            // Map column positions
            $idIndex = array_search('# pedido', $headers) !== false ? array_search('# pedido', $headers) : array_search('id pedido', $headers);
            $canalIndex = array_search('canal_compra', $headers);
            $nombreIndex = array_search('nombre', $headers);
            $docIndex = array_search('documento', $headers);
            $dirIndex = array_search('dirección', $headers) !== false ? array_search('dirección', $headers) : array_search('direccion', $headers);
            $celIndex = array_search('celular', $headers);

            if ($idIndex === false) {
                return ['success' => false, 'message' => "No se encontró la columna '# pedido' en la pestaña '{$sheetName}'."];
            }

            $countCreated = 0;
            $countUpdated = 0;

            foreach ($values as $row) {
                if (empty($row[$idIndex])) continue;

                $trackingId = $row[$idIndex];

                $data = [
                    'canal_compra' => $canalIndex !== false && isset($row[$canalIndex]) ? $row[$canalIndex] : null,
                    'cliente'      => $nombreIndex !== false && isset($row[$nombreIndex]) ? $row[$nombreIndex] : null,
                    'documento'    => $docIndex !== false && isset($row[$docIndex]) ? $row[$docIndex] : null,
                    'direccion'    => $dirIndex !== false && isset($row[$dirIndex]) ? $row[$dirIndex] : null,
                    'celular'      => $celIndex !== false && isset($row[$celIndex]) ? $row[$celIndex] : null,
                ];

                $entrega = Entrega::where('tracking_id', $trackingId)->first();

                if ($entrega) {
                    $entrega->update($data);
                    $countUpdated++;
                } else {
                    $data['tracking_id'] = $trackingId;
                    $data['estado'] = 'pendiente';
                    $nuevaEntrega = Entrega::create($data);

                    // Notify client via WhatsApp with their keyword
                    $msg = "Hola Celulover, te van a llegar cosas bonitas.\nTu compra será despachada pronto y como nos tomamos enserio la seguridad, tendrás que indicarle esta palabra clave al repartidor: {$nuevaEntrega->palabra_clave}";
                    app(WhatsAppService::class)->send($nuevaEntrega->celular, $msg);

                    $countCreated++;
                }
            }

            return [
                'success' => true,
                'message' => "Sincronización exitosa. Creadas: {$countCreated}, Actualizadas: {$countUpdated}.",
                'created' => $countCreated,
                'updated' => $countUpdated,
            ];

        } catch (\Google\Service\Exception $e) {
            $errorMsg = json_decode($e->getMessage(), true);
            $reason = $errorMsg['error']['message'] ?? $e->getMessage();

            if (strpos($reason, 'Unable to parse range') !== false) {
                return ['success' => false, 'message' => "No se encontró la pestaña '{$sheetName}' en la hoja de cálculo."];
            }

            Log::error("[GoogleSheets] API error: {$reason}");
            return ['success' => false, 'message' => "Error al sincronizar: {$reason}"];

        } catch (\Exception $e) {
            Log::error("[GoogleSheets] Sync error: {$e->getMessage()}");
            return ['success' => false, 'message' => 'Error interno al sincronizar.'];
        }
    }
}
