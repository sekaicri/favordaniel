<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Entrega extends Model
{
    use HasFactory;

    protected $fillable = [
        'tracking_id',
        'user_id',
        'cliente',
        'canal_compra',
        'documento',
        'direccion',
        'celular',
        'estado',
        'descripcion',
        'url_evidencia',
        'palabra_clave',
        'firma_entrega',
        'assigned_at',
        'delivered_at',
        'ganancia',
        'condicion_tiempo',
        'motivo_bloqueo',
        'intentos_fallidos',
    ];

    const PALABRAS_CLAVE = [
        'ZAPATO', 'ARBOL', 'TIGRE', 'AVION', 'BARCO', 
        'CIELO', 'DULCE', 'ESTRELLA', 'FUEGO', 'GATO',
        'HIELO', 'ISLA', 'JARDIN', 'KIWI', 'LUNA',
        'MONTAÑA', 'NUBE', 'OSO', 'PERRO', 'QUESO',
        'RIO', 'SOL', 'TIERRA', 'UVA', 'VIENTO'
    ];

    protected static function booted()
    {
        static::creating(function ($entrega) {
            if (empty($entrega->palabra_clave)) {
                $entrega->palabra_clave = self::PALABRAS_CLAVE[array_rand(self::PALABRAS_CLAVE)];
            }
        });
    }

    protected $casts = [
        'url_evidencia' => 'array',
        'assigned_at' => 'datetime',
        'delivered_at' => 'datetime',
        'ganancia' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
