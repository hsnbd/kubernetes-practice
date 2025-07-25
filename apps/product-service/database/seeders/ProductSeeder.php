<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = Category::all();
        
        if ($categories->isEmpty()) {
            // Create some categories if they don't exist
            $categoryNames = ['Electronics', 'Clothing', 'Books', 'Home & Garden'];
            foreach ($categoryNames as $name) {
                $categories[] = Category::create(['name' => $name]);
            }
            $categories = collect($categories);
        }

        $products = [
            [
                'name' => 'iPhone 15 Pro',
                'description' => 'Latest Apple smartphone with advanced features',
                'price' => 999.99,
                'category_id' => $categories->where('name', 'Electronics')->first()->id ?? 1,
            ],
            [
                'name' => 'Samsung Galaxy S24',
                'description' => 'Premium Android smartphone',
                'price' => 899.99,
                'category_id' => $categories->where('name', 'Electronics')->first()->id ?? 1,
            ],
            [
                'name' => 'Nike Air Max',
                'description' => 'Comfortable running shoes',
                'price' => 129.99,
                'category_id' => $categories->where('name', 'Clothing')->first()->id ?? 2,
            ],
            [
                'name' => 'The Great Gatsby',
                'description' => 'Classic American novel',
                'price' => 12.99,
                'category_id' => $categories->where('name', 'Books')->first()->id ?? 3,
            ],
            [
                'name' => 'Coffee Table',
                'description' => 'Modern wooden coffee table',
                'price' => 249.99,
                'category_id' => $categories->where('name', 'Home & Garden')->first()->id ?? 4,
            ],
            [
                'name' => 'Wireless Headphones',
                'description' => 'Noise-cancelling wireless headphones',
                'price' => 199.99,
                'category_id' => $categories->where('name', 'Electronics')->first()->id ?? 1,
            ],
            [
                'name' => 'T-Shirt',
                'description' => 'Cotton basic t-shirt',
                'price' => 19.99,
                'category_id' => $categories->where('name', 'Clothing')->first()->id ?? 2,
            ],
            [
                'name' => 'Garden Tools Set',
                'description' => 'Complete set of gardening tools',
                'price' => 79.99,
                'category_id' => $categories->where('name', 'Home & Garden')->first()->id ?? 4,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
