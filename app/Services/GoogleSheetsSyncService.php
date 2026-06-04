<?php

namespace App\Services;

use App\Models\Entrega;
use Google\Client;
use Google\Service\Sheets;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class GoogleSheetsSyncService
{
    protected $client;
    protected $service;
    protected $spreadsheetId;

    public function __construct()
    {
        $this->spreadsheetId = env('GOOGLE_SHEETS_SPREADSHEET_ID');
        $credentialsPath = base_path(env('GOOGLE_SHEETS_CREDENTIALS_PATH', 'storage/app/google-credentials.json'));

        $this->client = new Client();
        $this->client->setApplicationName('CMSUP Sheets Sync');
        $this->client->setScopes([Sheets::SPREADSHEETS_READONLY]);
        
        if (file_exists($credentialsPath)) {
            $this->client->setAuthConfig($credentialsPath);
        } else {
            Log::warning("Archivo de credenciales de Google Sheets no encontrado en: {$credentialsPath}");
        }

        $this->service = new Sheets($this->client);
    }

    /**
     * Sincroniza la hoja del día actual.
     */
    public function syncDailyDeliveries()
    {
        if (empty($this->spreadsheetId)) {
            Log::error("Falta configurar GOOGLE_SHEETS_SPREADSHEET_ID en el archivo .env");
            return [
                'success' => false,
                'message' => 'Falta configurar el SPREADSHEET_ID.'
            ];
        }

        // Buscar hoja con la fecha de hoy, ej. 03-06-2026
        $sheetName = Carbon::now()->format('d-m-Y');
        $range = "{$sheetName}!A:F";

        try {
            $response = $this->service->spreadsheets_values->get($this->spreadsheetId, $range);
            $values = $response->getValues();

            if (empty($values)) {
                return [
                    'success' => true,
                    'message' => "La pestaña '{$sheetName}' está vacía o no tiene datos."
                ];
            }

            // La primera fila debería ser los encabezados
            $headers = array_map('strtolower', array_shift($values));
            
            // Mapear posiciones de columnas
            $idIndex = array_search('# pedido', $headers) !== false ? array_search('# pedido', $headers) : array_search('id pedido', $headers);
            $canalIndex = array_search('canal_compra', $headers);
            $nombreIndex = array_search('nombre', $headers);
            $docIndex = array_search('documento', $headers);
            $dirIndex = array_search('dirección', $headers) !== false ? array_search('dirección', $headers) : array_search('direccion', $headers);
            $celIndex = array_search('celular', $headers);

            if ($idIndex === false) {
                return [
                    'success' => false,
                    'message' => "No se encontró la columna '# pedido' o 'ID pedido' en la pestaña '{$sheetName}'."
                ];
            }

            $countCreated = 0;
            $countUpdated = 0;

            foreach ($values as $row) {
                if (empty($row[$idIndex])) continue; // Salta filas sin ID

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
                    
                    // Disparar mensaje de WhatsApp de creación
                    $msg = "Hola Celulover, te van a llegar cosas bonitas.\nTu compra será despachada pronto y como nos tomamos enserio la seguridad, tendrás que indicarle esta palabra clave al repartido {$nuevaEntrega->palabra_clave}";
                    app(\App\Services\WhatsAppService::class)->send($nuevaEntrega->celular, $msg);

                    $countCreated++;
                }
            }

            return [
                'success' => true,
                'message' => "Sincronización exitosa. Creadas: {$countCreated}, Actualizadas: {$countUpdated}.",
                'created' => $countCreated,
                'updated' => $countUpdated
            ];

        } catch (\Google\Service\Exception $e) {
            $errorMsg = json_decode($e->getMessage(), true);
            $reason = $errorMsg['error']['message'] ?? $e->getMessage();
            
            // Si el error es porque no encuentra la hoja
            if (strpos($reason, 'Unable to parse range') !== false) {
                return [
                    'success' => false,
                    'message' => "No se encontró una pestaña con el nombre '{$sheetName}' en la hoja de cálculo."
                ];
            }

            Log::error("Error Google API: " . $reason);
            return [
                'success' => false,
                'message' => "Error al sincronizar: " . $reason
            ];
        } catch (\Exception $e) {
            Log::error("Error sincronizando Entregas: " . $e->getMessage());
            return [
                'success' => false,
                'message' => "Error interno al sincronizar."
            ];
        }
    }
}
