<?php

namespace App\Http\Requests;

//use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Override;

class StorePlanRequest extends FormRequest
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
            // Lo que hace el whereNull es permitir varias filas inactivas en la BD con el mismo nombre, pero nunca dos activas con el mismo nombre.
            'nombre' => ['required', 'string', 'max:255', Rule::unique('plans', 'nombre')->whereNull('deleted_at'),],
            'descripcion' => ['nullable', 'string'],
            'precio' => ['required', 'numeric', 'min:0'],
            'duracion' => ['required', 'integer', 'min:30'],
            'incluye_entrenador' => ['required', 'boolean'],
        ];
    }

    #[Override]
    public function attributes(): array
    {
        return [
            'nombre' => 'nombre del plan',
            'descripcion' => 'descripcion del plan',
            'precio' => 'precio del plan',
            'duracion' => 'duracion del plan',
        ];
    }

    #[Override]
    public function messages(): array
    {
        return [
            'required' => 'el campo :attribute es obligatorio.',
            'unique' => 'el :attribute ingresado pertenece a otro plan.',
            'min' => 'el campo :attribute no puede ser menor a :min.',
            'max' => 'el campo :attribute no puede ser mayor a :max',
        ];
    }
}
