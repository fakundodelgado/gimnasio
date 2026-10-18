<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    /** @use HasFactory<\Database\Factories\PlanFactory> */
    use HasFactory;

    protected $fillable = ['precio', 'nombre', 'descripcion', 'duracion'];

    public function subscriptions(){
        return $this->hasMany(Subscription::class);
    }
}
