<?php

namespace App\Actions\Fortify;

use App\Models\Client;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    public function __construct(protected UserService $userService) {}

    public function create(array $input): User
    {

        $rules = UserService::rules();
        $rules['password'][] = 'confirmed';
        $rules['telefono'] = ['nullable', 'string', 'max:20'];

        Validator::make(
            $input,
            $rules,
            UserService::messages(),
            UserService::attributes()
        )->validate();

        return DB::transaction(function () use ($input) {
            // 1. Crea el User y le asigna el rol 'client'
            $user = $this->userService->createUser($input, 'client');

            // 2. Crea su perfil asociado en la tabla clients
            Client::create([
                'user_id' => $user->id,
                'telefono' => null,
                'trainer_id' => null,
            ]);

            return $user;
        });
    }
}
