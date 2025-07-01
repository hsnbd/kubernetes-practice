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

// Health check with parameter
Route::get('/health/{param}', function ($param) {
    return response()->json([
        'status' => 'ok',
        'service' => 'product-service',
        'param' => $param,
        'timestamp' => now()->toISOString()
    ]);
});

// Simple test route
Route::get('/test', function () {
    return response()->json(['message' => 'Test route works']);
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
