<?php

namespace App\Listeners;

use App\Events\UserAuthCodeCreated;
use App\Mail\AuthCode;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;
use Illuminate\Queue\InteractsWithQueue;

class SendAuthCode implements ShouldQueue
{
    use InteractsWithQueue;

    public $afterCommit = true;
    public $tries = 5;

    public function handle(UserAuthCodeCreated $event): void
    {
        Mail::to($event->user)->send(
            new AuthCode(
                $event->user,
                $event->user->authcode,
                __('Verification code'),
                __('Your verification code to login on the APP is:'),
            )
        );
    }
}
