<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\KbArticleSave>
 */
class KbArticleSaveFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'kb_article_id' => \App\Models\KbArticle::factory(),
            'user_id' => \App\Models\User::factory(),
        ];
    }
}
