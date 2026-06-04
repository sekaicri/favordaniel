<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\GoogleSheetsSyncService;

class SyncEntregasGoogleSheets extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'entregas:sync';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sincroniza las entregas diarias desde Google Sheets';

    /**
     * Execute the console command.
     */
    public function handle(GoogleSheetsSyncService $syncService)
    {
        $this->info('Iniciando sincronización con Google Sheets...');
        
        $result = $syncService->syncDailyDeliveries();
        
        if ($result['success']) {
            $this->info($result['message']);
        } else {
            $this->error($result['message']);
        }
        
        return 0;
    }
}
