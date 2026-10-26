<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserService
{
    // Reglas de validación reutilizables maneja tanto update como store.
    // Si el userid es nulo no se ignora nada y la contraseña es requerida
    // si el userid es no nulo, es decir actualizo, la contraseña pasa a ser opcional ya que tengo una y si ignora el id ya que podria generar conflictos consigo mismo
    public static function rules(?int $userId = null): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required', 
                'string', 
                'email', 
                'max:255', 
                Rule::unique('users', 'email')->ignore($userId)->whereNull('deleted_at'),
            ],
            'password' => $userId ? ['nullable', Password::defaults()] : ['required', Password::defaults()],
        ];
    }

    // Atributos
    public static function attributes(): array
    {
        return [
            'name' => 'nombre',
            'email' => 'correo electrónico',
            'password' => 'contraseña',
        ];
    }

    public static function messages(): array
    {
        return [
            'required' => 'el campo :attribute es obligatorio.',
            'unique' => 'el :attribute ingresado pertenece a otro usuario.',
        ];  
    }

    // Creacion
    public function createUser(array $data, string $role): User
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);

        $user->assignRole($role);

        return $user;
    }

    // update
    public function updateUser(User $user, array $data): User
    {
        $user->name = $data['name'];
        $user->email = $data['email'];

        if (!empty($data['password'])) {
            $user->password = bcrypt($data['password']);
        }

        $user->save();

        return $user;
    }
}