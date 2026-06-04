<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class WhatsAppService
{
    /**
     * El número oficial corporativo configurado para envíos.
     */
    const SENDER_NUMBER = '+57 3102194973';

    /**
     * Envía un mensaje de WhatsApp (Modo Real vía CallMeBot)
     *
     * @param string|null $to
     * @param string $message
     * @return bool
     */
    public function send(?string $to, string $message): bool
    {
        if (empty($to)) {
            Log::warning("[WhatsApp] Intento de envío fallido: Cliente no tiene un número celular válido registrado.");
            return false;
        }

        // Limpiamos el número de teléfono para que sólo tenga números y el símbolo +
        $cleanTo = preg_replace('/[^0-9+]/', '', $to);
        
        // Si el número no tiene el prefijo de país (asumiendo Colombia +57 si empieza por 3)
        if (strpos($cleanTo, '+') === false && substr($cleanTo, 0, 1) === '3') {
            $cleanTo = '+57' . $cleanTo;
        }

        // API Key de CallMeBot
        $apiKey = '5669230';
        
        // Formatear el texto
        $urlEncodedMessage = urlencode($message);
        
        $url = "https://api.callmebot.com/whatsapp.php?phone={$cleanTo}&text={$urlEncodedMessage}&apikey={$apiKey}";

        try {
            $response = Http::get($url);
            
            if ($response->successful()) {
                Log::info("[WhatsApp Real] Mensaje enviado a {$cleanTo} exitosamente vía CallMeBot.");
                return true;
            } else {
                Log::error("[WhatsApp Real] Error enviando mensaje a {$cleanTo}. Response: " . $response->body());
                return false;
            }
        } catch (\Exception $e) {
            Log::error("[WhatsApp Real] Excepción enviando mensaje: " . $e->getMessage());
            return false;
        }
    }
}
