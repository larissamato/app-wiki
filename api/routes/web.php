<?php

use App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use App\Models\TicketFollowups;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

require __DIR__.'/auth.php';

Route::middleware(['auth'])->group(function () {

    Route::get('/', function (Request $request) {
        setcookie('token', $request->user()->token);
        return redirect()->to('/apidoc');
    });

    Route::get('/token', function (Request $request) {
        return ['token' => $request->user()->token];
    });

    Route::get('/api.yaml', function (Request $request) {
        if ($request->user()->level === 1 && app()->environment('production')) {
            return '';
        }
        return file_get_contents(resource_path('api.yaml'));
    });

    Route::get('/apidoc', function (Request $request) {
        if ($request->user()->level === 1 && app()->environment('production')) {
            return redirect()->away('https://app.wiki.example');
        }
        setcookie('token', $request->user()->token);
        return view('swagger');
    });
});


Route::get('/kb/attachment/{slug}', function ($slug) {
    $file = Storage::disk('kb')->readStream($slug);
    header('Access-Control-Allow-Origin: * ');
    header('Content-Type: ' . mime_content_type($file));
    echo stream_get_contents($file);
});


Route::get('/oauth', function (Request $request) {
    return Socialite::driver('google')->redirect();
});

Route::get(
    '/oauth-callback/{service}',
    [Controllers\Auth\RegisteredUserController::class, 'oauthCallback']
)->name('oauth-callback');


Route::get('/version', function () {
    return file_get_contents(storage_path('app/version.json'));
});
