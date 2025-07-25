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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->enum('status', ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])->default('pending');
            $table->decimal('total', 10, 2)->nullable();
            $table->timestamps();
            
            // Note: Foreign key constraint to Users table would be handled by user-service
            // In a microservices architecture, we typically don't have foreign keys across services
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
