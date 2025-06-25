<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = $this->faker->words(2, true);

        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'description' => $this->faker->sentence,
            'status' => 'active',
            'image' => $this->faker->imageUrl(400, 300, 'category', true),
            'meta_title' => $title,
            'meta_description' => $this->faker->sentence,
            'meta_keywords' => implode(',', $this->faker->words(5)),
            'meta_image' => $this->faker->imageUrl(400, 300, 'meta', true),
            'meta_data' => json_encode(['info' => $this->faker->sentence]),
        ];
    }
}
