<?php

namespace App\Http\Requests;


use Illuminate\Foundation\Http\FormRequest;
use App\Services\EmployeeService;
use App\Services\UserService;
use Override;

class UpdateEmployeeRequest extends FormRequest
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

        $empleado = $this->route('empleado');

        $user_id = $empleado?->user_id;
        $empleado_id = $empleado?->id;

        return array_merge(UserService::rules($user_id), EmployeeService::rules($empleado_id));

    }

    #[Override]
    public function attributes()
    {
        return array_merge(UserService::attributes(), EmployeeService::attributes());
    }

    #[Override]
    public function messages(): array
    {
        return array_merge(UserService::messages(), EmployeeService::messages());
    }
}
