<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\KbArticleVote>
 */
class KbArticleVoteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory()->state(['level' => 1000]),
            'kb_article_id'  => \App\Models\KbArticle::factory(),
            'vote' => $this->faker->boolean()
        ];
    }
}
