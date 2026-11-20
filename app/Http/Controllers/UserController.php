<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Gate;

class UserController extends Controller
{
   public function index(): Response
   {
      return Inertia::render('users/index', [
         'users' => User::with('roles:id,name')->get(['id', 'name', 'email'])
      ]);
   }

   public function create(): Response
   {
      return Inertia::render('users/create', [
         'roles' => Role::get(['id', 'name'])
      ]);
   }

   public function store(Request $request): RedirectResponse
   {
      $validated = $request->validate([
         'name' => 'required|string|max:255',
         'email' => 'required|string|email|max:255|unique:users,email',
         'password' => ['required', 'confirmed', Password::defaults()],
         'roles' => 'array'
      ]);
      $validated['password'] = Hash::make($validated['password']);
      // Crear usuario
      $user = User::create($validated);
      // Sincronizar roles de Spatie
      if ($request->has('roles')) {
         $user->syncRoles($request->roles);
      }
      return redirect()->route('users.index')->with('success', 'Usuario creado correctamente.');
   }

   /**
    * Muestra la ficha detallada del usuario incluyendo sus permisos heredados.
    */

   public function show(User $user): Response
   {
      return Inertia::render('users/show', [
         'user' => $user->load('roles:id,name'),
         // Obtenemos todos los permisos que el usuario tiene heredados a través de sus roles
         'permissions' => $user->getAllPermissions()->map(fn($perm) => [
            'id' => $perm->id,
            'name' => $perm->name,
         ])
      ]);
   }

   /**
    * Muestra el formulario de edición con los roles actuales pre-marcados.
    */
   public function edit(User $user): Response
   {
      return Inertia::render('users/edit', [
         'user' => $user->only(['id', 'name', 'email']),
         'roles' => Role::get(['id', 'name']),
         'userRoles' => $user->roles->pluck('name') // Array de strings para los checkboxes de React
      ]);
   }

   /**
    * Actualiza los datos del usuario y sus roles resguardando la contraseña.
    */
   public function update(Request $request, User $user): RedirectResponse
   {
      Gate::authorize('update', $user);
      $validated = $request->validate([
         'name' => 'required|string|max:255',
         'email' => 'required|string|email|max:255|unique:users,email,' .
            $user->id,
         'password' => ['nullable', Password::defaults()],
         'roles' => 'array'
      ]);
      // REGLA CRÍTICA DE ROL: Evitar que un Super Admin se quite el rol a símismo
      if ($request->user()->id === $user->id && $user->hasRole('super')) {
         // Buscamos si dentro del array 'roles' que viene del formulario seincluyó 'Super Admin'
         if (!in_array('super', $request->input('roles', []))) {
            return redirect()->back()->withErrors([
               'roles' => 'No puedes quitarte a ti mismo el rol de Super Admin.'
            ])->withInput();
         }
      }

      // Manejo seguro de la contraseña: si no se envía, se remueve del arraypara no pisarla
      if (!empty($validated['password'])) {
         $validated['password'] = Hash::make($validated['password']);
      } else {
         unset($validated['password']);
      }

      // Actualizar datos de identidad
      $user->update($validated);
      // Sincronización robusta de roles (si se desmarcan todos, limpia la tablaintermedia automáticamente)
      $user->syncRoles($request->input('roles', []));
      return redirect()->route('users.index')->with('success', 'Usuario actualizado correctamente.');
   }

   public function destroy(User $user): RedirectResponse
   {
      // Spatie elimina automáticamente las relaciones de la tabla intermedia gracias a claves foráneas cascade
      Gate::authorize('delete', $user);

      $user->delete();
      return redirect()->route('users.index')->with('success', 'Usuario eliminado correctamente.');
   }
}
