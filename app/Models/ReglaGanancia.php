<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReglaGanancia extends Model
{
    protected $table = 'reglas_ganancias';

    protected $fillable = [
        'user_id',
        'hora_inicio',
        'hora_fin',
        'monto',
        'tipo',
        'activa'
    ];

    protected $casts = [
        'activa' => 'boolean',
        'monto' => 'decimal:2',
    ];

    /** Find the active earning rule for a user at a given time (user-specific first, then global fallback). */
    public static function buscarActivaPara(?int $userId, string $hora): ?self
    {
        $regla = static::where('activa', true)
            ->where('user_id', $userId)
            ->where('hora_inicio', '<=', $hora)
            ->where('hora_fin', '>=', $hora)
            ->first();

        if (!$regla) {
            $regla = static::where('activa', true)
                ->whereNull('user_id')
                ->where('hora_inicio', '<=', $hora)
                ->where('hora_fin', '>=', $hora)
                ->first();
        }

        return $regla;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
