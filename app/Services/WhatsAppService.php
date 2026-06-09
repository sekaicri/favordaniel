<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

/** Sends WhatsApp messages via CallMeBot API. */
class WhatsAppService
{
    protected string $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.whatsapp.api_key', '');
    }

    public function send(?string $to, string $message): bool
    {
        if (empty($to)) {
            Log::warning("[WhatsApp] No phone number provided, skipping.");
            return false;
        }

        // Clean phone number — digits and + only
        $cleanTo = preg_replace('/[^0-9+]/', '', $to);

        // Default to Colombia (+57) if no country code
        if (strpos($cleanTo, '+') === false && substr($cleanTo, 0, 1) === '3') {
            $cleanTo = '+57' . $cleanTo;
        }

        $url = "https://api.callmebot.com/whatsapp.php?" . http_build_query([
            'phone' => $cleanTo,
            'text' => $message,
            'apikey' => $this->apiKey,
        ]);

        try {
            $response = Http::get($url);

            if ($response->successful()) {
                Log::info("[WhatsApp] Message sent to {$cleanTo}.");
                return true;
            }

            Log::error("[WhatsApp] Failed to send to {$cleanTo}: " . $response->body());
            return false;
        } catch (\Exception $e) {
            Log::error("[WhatsApp] Exception: " . $e->getMessage());
            return false;
        }
    }
}
