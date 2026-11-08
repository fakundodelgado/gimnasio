<?php

namespace App\Http\Requests;

//use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use App\Services\EmployeeService;
use App\Services\UserService;
use Override;

class StoreTrainerRequest extends FormRequest
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
        return array_merge(UserService::rules(), EmployeeService::rules(), [
            'especialidad' => ['required', 'string',],
            'limite_alumnos' => ['required', 'integer', 'min:10', 'max:30'],
        ]);
    }

    #[Override]
    public function attributes()
    {
        return array_merge(UserService::attributes(), EmployeeService::attributes(), [
            'especialidad' => 'especialidad del entrenador',
            'limite_alumnos' => 'cantidad maxima de alumnos'
        ]);
    }

    #[Override]
    public function messages()
    {
        return array_merge(UserService::messages(), EmployeeService::messages(), [
            'required' => 'El campo :attribute es obligatorio.',
            'string' => 'El campo :attribute debe ser una cadena de caracteres.',
            'min' => 'El campo :attribute tiene un valor inferior al minimo (:min)',
            'max' => 'El campo :attribute tiene un valor mayor al maximo (:max)',
            'integer' => 'El campo :attribute solo admite numeros enteros'
        ]);
    }
}
