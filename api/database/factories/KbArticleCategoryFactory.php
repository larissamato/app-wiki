<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\KbArticleCategory>
 */
class KbArticleCategoryFactory extends Factory
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
            'kb_category_id' =>  \App\Models\KbCategory::factory()
        ];
    }
}
