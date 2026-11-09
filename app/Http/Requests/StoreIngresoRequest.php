<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Override;

class StoreIngresoRequest extends FormRequest
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
            'client_id' => ['required', 'exists:clients,id', 'integer'],
        ];
    }

    #[Override]
    public function attributes()
    {
        return ['client_id' => 'numero de cliente'];
    }

    #[Override]
    public function messages(): array
    {
        return [
            'required' => 'el campo :attribute es obligatorio',
            'exists' => 'el valor ingresado en el campo :attribute no existe',
            'integer' => 'el valor del campo :attribute debe ser un numero',
        ];
    }
}
