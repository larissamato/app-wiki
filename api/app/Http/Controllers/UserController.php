<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use App\Http\Resources\UserCollection;
use App\Models\User;

class UserController extends Controller
{
    protected static $makeVisible = [
        'can_receive_emails', 'created_at', 'updated_at', 'created_by', 'updated_by'
    ];

    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if ($request->user()->level === 1) {
                abort(401);
            }
            return $next($request);
        });
    }

    protected function setUserLevel(Request $request, User $user, bool $isCreated = true): User
    {
        if (!$request->get('level')) {
            return $user;
        }

        $request->validate([
            'level' => ['integer', 'min:1', 'max:' . $request->user()->level]
        ]);

        $user->level = $request->get('level');
        $user->save();
        return $user;
    }

    protected function whereLevel($request, $user)
    {
        if ($level = $request->get('level')) {
            if ($level == 'collaborators') {
                $user = $user->where('level', '>', 1);
            } else {
                $user = $user->where(['level' => $level]);
            }
        }
        return $user;
    }

    protected function where($request, $user)
    {
        $user = $this->whereLevel($request, $user);

        if ($request->get('inactive')) {
            $user = $user->onlyTrashed();
        }

        return $user;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, User $user)
    {
        $user = $this->where($request, $user);
        $user = $user->orderBy('created_at', 'desc');
        $user = $this->search($request, $user, ['name', 'email']);
        $user = $user->paginate($request->get('perPage') ?? 15);
        $user = $user->setCollection($user->getCollection()->makeVisible(self::$makeVisible));
        return new UserCollection($user);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): User
    {
        $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'roles'    => ['sometimes', 'array'],
        ]);

        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'can_receive_emails' => true,
            'roles' => $request->roles ?? [],
        ];

        if (isset($request->can_receive_emails) && !$request->can_receive_emails) {
            $data['can_receive_emails'] = false;
        }

        $user = User::create($data);
        $token = explode('|', $user->createToken('default')->plainTextToken)[1] ?? $user->createToken('default');
        $user->forceFill(['token' => $token, 'email_verified_at' => now()]);
        $user->save();
        $user = $this->setUserLevel($request, $user);
        return $user;
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return $user->makeVisible(self::$makeVisible);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name'   => ['sometimes', 'string', 'max:255'],
            'roles'  => ['sometimes', 'array'],
        ]);

        $data = $request->all();
        if ($request->filled('password')) {
            $request->validate([
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
            ]);
            $data['password'] = Hash::make($request->password);
        } else {
            $data = $request->except('password', 'password_confirmation');
        }

        if ($request->email && $user->email !== $request->email) {
            $request->validate([
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            ]);
        }

        if (empty($request->roles)) {
            $data['roles'] = [];
        }

        $user->update($data);
        $user = $this->setUserLevel($request, $user, false);
        return $user->makeVisible(self::$makeVisible);
    }

    public function restore(string $userUuid): User
    {
        $user = User::withTrashed()
            ->where(['uuid' => $userUuid])->firstOrFail();
        $user->restore();

        return $user;
    }

    public function destroy(User $user)
    {
        $user->delete();
    }
}
