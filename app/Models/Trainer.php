<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Trainer extends Model
{
    /** @use HasFactory<\Database\Factories\TrainerFactory> */
    use HasFactory;

    protected $fillable = ['employee_id', 'especialidad'];

    public function employee(){
        return $this->belongsTo(Employee::class);
    }

    public function turns(){
        return $this->hasMany(Turn::class);
    }
}
