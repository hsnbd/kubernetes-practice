<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('description')->nullable();
            $table->string('short_description')->nullable();
            $table->decimal('price', 10, 2)->default(0);
            $table->string('image')->nullable();
            $table->string('status')->default('active');
            $table->string('type')->default('product');
            $table->string('brand')->nullable();
            $table->string('sku')->nullable();
            $table->string('slug')->nullable();
            $table->string('stock')->default(0);
            $table->string('weight')->default(0);
            $table->string('height')->default(0);
            $table->string('width')->default(0);
            $table->string('length')->default(0);
            $table->string('tax')->default(0);
            $table->string('shipping')->default(0);
            $table->string('meta_title')->nullable();
            $table->string('meta_description')->nullable();
            $table->string('meta_keywords')->nullable();
            $table->string('meta_image')->nullable();
            $table->string('meta_data')->nullable();
            $table->foreignId('owner_id')
              ->constrained("users")
              ->onDelete('cascade');
            $table->foreignId('category_id')
              ->constrained();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
