<?php

use App\Http\Controllers\Api\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Public product routes
Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::get('/{id}', [ProductController::class, 'show']);
});

// Public category routes
Route::prefix('categories')->group(function () {
    Route::get('/', [ProductController::class, 'categories']);
    Route::get('/{categoryId}/products', [ProductController::class, 'productsByCategory']);
});
