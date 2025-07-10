<?php

namespace App\Policies;

use App\Models\KbArticle;
use App\Models\User;
use App\Traits\PolicyCheck;

class KbArticlePolicy
{
    use PolicyCheck;
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, KbArticle $article): bool
    {
        return $this->denyCustomersWithPrivateItem($user, $article, 'is_private');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $this->onlyCollaborators($user);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user): bool
    {
        return $this->onlyCollaborators($user);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user): bool
    {
        return $this->onlySupportUsers($user);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user): bool
    {
        return $this->onlySupportUsers($user);
    }
}
