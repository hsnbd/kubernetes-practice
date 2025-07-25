<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Health check route for microservice
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'product-service',
        'timestamp' => now()->toISOString()
    ]);
});

// Temporary API routes for testing
Route::prefix('api')->group(function () {
    Route::prefix('products')->group(function () {
        Route::get('/', [App\Http\Controllers\Api\ProductController::class, 'index']);
        Route::get('/{id}', [App\Http\Controllers\Api\ProductController::class, 'show']);
    });

    Route::prefix('categories')->group(function () {
        Route::get('/', [App\Http\Controllers\Api\ProductController::class, 'categories']);
        Route::get('/{categoryId}/products', [App\Http\Controllers\Api\ProductController::class, 'productsByCategory']);
    });
});
