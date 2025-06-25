<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = $this->faker->words(3, true);
        $slug = Str::slug($title);
        return [
            'title' => $title,
            'description' => $this->faker->paragraph,
            'short_description' => $this->faker->sentence,
            'price' => $this->faker->randomFloat(2, 10, 500),
            'image' => 'https://picsum.photos/seed/' . $slug . '/600/400',
            'status' => 'active',
            'type' => 'product',
            'brand' => $this->faker->company,
            'sku' => strtoupper(Str::random(8)),
            'slug' => $slug,
            'stock' => $this->faker->numberBetween(0, 100),
            'weight' => $this->faker->randomFloat(2, 0.5, 5),
            'height' => $this->faker->randomFloat(2, 10, 50),
            'width' => $this->faker->randomFloat(2, 10, 50),
            'length' => $this->faker->randomFloat(2, 10, 50),
            'tax' => $this->faker->randomFloat(2, 0, 15),
            'shipping' => $this->faker->randomFloat(2, 0, 20),
            'meta_title' => $title,
            'meta_description' => $this->faker->sentence,
            'meta_keywords' => implode(',', $this->faker->words(5)),
            'meta_image' => 'https://picsum.photos/seed/meta-' . $slug . '/400/300',
            'meta_data' => json_encode(['custom' => 'value']),
            'owner_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'category_id' => Category::inRandomOrder()->first()->id ?? Category::factory(),
        ];
    }
}
