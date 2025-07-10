<?php

namespace App\Traits;

use Illuminate\Support\Facades\Auth;
use App\Models\User;

trait UserStamps
{
    public static function bootUserStamps()
    {
        static::creating(function ($model) {
            $model->created_by = Auth::id() ?? 2;
        });

        static::updating(function ($model) {
            $model->updated_by = Auth::id() ?? 2;
        });

        static::deleting(function ($model) {
            $model->updated_by = Auth::id() ?? 2;
        });
    }

    protected function getCreatedOrUpdatedByUserById(int|null $userId): User|null
    {
        if (!$userId) {
            return null;
        }
        return User::withTrashed()
            ->select(['id', 'uuid', 'name', 'email', 'level'])
            ->without('companies')
            ->without('entity')
            ->without('sectors')
            ->where(['id' => $userId])->first();
    }

    public function getCreatedByAttribute(int|null $createdBy): User|null
    {
        return $this->getCreatedOrUpdatedByUserById($createdBy);
    }

    public function getUpdatedByAttribute(int|null $updatedBy): User|null
    {
        return $this->getCreatedOrUpdatedByUserById($updatedBy);
    }
}
