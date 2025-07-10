<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait Uuidable
{

    public static function bootUuidable()
    {
        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = $model->generateUuid();
            }
        });
    }

    public function generateUuid()
    {
        return Str::uuid()->toString();
    }
}
