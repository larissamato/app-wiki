<?php

namespace App\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class UserAuthCodeCreated
{
    use Dispatchable, SerializesModels;

    public function __construct(public User $user)
    {
    }
}
