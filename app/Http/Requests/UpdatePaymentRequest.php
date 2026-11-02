<?php

namespace App\Http\Requests;

//use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Override;

class UpdatePaymentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /*
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'monto' => ['required', 'numeric', 'min:5000', 'max:100000'],
            'fecha_pago' => ['required', 'date',],
            'subscription_id' => ['required', 'exists:subscriptions,id'],
            'employee_id' => ['required', 'exists:employees,id'],
            'metodo_pago' => ['required', 'in:tarjeta,efectivo,transferencia']
        ];
    }

    #[Override]
    public function attributes()
    {
        return [
            'monto' => 'monto del pago',
            'fecha_pago' => 'fecha del pago',
            'subscription_id' => 'ID de la suscripcion',
            'employee_id' => 'ID del empleado que lo registro',
            'metodo_pago' => 'metodo de pago'
        ];  
    }

    #[Override]
    public function messages()
    {
        return [
            'required' => 'el campo :attribute es obligatorio',
            'numeric' => 'el campo :attribute solo acepta numeros',
            'min' => 'el valor ingresado en el campo :attribute es menor al minimo admitido',
            'max' => 'el valor ingresado en el campo :attribute es mayor al maximo admitido',
            'in' => 'el valor del campo :attribute no es uno de los admitidos',
            'exists' => 'el valor del campo :attribute no es valido',
            'date' => 'el campo :attribute solo acepta fechas', 
        ];  
    }

}
