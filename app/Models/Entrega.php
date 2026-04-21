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
        'estado',
        'descripcion',
        'url_evidencia',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
