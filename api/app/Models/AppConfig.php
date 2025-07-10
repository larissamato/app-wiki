<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Loggable;
use App\Traits\UserStamps;

class AppConfig extends Model
{
    use HasFactory, SoftDeletes, Loggable, UserStamps;

    protected $casts = [
        'value' => 'array'
    ];

    protected $fillable = [
        'name',
        'value'
    ];

    public static function firstByNameOrFail(string $name): array
    {
        return self::where('name', $name)->firstOrFail()['value'];
    }
}
