<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\Loggable;
use App\Traits\UserStamps;

class UserTiers extends Model
{
    use HasFactory, Loggable, UserStamps;

    protected $casts = [
        'user'   => 'object',
        'tier'   => 'object'
    ];

    protected $fillable = [
        'user_id',
        'tier_id'
    ];

    protected $hidden = [
        'id',
        'user_id',
        'tier_id',
        'created_by',
        'updated_by',
        'created_at',
        'updated_at',
    ];

    protected $with = [
        'tier'
    ];

    public function tier(): BelongsTo
    {
        return $this->belongsTo(Tier::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
