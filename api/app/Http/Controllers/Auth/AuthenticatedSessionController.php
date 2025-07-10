<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\UserLoginhistory;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Services\Ldap;
use App\Models\User;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     *
     * @return \Illuminate\View\View
     */
    public function create()
    {
        return view('auth.login');
    }

    private function authFromLdap($request, $returnToken)
    {
        if (preg_match('/@wiki.com.br$/', $request->get('email'))) {
            try {
                $ldap = new Ldap();
                $username = explode('@', $request->get('email'))[0];
                if ($ldap->auth($username, $request->get('password'))) {
                    Auth::login(User::where('email', $request->get('email'))->firstOrFail());
                    return true;
                }
            } catch (\Throwable $e) {
                Log::warning($e->getMessage());
            }
        }

        return false;
    }

    /**
     * Handle an incoming authentication request.
     *
     * @param  \App\Http\Requests\Auth\LoginRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(LoginRequest $request, $returnToken = false)
    {
        if (!$this->authFromLdap($request, $returnToken)) {
            $request->authenticate();
        }

        $request->validate([
            'ip' => ['sometimes', 'ip'],
        ]);

        UserLoginhistory::forceCreate([
            'user_id'   => $request->user()->id,
            'useragent' => $request->userAgent(),
            'ip'        => $request->get('ip'),
        ]);

        if ($returnToken) {
            return ['token' => explode('|', $request->user()->token)[1] ?? $request->user()->token];
        }

        $request->session()->regenerate();

        return redirect()->intended(RouteServiceProvider::HOME);
    }

    /**
     * Get token by first login token
     *
     * @param Request $request the request, 'token' is required
     * @return array the array with token
     **/
    public function getTokenByFirstLoginToken(Request $request): array
    {
        $request->validate([
            'token' => ['required', 'uuid', 'exists:users,firstlogin_token']
        ]);

        $user = User::where(['firstlogin_token' => $request->get('token')])->first();

        UserLoginhistory::forceCreate([
            'user_id'   => $user->id,
            'useragent' => $request->userAgent(),
            'ip'        => $request->get('ip'),
        ]);

        $user->forceFill([
            'firstlogin_token' => null
        ])->save();

        return ['token' => explode('|', $user->token)[1] ?? $user->token];
    }

    /**
     * Get token by phone number
     *
     * @param Request $request
     * @return array an array with token and user
     **/
    public function getTokenByPhoneNumber(Request $request): array
    {
        $request->validate([
            'phone' => ['required', 'min:8', 'max:16']
        ]);

        $user = User::getByPhone($request->phone)->first() ?? abort(401);

        UserLoginhistory::forceCreate([
            'user_id'   => $user->id,
            'useragent' => 'omini-whatsapp',
        ]);

        return [
            'token' => explode('|', $user->token)[1] ?? $user->token,
            'user' => $user,
        ];
    }

    /**
     * Destroy an authenticated session.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
