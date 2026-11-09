<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    /** @use HasFactory<\Database\Factories\EmployeeFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = ['user_id', 'cuil', 'telefono'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function trainer()
    {
        return $this->hasOne(Trainer::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function ingresos()
    {
        return $this->hasMany(Ingreso::class);
    }
}
