<?php

namespace App\Http\Controllers\Auth;

use App\Events\UserAuthCodeCreated;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserCollection;
use App\Models\Entity;
use App\Models\EntityCompanies;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Laravel\Socialite\Facades\Socialite;

class RegisteredUserController extends Controller
{
    protected static $marketOnlineTags = ['MARKETONLINE', 'PODS'];

    protected function isDisposableEmail($email): bool
    {
        $disposable_domains = file(
            storage_path('blocklists/disposable-emails.txt'),
            FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES
        );
        $domain = mb_strtolower(explode('@', trim($email))[1]);
        return in_array($domain, $disposable_domains);
    }

    public function checkAuthCode(Request $request)
    {
        if (RateLimiter::tooManyAttempts('check-authcode:' . $request->user()->uuid, 5)) {
            abort(429, __('Too Many Requests'));
        }
        $request->validate([
            'authcode' => ['required', 'numeric', 'digits:6']
        ]);
        if ((string) $request->get('authcode') === $request->user()->authcode) {
            $request->user()->forceFill([
                'authcode_at' => null,
                'authcode' => null,
                'email_verified_at' => now()
            ])->saveQuietly();
            return; // only return 200
        }
        RateLimiter::hit('check-authcode:' . $request->user()->uuid);
        abort(422, __('Invalid code'));
    }

    public function setAuthCode(Request $request, bool $throttle = true): void
    {
        if ($throttle && $request->user()->authcode_at && now()->diffInMinutes($request->user()->authcode_at) < 2) {
            abort(422, __('We already sent the code to your email. You can try again after couple minutes'));
        }
        RateLimiter::clear('check-authcode:' . $request->user()->uuid);
        $request->user()->forceFill([
            'authcode' => \App\Constants::randomAuthCode(),
            'authcode_at' => now()
        ]);
        $request->user()->saveQuietly();
        UserAuthCodeCreated::dispatch($request->user());
    }

    /**
     * Handle an incoming registration request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): array
    {
        $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'email', 'unique:users'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);
        if ($this->isDisposableEmail($request->email)) {
            abort(422, __('Invalid email domain'));
        }
        $user = new User();
        $user->forceFill([
            'name'      => $request->name,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'email_verified_at' => now(),
        ])->save();
        $user->refresh();
        return [
            'token' => $user->token
        ];
    }

    public function oauthCallback(string $service, Request $request): RedirectResponse
    {
        $redirectPath = env('WEB_URL', 'https://app.wiki.example') . '/floauth?token=';

        $driver = match ($service) {
            'google' => 'google',
            default => abort(422, 'Invalid request'),
        };

        $userOauth = Socialite::driver($driver)->user();

        if ($user = User::where(['email' => $userOauth->getEmail()])->first()) {
            return redirect($redirectPath . $user->token);
        }

        $password = Str::random(16);
        $storeReq = new Request();
        $storeReq->acceptsJson();
        $storeReq->setMethod('POST');
        $storeReq->request->add([
            'name'  => $userOauth->getName(),
            'email' => $userOauth->getEmail(),
            'password' => $password,
            'password_confirmation' => $password,
        ]);

        return redirect($redirectPath . $this->store($storeReq)['token']);
    }

    /**
     * First only support update current user password for now
     *
     * @param Request $request
     **/
    public function update(Request $request)
    {
        $update = [];
        if ($request->has('password')) {
            $request->validate([
                'password' => ['required', Rules\Password::defaults()]
            ]);
            $update['password'] = Hash::make($request->password);
        }
        if ($request->has('name')) {
            $request->validate([
                'name'  => ['required', 'max:255']
            ]);
            $update['name'] = $request->get('name');
        }
        if ($request->has('avatar')) {
            $request->validate([
                'avatar' => 'required'
            ]);
            $update['avatar'] = $request->get('avatar');
        }
        $user = $request->user()->forceFill($update);
        $user->save();
        $user->refresh();
        return $user->makeVisible(['avatar']);
    }

    public function updateMobileTokens(Request $request)
    {
        $request->validate([
            'token' => ['required']
        ]);

        $userCurrentTokens = $request->user()->mobile_tokens ?? [];
        if (in_array($request->token, $userCurrentTokens, true)) {
            return $userCurrentTokens;
        }
        $userCurrentTokens[] = $request->token;
        $user = $request->user()->forceFill(['mobile_tokens' => $userCurrentTokens]);
        $user->save();
        $user->refresh();
        return $user->makeVisible('mobile_tokens')->mobile_tokens;
    }

    public function deleteMobileToken(Request $request)
    {
        $request->validate([
            'token' => ['required']
        ]);
        $userCurrentTokens = $request->user()->mobile_tokens ?? [];
        $newUserCurrentTokens = array_values(
            array_filter(
                array_map(function ($arr) use ($request) {
                    if ($arr == $request->token) {
                        return;
                    }
                    return $arr;
                }, $userCurrentTokens)
            )
        );
        $user = $request->user()->forceFill(['mobile_tokens' => (array) $newUserCurrentTokens]);
        $user->save();
        $user->refresh();
        return $user->makeVisible('mobile_tokens')->mobile_tokens;
    }

    public function susers(Request $request)
    {
        if ($request->user()->level == 1) {
            abort(403, 'Unathorized');
        }
        $user = User::where('level', '>', 1)->without('companies')->without('entity')->orderBy('name');
        $onlyUuids = $this->searchOnlyUuids($request, $user);
        if (!$onlyUuids) {
            $user = $this->search($request, $user, ['name', 'email']);
        } else {
            $user = $onlyUuids;
        }
        $user->orWhereHas('sectors.sector', function ($query) use ($request) {
            $query->where('name', 'like', '%' . $request->get('search') . '%');
        });
        if (!$request->has('noOpenTicket')) {
            $user = $user->withCount(['tickets as tickets_open_count' => function (Builder $query) {
                $query->open();
            }]);
        }
        return new UserCollection($user->paginate($request->get('perPage') ?? 15));
    }

    public function destroy(Request $request)
    {
        if (!$request->user()) {
            abort(422, 'Invalid request');
        }
        $request->user()->delete();
        return;
    }
}
