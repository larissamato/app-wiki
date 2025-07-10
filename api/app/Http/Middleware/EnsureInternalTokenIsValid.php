<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\AppConfig;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureInternalTokenIsValid
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param Closure $next the next request
     */
    public function handle(Request $request, Closure $next): Response
    {
        $tokens = array_values(array_merge(
            (json_decode(env('INTERNAL_TOKENS'), true) ?? []),
            (AppConfig::where(['name' => 'INTERNAL_TOKENS'])->first()->value ?? []),
        ));
        if (!in_array($request->header('opdc-token'), $tokens, true)) {
            abort(401);
        }
        Auth::login(User::withTrashed()->where(['id' => 2])->firstOrFail());
        return $next($request);
    }
}
