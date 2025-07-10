<?php

namespace App\Traits;

use Illuminate\Support\Facades\Auth;
use App\Models\Log;

trait Loggable
{
    private static function createLog($model, $mode, $newValue = null, $oldValue = null)
    {
        $ins = [
            'mode' => $mode,
            'table' => $model->getTable(),
            'item_id' => $model->id,
            'created_by' => Auth::id()
        ];

        if ($newValue) {
            $ins['new_value'] = $newValue;
        }

        if ($oldValue) {
            $ins['old_value'] = $oldValue;
        }

        Log::create($ins);
    }

    public static function bootLoggable()
    {
        static::creating(function ($model) {
            self::createLog(
                $model,
                'create',
                $model->toArray()
            );
        });

        static::updating(function ($model) {
            self::createLog(
                $model,
                'update',
                $model->toArray(),
                $model->getOriginal()
            );
        });

        static::deleting(function ($model) {
            self::createLog(
                $model,
                'delete',
                null,
                $model->toArray()
            );
        });
    }
}
