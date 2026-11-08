<?php

namespace App\Http\Requests;

use App\Services\EmployeeService;
use App\Services\UserService;
//use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Override;

class UpdateTrainerRequest extends FormRequest
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

        $entrenador = $this->route('entrenador');

        $user_id = $entrenador?->employee?->user_id;
        $employee_id = $entrenador?->employee_id;

        return array_merge(UserService::rules($user_id), EmployeeService::rules($employee_id), [
            'especialidad' => ['required', 'string', 'max:255'],
            'limite_alumnos' => ['required', 'min:10', 'integer', 'max:30'],
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
