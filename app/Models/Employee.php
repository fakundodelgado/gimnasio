<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    /** @use HasFactory<\Database\Factories\EmployeeFactory> */
    use HasFactory;

    protected $fillable = ['user_id', 'cuil', 'telefono'];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function trainer(){
        return $this->hasOne(Trainer::class);
    }

    public function payments(){
        return $this->hasMany(Payment::class);
    }
}
