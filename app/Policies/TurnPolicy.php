<?php

namespace App\Policies;

use App\Models\Turn;
use App\Models\User;
//use Illuminate\Auth\Access\Response;

class TurnPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('listar turnos');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Turn $turn): bool
    {
        return $user->hasPermissionTo('listar turnos');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('crear turnos');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Turn $turn): bool
    {
        return $user->hasPermissionTo('editar turnos');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Turn $turn): bool
    {
        return $user->hasPermissionTo('eliminar turnos');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Turn $turn): bool
    {
        return $user->hasPermissionTo('crear turnos');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Turn $turn): bool
    {
        return $user->hasPermissionTo('eliminar turnos');
    }
}
