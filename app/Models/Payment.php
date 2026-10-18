<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    /** @use HasFactory<\Database\Factories\PaymentFactory> */
    use HasFactory;

    protected $fillable = ['subscription_id', 'employee_id', 'fecha_pago', 'metodo_pago', 'monto' ];

    public function employee(){
        return $this->belongsTo(Employee::class);
    }

    public function subscription(){
        return $this->belongsTo(Subscription::class);
    }

    
}
