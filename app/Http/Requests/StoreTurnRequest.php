<?php

namespace App\Http\Requests;

//use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Override;

class StoreTurnRequest extends FormRequest
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
            'dia' => ['required', 'in:Lunes,Martes,Miercoles,Jueves,Viernes',],
            'hora' => ['required', 'date_format:H:i'],
            'trainer_id' => ['required', 'exists:trainers,id'],
            'client_id' => ['required', 'exists:clients,id']
        ];
    }

    #[Override]
    public function attributes(): array
    {
        return [
            'dia' => 'dia del turno',
            'hora' => 'hora del turno',
            'trainer_id' => 'ID del entrenador',
            'client_id' => 'ID del cliente'
        ];
    }

    #[Override]
    public function messages(): array
    {
        return [
            'required' => 'el campo :attribute es obligatorio',
            'in' => 'el valor ingresado en el campo :attribute no es valido',
            'exists' => 'el ID del campo :attribute no es valido',
            'date_format' => 'el campo :attribute debe tener un formato valido (HH:mm)'
        ];
    }
}
