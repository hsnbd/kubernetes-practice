<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tag>
 */
class TagFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = $this->faker->unique()->word;
        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'description' => $this->faker->sentence,
            'status' => 'active',
            'image' => 'https://picsum.photos/seed/' . $title . '/200/200',
            'meta_title' => $title,
            'meta_description' => $this->faker->sentence,
            'meta_keywords' => implode(',', $this->faker->words(3)),
            'meta_image' => 'https://picsum.photos/seed/meta-' . $title . '/200/200',
            'meta_data' => json_encode(['extra' => 'info']),
        ];
    }
}
