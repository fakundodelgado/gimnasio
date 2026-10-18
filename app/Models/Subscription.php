<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    /** @use HasFactory<\Database\Factories\SubscriptionFactory> */
    use HasFactory;

    protected $fillable = ['client_id', 'plan_id', 'precio', 'fecha_fin', 'fecha_inicio', 'estado'];

    public function client(){
        return $this->belongsTo(Client::class);
    }

    public function plan(){
        return $this->belongsTo(Plan::class);
    }

    public function payments(){
        return $this->hasMany(Payment::class);
    }
}
