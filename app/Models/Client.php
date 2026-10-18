<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Client extends Model
{
    /** @use HasFactory<\Database\Factories\ClientFactory> */
    use HasFactory;

    protected $fillable = ['user_id', 'telefono', ];

    public function turns(){
        return $this->hasMany(Turn::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function subscriptions(){
        return $this->hasMany(Subscription::class);
    }

    // Como no tengo una actualizacion automatica podria pasar que haya pasado la fecha de fin pero que aun no la hayan cambiado a vencida, por eso la doble verificación.
    public function activeSubscription(){
        return $this->hasOne(Subscription::class)->where('estado','activa')->where('fecha_fin', '>=', now())->lastestOfMany();
    }
}
