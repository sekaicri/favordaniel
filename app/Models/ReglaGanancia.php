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

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
