<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class UserExpire extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:expire';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Expire users logins from manual registration when user e-mail is not verified';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $users = User::where([
            'email_verified_at' => null,
        ])->whereDate('created_at', '<=', today()->subDays(7))->get();

        foreach ($users as $user) {
            $this->info('Disabling ' . count($users) . ' users...');
            $user->obs = 'User disabled by user:expire command at ' . today()->format('Y-m-d H:i:s');
            $user->save();
            $user->delete();
            $this->line('Disabled: #' . $user->id . ':' . $user->email);
        }
    }
}
