<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\KbCategory>
 */
class KbCategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'category_parent_id' => $this->faker->boolean(50)
                ? \App\Models\KbCategory::factory()
                : null,
            'name' => $this->faker->name,
            'slug' => $this->faker->unique()->slug,
        ];
    }
}
