<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Turn extends Model
{
    /** @use HasFactory<\Database\Factories\TurnFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = ['trainer_id', 'client_id', 'hora', 'dia'];

    public function trainer(){
        return $this->belongsTo(Trainer::class);
    }

    public function client(){
        return $this->belongsTo(Client::class);
    }
}
