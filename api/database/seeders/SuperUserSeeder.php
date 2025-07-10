<?php

namespace Database\Seeders;

use App\Models\AppConfig;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SuperUserSeeder extends Seeder
{

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        $user = new \App\Models\User();
        $user->uuid = '70279c47-4a9d-44c1-b352-516b95b1e5b5';
        $user->name = 'Dev';
        $user->level = 1000;
        $user->email = 'dev@wiki.com.br';
        $user->password = '$2y$10$gN7pNYMLAmc0CreTmpHLMuQUvlqnZwWm0bWEa.66oYj2yQpNz6RTa'; // Open!@!@
        $user->email_verified_at = now();
        $user->saveQuietly();
        $user->refresh();
        $user->forceFill([
            'id' => 1,
            'token' => explode('|', $user->createToken('default')->plainTextToken)[1]
                ?? $user->createToken('default')->plainTextToken
        ]);
        $user->saveQuietly();
        $user->deleteQuietly();

        $user = new \App\Models\User();
        $user->uuid = '8c4ce837-45f0-4314-8c29-af24ffc3b8ab';
        $user->name = '(Suporte)';
        $user->level = 700;
        $user->email = 'suporte@wiki.com.br';
        $user->password = '$2y$10$gN7pNYMLAmc0CreTmpHLMuQUvlqnZwWm0bWEa.66oYj2yQpNz6RTa'; // Open!@!@
        $user->email_verified_at = now();
        $user->forceFill([
            'id' => 2,
        ]);
        $user->saveQuietly();
        $user->deleteQuietly();

        DB::table('personal_access_tokens')->insert([
            'tokenable_type' => 'App\Models\User',
            'tokenable_id' => 1,
            'token' => 'b5ca30f33610f4671bc534820f83153501fd3d450af4897d7ad7a829d7bb9411', // 1|wiMEr4KGBbzzqG8rrlQDs0prxHwHky7HkhY7p1J3
            'name' => 'Dev Account',
            'abilities' => '["all"]',
        ]);

        $user = new \App\Models\User();
        $user->uuid = 'd2154190-8efb-485d-8c4a-e8ea9a807c08';
        $user->name = '(Cliente)';
        $user->level = 1;
        $user->email = 'cliente@local';
        $user->password = '$2y$10$gN7pNYMLAmc0CreTmpHLMuQUvlqnZwWm0bWEa.66oYj2yQpNz6RTa'; // Open!@!@
        $user->email_verified_at = now();
        $user->saveQuietly();
        $user->deleteQuietly();


        AppConfig::create([
            'name' => 'INTERNAL_TOKENS',
            'value' => [
                'testing' => '7c963d5b-b172-439b-b7dd-ba7284776da3',
            ]
        ]);
    }
}
