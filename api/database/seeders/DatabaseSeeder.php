<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Services\TicketSyncTkid;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(SuperUserSeeder::class);
        $userFactory = \App\Models\User::factory();

        for ($i = 0; $i < 20; $i++) {
            $userFactory->createOneQuietly();
        }
    }
}
