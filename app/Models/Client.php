<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class Client extends Model
{
    /** @use HasFactory<\Database\Factories\ClientFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = ['user_id', 'telefono', 'trainer_id',];

    public function trainer()
    {
        return $this->belongsTo(Trainer::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function payments()
    {
        return $this->hasManyThrough(Payment::class, Subscription::class);
    }

    // Como no tengo una actualizacion automatica podria pasar que haya pasado la fecha de fin pero que aun no la hayan cambiado a vencida, por eso la doble verificación.
    public function ultimaSuscripcion()
    {
        return $this->hasOne(Subscription::class, 'client_id', 'id')->latestOfMany();
    }

    public function ingresos()
    {
        return $this->hasMany(Ingreso::class);
    }

    public function activeSubscription()
    {
        return $this->hasOne(Subscription::class, 'client_id', 'id')
            ->where('estado', 'activa')
            ->latestOfMany();
    }

    public function recalcularEstado(): void
    {
        $suscripcion = $this->ultimaSuscripcion()->with('plan')->first();

        $mantieneEntrenador = $suscripcion
            && in_array($suscripcion->estado, ['activa', 'pendiente'])
            && $suscripcion->plan?->incluye_entrenador;

        if (!$mantieneEntrenador && $this->trainer_id !== null) {
            $this->update(['trainer_id' => null]);
        }
    }
}
