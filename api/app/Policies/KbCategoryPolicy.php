<?php

namespace App\Policies;

use App\Models\KbCategory;
use App\Models\User;
use App\Traits\PolicyCheck;

class KbCategoryPolicy
{
    use PolicyCheck;
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user): bool
    {
        return $this->onlySuperSupportUsers($user);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $this->onlySuperSupportUsers($user);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, KbCategory $kbCategory): bool
    {
        return $this->onlySuperSupportUsers($user);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, KbCategory $kbCategory): bool
    {
        return $this->onlySuperSupportUsers($user);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, KbCategory $kbCategory): bool
    {
        return $this->onlySuperSupportUsers($user);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, KbCategory $kbCategory): bool
    {
        return $this->onlyRootUsers($user);
    }
}
