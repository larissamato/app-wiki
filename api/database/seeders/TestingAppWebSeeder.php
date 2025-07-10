<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\KbArticle;
use App\Models\KbArticleCategory;
use App\Models\KbArticleSave;
use App\Models\KbArticleVote;
use App\Models\KbCategory;

class TestingAppWebSeeder extends Seeder
{

    protected function createArticleItems(): void
    {
        KbArticle::factory()->count(10)->create();
        KbCategory::factory()->count(10)->create();
        KbArticleCategory::factory()->count(10)->create();
        KbArticleVote::factory()->count(10)->create([
            'user_id' => User::where(['uuid' => 'ee83eb53-26ef-48f8-9c77-51a31dced32f'])->first()->id
        ]);
        KbArticleSave::factory()->count(10)->create([
            'user_id' => User::where(['uuid' => 'ee83eb53-26ef-48f8-9c77-51a31dced32f'])->first()->id
        ]);
    }

    public function run()
    {
        $this->call(DatabaseSeeder::class);
        User::factory()->createOne([
            'uuid'      => 'ee83eb53-26ef-48f8-9c77-51a31dced32f',
            'name'      => 'Admin User for Testing',
            'email'     => 'admin@testing.local',
            'level'     => 1000
        ]);

        User::factory()->createOne([
            'uuid'      => '0b7eb521-b842-4675-85a9-ce285d9dab1c',
            'name'      => 'Dev User for Testing',
            'email'     => 'dev@testing.local',
            'level'     => 1000
        ]);

        User::factory()->createOne([
            'uuid'      => '9212912e-231a-4918-975d-9d4dc104a5c0',
            'name'      => 'Tier 1 only support',
            'email'     => 'n1s@testing.local',
            'level'     => 900
        ]);

        User::factory()->createOne([
            'uuid'      => '36d8db3c-8b1a-4c38-bcf3-49f253061f51',
            'name'      => 'Tier n1a support',
            'email'     => 'n1so@testing.local',
            'level'     => 900
        ]);

        User::factory()->createOne([
            'uuid'      => '76570f6b-b988-33c9-8b2f-8dbc08af4654',
            'name'      => 'Support n1a',
            'email'     => 'support@testing.local',
            'level'     => 900
        ]);

        $customer = User::factory()->createOne([
            'uuid'      => '777519b5-17ca-4bdc-acec-f2eff0f89efe',
            'name'      => 'Customer User for OPEN-DEV-TESTS',
            'email'     => 'customer@testing.local',
        ]);
        $customer->forceFill([
            'firstlogin_token' => 'e0ddecbf-dddf-4bd5-9ac5-c5e13c50ac2a',
        ])->save();

        $this->createArticleItems();
    }
}
