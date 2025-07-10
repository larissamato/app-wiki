<?php

namespace App\Models;

use Illuminate\Database\Eloquent\BroadcastsEvents;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Traits\Loggable;
use App\Traits\Uuidable;
use App\Observers\UserObserver;
use App\Traits\AppSets;

class User extends Authenticatable
{
    use BroadcastsEvents, HasApiTokens, HasFactory, SoftDeletes, Notifiable, Loggable, Uuidable, AppSets;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'can_receive_emails',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'id',
        'password',
        'remember_token',
        'token',
        'can_receive_emails',
        'last_login_at',
        'created_by',
        'updated_by',
        'created_at',
        'updated_at',
        'deleted_at',
        'avatar',
        'firstlogin_token',
        'authcode',
        'laravel_through_key',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'can_receive_emails' => 'boolean',
        'last_login_at'      => 'datetime',
        'email_verified_at'  => 'datetime',
        'authcode_at'        => 'datetime',
    ];

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    public static function boot(): void
    {
        parent::boot();
        self::observe(UserObserver::class);
    }
}
