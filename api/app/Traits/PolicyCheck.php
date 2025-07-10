<?php

namespace App\Traits;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

trait PolicyCheck
{
    /**
     * Verify if user is customer then check if model has company attached it
     *
     * @return bool true if user is not customer or customer has company attached with model
     **/
    protected function denyCustomerWithNotOwnCompany(User $user, Model $model, $key = 'company_id'): bool
    {
        if ($user->level === 1) {
            if (empty($user->companies)
                || !in_array($model->{$key}, $user->companies->pluck('id')->toArray(), true)
            ) {
                return false;
            }
        }
        return true;
    }

    /**
     * Verify if user is customer and check if model is private
     * @return bool true if user is not customer or user is customer but model is not private
     **/
    protected function denyCustomersWithPrivateItem(User $user, Model $model, string $privateKey = 'is_private'): bool
    {
        if ($user->level === 1 && $model->{$privateKey} == true) {
            return false;
        }
        return true;
    }

    protected function onlyCollaborators(User $user): bool
    {
        if ($user->level > 1) {
            return true;
        }
        return false;
    }

    protected function onlyCustomers(User $user): bool
    {
        return !$this->onlyCollaborators($user);
    }

    protected function onlySupportUsers(User $user): bool
    {
        if ($user->level >= 900) {
            return true;
        }
        return false;
    }

    protected function onlySuperSupportUsers(User $user): bool
    {
        if ($user->level >= 950) {
            return true;
        }
        return false;
    }

    protected function onlyRootUsers(User $user): bool
    {
        if ($user->level === 1000) {
            return true;
        }
        return false;
    }

    protected function onlyManagerCommercial(User $user): bool
    {
        if ($user->level === 750) {
            return true;
        }

        return $this->onlyRootUsers($user);
    }

    protected function isUserRO(User $user): bool
    {
        return preg_match('/"RO"/i', $user->getRawOriginal('roles')) ? true : false;
    }
}
