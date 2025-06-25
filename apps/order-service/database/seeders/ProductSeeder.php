<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory(10)->create();
        Category::factory(5)->create();
        Tag::factory(15)->create();

        Product::factory(30)
            ->create()
            ->each(function ($product) {
                $tagIds = Tag::inRandomOrder()->limit(rand(2, 5))->pluck('id');
                $product->tags()->attach($tagIds);
            });
    }
}
