<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Trainer extends Model
{
    /** @use HasFactory<\Database\Factories\TrainerFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = ['employee_id', 'especialidad'];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function clients()
    {
        return $this->hasMany(Client::class);
    }
}
