<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class Subscription extends Model
{
    /** @use HasFactory<\Database\Factories\SubscriptionFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = ['client_id', 'plan_id', 'precio', 'fecha_fin', 'fecha_inicio', 'estado'];

    protected $casts = [
        'fecha_fin' => 'date',
        'fecha_inicio' => 'date',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class)->withTrashed();
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    protected function serializeDate(\DateTimeInterface $date): string
    {
        return $date->format('Y-m-d');
    }

    public function recalcularEstado(): void
    {
        // Para probar
        if (!in_array($this->estado, ['activa', 'pendiente', 'cancelada'], true)) {
            return;
        }

        $duracionPlan = $this->plan->duracion;
        $mitadDuración = $this->fecha_inicio->copy()->addDays($duracionPlan / 2);

        $totalPagado = round((float) $this->payments()->sum('monto'), 2);
        $precioSuscripcion = round((float) $this->precio, 2);

        if ($totalPagado <= 0) {
            if ($this->estado !== 'cancelada') {
                $this->fecha_fin = Carbon::today();
                $this->estado = 'cancelada';
                $this->save();
            }
        } elseif ($totalPagado >= $precioSuscripcion) {
            $this->estado = Carbon::today() > $this->fecha_fin ? 'vencida' : 'activa';
            $this->save();
        } elseif (Carbon::today() > $mitadDuración) {
            $this->estado = 'cancelada';
            $this->fecha_fin = $mitadDuración->toDateString();
            $this->save();
        } else {
            $this->estado = 'pendiente';
            $this->save();
        }
    }

    public static function actualizarEstados(): int
    {
        $actualizadas = 0;

        $suscripciones = Subscription::with('plan')
            ->whereIn('estado', ['activa', 'pendiente'])
            ->get();

        foreach ($suscripciones as $suscripcion) {
            $estadoAnterior = $suscripcion->estado;
            $suscripcion->recalcularEstado();

            if ($suscripcion->estado !== $estadoAnterior) {
                $actualizadas++;
            }
        }

        return $actualizadas;
    }
}
