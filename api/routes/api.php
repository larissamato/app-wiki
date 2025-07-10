<?php

use App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Support\Facades\Storage;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// routes with auth
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/constants', [
        Controllers\ConstantController::class, 'index'
    ])->name('constants');

    Route::prefix('kb')->group(function () {
        Route::resource('article', Controllers\KbArticleController::class)
            ->except('create', 'edit')
            ->names('kb.article');

        Route::post('attachment', [Controllers\KbArticleController::class, 'postAttachment'])
            ->name('kb.article.attachment');

        Route::resource('category', Controllers\KbCategoryController::class)
            ->except('create', 'edit')
            ->names('kb.category');

        Route::resource('{article}/vote', Controllers\KbArticleVoteController::class)
            ->except('create', 'edit', 'destroy', 'index')
            ->names('kb.vote');

        Route::get('votes', [
            Controllers\KbArticleVoteController::class, 'index'
        ])->name('kb.vote.index');

        Route::delete('{article}/vote', [
            Controllers\KbArticleVoteController::class, 'destroy'
        ])->name('kb.vote.destroy');

        Route::resource('{article}/save', Controllers\KbArticleSaveController::class)
            ->except('create', 'edit', 'destroy', 'index')
            ->names('kb.save');

        Route::delete('{article}/save', [
            Controllers\KbArticleSaveController::class, 'destroy'
        ])->name('kb.save.destroy');

        Route::get('saves', [
            Controllers\KbArticleSaveController::class, 'index'
        ])->name('kb.save.index');
    });

    Route::prefix('session')->group(function () {
        Route::post('authcode', [
            Controllers\Auth\RegisteredUserController::class, 'checkAuthCode'
        ])->name('session.post_authcode');

        Route::post('authcode-resend', [
            Controllers\Auth\RegisteredUserController::class, 'setAuthCode'
        ])->name('session.resend_authcode');

        Route::get('user', function (Request $request) {
            return \App\Models\User::find($request->user()->id)->makeVisible(['avatar', 'sprite', 'postponed']);
        })->name('session.user');

        Route::put('user', [
            Controllers\Auth\RegisteredUserController::class, 'update'
        ])->name('session.update_user');


        Route::put('user/theme', function (Request $request) {
            $user = \App\Models\User::find($request->user()->id);
            if (!in_array($request->json('theme'), ['default', 'dark'], true)) {
                abort(422, 'Invalid theme');
            }
            $prefs = (array) $user->preferences;
            $user->forceFill(['preferences' => array_merge(
                $prefs,
                ['theme' => $request->json('theme')]
            )]);
            $user->save();
            $user->refresh();
            return $user;
        })->name('session.put_theme');

        Route::get('menu', [
            Controllers\MenuController::class, 'index'
        ])->name('session.menu');

    });

    Route::get('susers', [
        Controllers\Auth\RegisteredUserController::class, 'susers'
    ])->name('susers');

    Route::post('/user/{userUuid}/restore', [
        Controllers\UserController::class, 'restore'
    ])->name('user.restore');

    Route::delete('/user', [
        Controllers\Auth\RegisteredUserController::class, 'destroy'
    ])->name('user.delete');

    Route::resource('user', Controllers\UserController::class)
        ->except('create', 'edit');
});

// public routes

Route::post('/forgot-password', [Controllers\Auth\PasswordResetLinkController::class, 'storeFromApi'])
    ->name('user.forgot-password');

Route::prefix('session')->group(function () {
    // first login
    Route::post('fl', [Controllers\Auth\AuthenticatedSessionController::class, 'getTokenByFirstLoginToken'])
        ->name('session.fl');

    Route::post('login', function (LoginRequest $request, AuthenticatedSessionController $auth) {
        return $auth->store($request, true);
    })->name('session.login');
});

Route::post('/register', [
    Controllers\Auth\RegisteredUserController::class, 'store'
]);
