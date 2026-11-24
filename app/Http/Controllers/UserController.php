<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
   public function __construct(protected UserService $userService) {}

   public function index(): Response
   {
      return Inertia::render('users/index', [
         // Solo muestra usuarios administrativos (super y admin)
         'users' => User::withTrashed()
            ->role(['super', 'admin'])
            ->with('roles:id,name')
            ->get(),
      ]);
   }

   public function create(): Response
   {
      return Inertia::render('users/create', [
         'roles' => Role::whereIn('name', ['super', 'admin'])->get(),
      ]);
   }

   public function store(Request $request): RedirectResponse
   {
      $rules = UserService::rules();
      $rules['password'][] = 'confirmed';
      $rules['roles'] = ['required', 'array', 'min:1'];
      $rules['roles.*'] = ['string', 'in:super,admin'];

      $validated = $request->validate(
         $rules,
         UserService::messages(),
         UserService::attributes()
      );

      DB::transaction(function () use ($validated) {
         $this->userService->createUser($validated, $validated['roles']);
      });

      return redirect()->route('users.index')->with('success', 'Usuario administrativo creado correctamente.');
   }

   public function show(User $user): Response
   {
      $this->ensureAdministrativeUser($user);

      return Inertia::render('users/show', [
         'user' => $user->load('roles:id,name'),
         'permissions' => $user->getAllPermissions()->map(fn($perm) => [
            'id' => $perm->id,
            'name' => $perm->name,
         ]),
      ]);
   }

   public function edit(User $user): Response
   {
      $this->ensureAdministrativeUser($user);

      return Inertia::render('users/edit', [
         'user' => $user->only(['id', 'name', 'email']),
         'roles' => Role::whereIn('name', ['super', 'admin'])->get(),
         'userRoles' => $user->roles->pluck('name'),
      ]);
   }

   public function update(Request $request, User $user): RedirectResponse
   {
      $this->ensureAdministrativeUser($user);
      Gate::authorize('update', $user);

      $rules = UserService::rules($user->id);
      $rules['roles'] = ['required', 'array', 'min:1'];
      $rules['roles.*'] = ['string', 'in:super,admin'];

      $validated = $request->validate(
         $rules,
         UserService::messages(),
         UserService::attributes()
      );

      if ($request->user()->id === $user->id && $user->hasRole('super')) {
         if (!in_array('super', $validated['roles'])) {
            return redirect()->back()->withErrors([
               'roles' => 'No puedes quitarte a ti mismo el rol de Super Admin.',
            ])->withInput();
         }
      }

      DB::transaction(function () use ($user, $validated) {
         $this->userService->updateUser($user, $validated);
         $user->syncRoles($validated['roles']);
      });

      return redirect()->route('users.index')->with('success', 'Usuario actualizado correctamente.');
   }

   public function destroy(Request $request, User $user): RedirectResponse
   {
      $this->ensureAdministrativeUser($user);
      Gate::authorize('delete', $user);

      if ($request->user()->id === $user->id) {
         return redirect()->back()->with('error', 'No puedes eliminar tu propio usuario.');
      }

      $this->userService->deleteUser($user);

      return redirect()->route('users.index')->with('success', 'Usuario eliminado correctamente.');
   }

   public function restore(int $id): RedirectResponse
   {
      $user = User::withTrashed()->findOrFail($id);
      $this->ensureAdministrativeUser($user);
      Gate::authorize('restore', $user);

      try {
         $this->userService->restoreUser($user);
         return redirect()->route('users.index')->with('success', 'Usuario restaurado correctamente.');
      } catch (\Exception $e) {
         return redirect()->back()->with('error', $e->getMessage());
      }
   }

   /**
    * Evita que se manipulen clientes, empleados o entrenadores por URL directa desde este CRUD.
    */
   private function ensureAdministrativeUser(User $user): void
   {
      abort_unless($user->hasAnyRole(['super', 'admin']), 404);
   }
}
