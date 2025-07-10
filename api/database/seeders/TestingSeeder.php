<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class TestingSeeder extends Seeder
{

    public function run(): void
    {
        $this->call(SuperUserSeeder::class);

        User::factory()->createOne([
            'name'      => 'Admin User for Testing',
            'email'     => 'admin@testing.local',
            'level'     => 1000
        ]);

        User::factory()->createOne([
            'uuid'      => '76570f6b-b988-33c9-8b2f-8dbc08af4654',
            'name'      => 'Support User for Testing',
            'email'     => 'support@testing.local',
            'level'     => 900
        ]);

        User::factory()->createOne([
            'uuid'      => '368722fa-780c-4c0b-a5a9-06fbc0afad4e',
            'name'      => 'Marcus Tier 3 Commercial',
            'email'     => 'commercial-manager@testing.local',
            'level'     => 750,
        ]);

        User::factory()->createOne([
            'uuid'      => '76570f6b-b988-33c9-8b2f-8dbc08af4654',
            'name'      => 'Commercial User for Testing',
            'email'     => 'commercial@testing.local',
            'level'     => 700
        ]);

        User::factory()->createOne([
            'name'      => 'Customer User for Company Test',
            'email'     => 'customer@testing.local',
        ]);

        User::factory()->createOne([
            'uuid'   => 'ce68b614-e512-40ba-a285-4e1c51ee2f48',
            'name'   => 'Another customer',
            'email'  => 'another@testing.local',
        ]);
    }
}
