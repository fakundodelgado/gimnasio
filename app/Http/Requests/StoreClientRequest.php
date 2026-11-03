<?php

namespace App\Http\Requests;

//use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use App\Services\UserService;
use Override;

class StoreClientRequest extends FormRequest
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
        return array_merge(UserService::rules(), [
            'telefono' => ['nullable', 'string', 'digits_between:8,15'],
            'trainer_id' => ['nullable', 'exists:trainers,id'],
        ]);
    }

    #[Override]
    public function attributes()
    {
        return array_merge(UserService::attributes(), ['telefono' => 'contacto del cliente']);
    }

    #[Override]
    public function messages(): array
    {
        return array_merge(UserService::messages(), ['digits_between' => 'el campo :attribute solo acepta entre 8 y 15 numeros']);
    }
}
