<?php

namespace App\Http\Requests;

//use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Override;

// En este caso en particular son identicos y solo lo replico para continuar con la estructura que ya vengo usando para los otros modelos, pero esta clase en 
// particular es totalmente prescindible, o en su defecto, la otra.
class UpdateSubscriptionRequest extends FormRequest
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
            'client_id' => ['required', 'exists:clients,id'],
            'plan_id' => ['required', 'exists:plans,id'],
            'precio' => ['required', 'numeric', 'min:5000', 'max:100000'],
            'fecha_inicio' => ['required', 'date'],
            'fecha_fin' => ['required', 'date', 'after_or_equal:fecha_inicio'],
            'estado' => ['required', 'string', 'in:activa,vencida,pendiente,cancelada'],
        ];

    }

    #[Override]
    public function attributes()
    {
        return [
            'client_id' => 'numero de cliente',
            'plan_id' => 'numero de plan',
            'precio' => 'precio actual',
            'fecha_inicio' => 'inicio de suscripcion',
            'fecha_fin' => 'vencimiento de suscripcion',
            'estado' => 'estado de la suscripcion',
        ];  
    }

    #[Override]
    public function messages()
    {
        return [
            'required' => 'el campo :attribute es obligatorio',
            'exists' => 'el :attribute debe ser uno valido',
            'numeric' => 'el valor ingresado debe ser un numero',
            'min' => 'el valor es menor al minimo permitido para el campo :attribute',
            'max' => 'el valor es mayor al maximo permitido para el campo :attribute',
            'date' => 'el valor ingresado en el campo :attribute debe ser una fecha',
            'in' => 'el valor del campo :attribute no es valido',
            'after_or_equal' => 'el campo :attribute debe ser posterior o igual a la fecha de inicio',
        ];  
    }
}