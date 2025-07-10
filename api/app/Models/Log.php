<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Log extends Model
{
    use HasFactory;

    protected $casts = [
        'old_value' => 'object',
        'new_value' => 'object'
    ];

    protected $fillable = [
        'mode',
        'table',
        'item_id',
        'new_value',
        'old_value',
        'created_by'
    ];
}
