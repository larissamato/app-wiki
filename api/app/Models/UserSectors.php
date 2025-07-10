<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\Loggable;
use App\Traits\UserStamps;

class UserSectors extends Model
{
    use HasFactory, Loggable, UserStamps;

    protected $casts = [
        'user'   => 'object',
        'sector' => 'object'
    ];

    protected $fillable = [
        'user_id',
        'sector_id'
    ];

    protected $hidden = [
        'id',
        'user_id',
        'sector_id',
        'created_by',
        'updated_by',
        'created_at',
        'updated_at',
    ];

    protected $with = [
        'sector'
    ];

    public function sector()
    {
        return $this->belongsTo(Sector::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
