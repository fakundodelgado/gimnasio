<?php

namespace App\Services;

use App\Models\Employee;
use Illuminate\Validation\Rule;

class EmployeeService{

    public static function rules(?int $employee_id = null): array
    {

        return [
            'cuil' => ['required', 'digits:11', Rule::unique('employees', 'cuil')->ignore($employee_id)->whereNull('deleted_at')],
            'telefono' => ['required', 'digits_between:8,15'],
        ];

    }

    public static function attributes(): array 
    {

        return [
            'cuil' => 'CUIL',
            'telefono' => 'contacto del empleado'
        ];

    }

    public static function messages(): array 
    {
        return [
            'required' => 'El campo :attribute es obligatrio.',
            'unique' => 'El :attribute ingresado ya le pertenece a otro empleado.',
            'digits' => 'El campo :attribute solo puede contener digitos.',
            'digits_between' => 'El campo :attribute debe contener como minimo 8 digitos.'
        ];
    }

    public static function createEmployee(int $user_id, array $data): Employee {
        $empleado = Employee::create([
            'user_id' => $user_id,
            'cuil' => $data['cuil'],
            'telefono' => $data['telefono']
        ]);

        return $empleado;
    }

    public static function updateEmployee(Employee $empleado, array $data): Employee {

        $empleado->cuil = $data['cuil'];
        $empleado->telefono = $data['telefono'];
        
        $empleado->save();

        return $empleado;

    }

}